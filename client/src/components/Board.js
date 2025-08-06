import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Card from "./Card";
import { useMemory } from "../context/MemoryContext";
import Timer from "./Timer";
import { useNavigate } from "react-router-dom";

function Board() {
  const { state, dispatch } = useMemory();
  const { size, currentUser } = state;
  const [cards, setCards] = useState([]);
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
    const startGame = async () => {
      try {
        const response = await axios.post(
          "http://localhost:8000/board/start",
          { size },
          { withCredentials: true }
        );
        setCards(response.data.board);
      } catch (error) {
        console.error("Nie udało się rozpocząć gry:", error);
      }
    };

    startGame();
  }, [size, navigate]);

  const handleChoice = async (card) => {
    if (disabled || card.isFlipped) return;

    if (!firstMoveMade) {
      setFirstMoveMade(true);
      dispatch({ type: "START_TIMER" });
    }

    setDisabled(true);

    try {
      const response = await axios.post(
        "http://localhost:8000/board/reveal",
        { cardId: card.id },
        { withCredentials: true }
      );

      const { card: revealedCard, match, card1, card2 } = response.data;

      setCards((prevCards) =>
        prevCards.map((c) =>
          c.id === revealedCard.id ? { ...c, ...revealedCard } : c
        )
      );

      if (match === true) {
        setCards((prevCards) =>
          prevCards.map((c) =>
            c.id === card1 || c.id === card2 ? { ...c, isMatched: true } : c
          )
        );
        setDisabled(false);
      } else if (match === false) {
        setTimeout(() => {
          setCards((prevCards) =>
            prevCards.map((c) =>
              c.id === card1 || c.id === card2 ? { ...c, isFlipped: false } : c
            )
          );
          setDisabled(false);
        }, 1000);
      } else {
        setDisabled(false);
      }
    } catch (error) {
      console.error("Błąd podczas odkrywania karty:", error);
      setDisabled(false);
    }
  };

  useEffect(() => {
    if (cards.length > 0 && cards.every((card) => card.isMatched)) {
      dispatch({ type: "STOP_TIMER" });
      setTimeout(() => {
        navigate("/game/finish");
      }, 1000);
    }
  }, [cards, dispatch, navigate]);

  return (
    <div className="board-window">
      <div className="user-container">
        <h3>{currentUser?.login}</h3>
        <Timer />
      </div>
      <div className={`grid-container-${size}`}>
        {cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            handleChoice={handleChoice}
            flipped={card.isFlipped || card.isMatched}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
}

export default Board;
