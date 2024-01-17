import React, { useState, useEffect } from "react";
import axios from "axios";
// import mqtt from "mqtt";
// import Cookies from "js-cookie";
import Card from "./Card";
import { useMemory } from "../context/MemoryContext";
import Timer from "./Timer";

function Board() {
  const { state } = useMemory();
  const { size, currentUserId } = state;
  const [array, setArray] = useState([]);
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [firstMoveMade, setFirstMoveMade] = useState(false);

  // const mqttClient = mqtt.connect("ws://localhost:8000");

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

        const loginResponse = await axios.get(
          `http://localhost:8000/getLoginById/${currentUserId}`
        );
        setCurrentUser(loginResponse.data.login);
      } catch (error) {
        console.error("Nie udało się pobrać danych:", error);
      }
    };

    fetchData();
  }, [size, currentUserId]);

  const handleChoice = async (card) => {
    if (!firstMoveMade) {
      setFirstMoveMade(true);
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
      const fetchData = async () => {
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
        } catch (error) {
          console.error("Błąd podczas porównywania kafelków:", error);
        }
      };
      fetchData();
    }
  }, [choiceOne, choiceTwo, array]);

  return (
    <div className="board-window">
      <h3>{currentUser}</h3>
      <Timer startTimer={firstMoveMade} />
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
