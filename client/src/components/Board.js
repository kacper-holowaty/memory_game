import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Card from "./Card";
import { useMemory } from "../context/MemoryContext";
import Timer from "./Timer";
import { useNavigate } from "react-router-dom";

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

function Board() {
  const { state, dispatch } = useMemory();
  const { size, currentUser } = state;
  const [array, setArray] = useState([]);
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [firstMoveMade, setFirstMoveMade] = useState(false);
  const navigate = useNavigate();
  const fetchDataCalled = useRef(false);

  useEffect(() => {
    if (!size) {
      navigate("/");
      return;
    }
    if (fetchDataCalled.current) {
      return;
    }
    fetchDataCalled.current = true;

    const fetchData = async () => {
      try {
        const response = await axios.post(
          "http://localhost:8000/board",
          { size },
          { withCredentials: true }
        );
        const unshuffledBoard = response.data.board;
        setArray(shuffleArray(unshuffledBoard));
      } catch (error) {
        console.error("Nie udało się pobrać danych:", error);
      }
    };

    fetchData();
  }, [size, navigate]);

  const handleChoice = (card) => {
    if (!firstMoveMade) {
      setFirstMoveMade(true);
      dispatch({ type: "START_TIMER" });
    }
    if (choiceOne) {
      if (choiceOne !== card) {
        setChoiceTwo(card);
      }
    } else {
      setChoiceOne(card);
    }
  };

  const resetChoices = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setDisabled(false);
  };

  useEffect(() => {
    if (choiceOne && choiceTwo) {
      setDisabled(true);
      if (choiceOne.emoji === choiceTwo.emoji) {
        setArray((prevArray) =>
          prevArray.map((card) =>
            card.emoji === choiceOne.emoji
              ? { ...card, matched: true }
              : card
          )
        );
        resetChoices();
      } else {
        setTimeout(() => resetChoices(), 1000);
      }
    }
  }, [choiceOne, choiceTwo]);

  useEffect(() => {
    if (array.length > 0 && array.every((card) => card.matched)) {
      dispatch({ type: "STOP_TIMER" });
      setTimeout(() => {
        navigate("/game/finish");
      }, 3000);
    }
  }, [array, dispatch, navigate]);

  return (
    <div className="board-window">
      <div className="user-container">
        <h3>{currentUser?.login}</h3>
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
