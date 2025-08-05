import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Card from "./Card";
import { useMemory } from "../context/MemoryContext";
import Timer from "./Timer";
import { useNavigate } from "react-router-dom";

function Board() {
  const { state, dispatch } = useMemory();
  const { size, currentUser } = state;
  const [array, setArray] = useState([]);
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [firstMoveMade, setFirstMoveMade] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post("http://localhost:8000/board", {
          size,
        });
        const almostReady = response.data.board;
        const readyArray = await axios.put("http://localhost:8000/board", {
          list: almostReady,
        });
        setArray(readyArray.data.shuffledList);

        const userIdFromCookie = Cookies.get("user_id");
        const loginResponse = await axios.get(
          `http://localhost:8000/getLoginById/${userIdFromCookie}`
        );
        dispatch({
          type: "SET_CURRENT_USER",
          payload: loginResponse.data.login,
        });
      } catch (error) {
        console.error("Nie udało się pobrać danych:", error);
      }
    };

    fetchData();
  }, [size, dispatch]);

  const handleChoice = (card) => {
    if (!firstMoveMade) {
      setFirstMoveMade(true);
      dispatch({ type: "START_TIMER" });
    }
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
  };

  const resetChoices = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setDisabled(false);
  };

  useEffect(() => {
    if (choiceOne && choiceTwo) {
      setDisabled(true);
      const checkTiles = async () => {
        try {
          const response = await axios.put(
            "http://localhost:8000/board/match",
            {
              choiceOne,
              choiceTwo,
              board: array,
            }
          );

          const { areEqual, updatedBoard } = response.data;

          if (areEqual) {
            setArray(updatedBoard || array);
            resetChoices();
          } else {
            setTimeout(() => resetChoices(), 1000);
          }

          if (updatedBoard && updatedBoard.every((x) => x.matched === true)) {
            dispatch({ type: "STOP_TIMER" });
            setTimeout(() => {
              navigate("/game/finish");
            }, 3000);
          }
        } catch (error) {
          console.error("Błąd podczas porównywania kafelków:", error);
        }
      };
      checkTiles();
    }
  }, [choiceOne, choiceTwo, array, navigate, dispatch]);

  return (
    <div className="board-window">
      <div className="user-container">
        <h3>{currentUser}</h3>
        <Timer />
      </div>
      <div className={`grid-container-${size}`}>
        {array.map((card, index) => (
          <Card
            key={index}
            card={card}
            handleChoice={handleChoice}
            flipped={card === choiceOne || card === choiceTwo || card.matched}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
}

export default Board;
