import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Card from "./Card";
import { useMemory } from "../context/MemoryContext";
import Timer from "./Timer";
import Comments from "./Comments";
import { useNavigate } from "react-router-dom";

function Board() {
  const { state } = useMemory();
  const { size } = state;
  const [array, setArray] = useState([]);
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [firstMoveMade, setFirstMoveMade] = useState(false);
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const webSocket = new WebSocket("ws://localhost:8000");

    webSocket.onopen = () => {
      console.log("WebSocket połączony");
    };
    setSocket(webSocket);

    return () => {
      webSocket.close();
    };
  }, []);

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
        setCurrentUser(loginResponse.data.login);
      } catch (error) {
        console.error("Nie udało się pobrać danych:", error);
      }
    };

    fetchData();
  }, [size]);

  const handleChoice = (card) => {
    if (!firstMoveMade) {
      setFirstMoveMade(true);

      socket.send("start");
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

          if (updatedBoard) {
            if (updatedBoard.every((x) => x.matched === true)) {
              if (socket) {
                socket.send("stop");
                // dodanie wyniku do bazy (metoda post)
                setTimeout(() => {
                  navigate("/game/finish");
                }, 5000);
              }
            }
          }
        } catch (error) {
          console.error("Błąd podczas porównywania kafelków:", error);
        }
      };
      checkTiles();
    }
  }, [choiceOne, choiceTwo, array, socket, navigate]);

  return (
    <div className="board-window">
      <div className="user-container">
        <h3>{currentUser}</h3>
        <Timer />
        <Comments />
      </div>
      <div className="grid-container">
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
