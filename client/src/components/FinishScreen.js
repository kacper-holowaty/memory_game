import React, { useEffect, useRef } from "react";
import { useMemory } from "../context/MemoryContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function FinishScreen() {
  const { state, dispatch } = useMemory();
  const { size, currentUser, time } = state;
  const navigate = useNavigate();
  const scoreSent = useRef(false);

  useEffect(() => {
    const saveScore = async () => {
      if (currentUser && size && time && !scoreSent.current) {
        scoreSent.current = true;
        await axios.post("http://localhost:8000/scores", {
          size,
          currentUser,
          gameTime: time,
        });
      }
    };
    saveScore();
  }, [currentUser, size, time]);

  const resetGame = async () => {
    dispatch({ type: "RESET_TIMER" });
    dispatch({ type: "SET_SIZE", payload: null });
    dispatch({ type: "SET_CURRENT_USER", payload: null });
    await axios.delete("http://localhost:8000/logout", {
      withCredentials: true,
    });
    navigate("/");
  };
  const handleScores = () => {
    navigate("/leaderboard");
  };

  const playAgain = async () => {
    dispatch({ type: "RESET_TIMER" });
    dispatch({ type: "SET_SIZE", payload: null });
    await axios.delete("http://localhost:8000/playagain", {
      withCredentials: true,
    });
    navigate("/");
  };

  const displayTime = () => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    const formattedSeconds = String(seconds).padStart(2, "0");

    if (time < 60) {
      return `${time} s`;
    } else {
      return `${minutes}:${formattedSeconds} min`;
    }
  };

  return (
    <div className="finish-screen-container">
      <h2>Gratulacje {currentUser} udało ci się ukończyć grę!</h2>
      <h2>Twój czas: {displayTime()}</h2>
      <div className="finish-screen-buttons">
        <button onClick={resetGame}>Zakończ grę</button>
        <button onClick={playAgain}>Zagraj ponownie</button>
        <button className="leaderboard-button" onClick={handleScores}>
          Najlepsze wyniki
        </button>
      </div>
    </div>
  );
}

export default FinishScreen;
