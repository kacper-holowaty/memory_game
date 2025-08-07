import React, { useState, useEffect } from "react";
import api from "../api/axios";
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
  const [isPaused, setIsPaused] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!size) {
      navigate("/");
      return;
    }
    const startGame = async () => {
      try {
        const response = await api.post("/board/start", { size });
        setCards(response.data.board);
      } catch (error) {
        console.error("Nie udało się rozpocząć gry:", error);
      }
    };

    startGame();
  }, [size, navigate]);

  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    const handlePopState = () => {
      setIsPaused(true);
      window.history.pushState(null, "", window.location.href);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const handleChoice = async (card) => {
    if (disabled || card.isFlipped) return;

    if (!firstMoveMade) {
      setFirstMoveMade(true);
      dispatch({ type: "START_TIMER" });
    }

    setDisabled(true);

    try {
      const response = await api.post("/board/reveal", {
        cardId: card.id,
      });

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

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setIsPaused((prev) => !prev);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (isPaused) {
      dispatch({ type: "STOP_TIMER" });
    } else if (firstMoveMade) {
      dispatch({ type: "START_TIMER" });
    }
  }, [isPaused, firstMoveMade, dispatch]);

  const handleContinue = () => {
    setIsPaused(false);
    navigate(1);
  };

  const handleEndGame = async () => {
    try {
      await api.delete("/logout");
      dispatch({
        type: "SET_CURRENT_USER",
        payload: { user: null, token: null },
      });
      dispatch({ type: "RESET_TIMER" });
      navigate("/");
    } catch (error) {
      console.error("Błąd podczas wylogowywania:", error);
    }
  };

  return (
    <div className="board-window">
      {isPaused && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Pauza⏸️</h2>
            <div className="modal-buttons">
              <button onClick={handleContinue}>Kontynuuj</button>
              <button onClick={handleEndGame}>Zakończ grę</button>
            </div>
          </div>
        </div>
      )}
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
            disabled={disabled || isPaused}
          />
        ))}
      </div>
    </div>
  );
}

export default Board;
