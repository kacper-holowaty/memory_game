import React, { useEffect, useRef, useState } from "react";
import { useMemory } from "../context/MemoryContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import config from '../config';

function FinishScreen() {
  const { state, dispatch } = useMemory();
  const { size, currentUser, time } = state;
  const navigate = useNavigate();
  const scoreSent = useRef(false);
  const [newScoreId, setNewScoreId] = useState(null);

  useEffect(() => {
    const saveScore = async () => {
      if (currentUser && size && time && !scoreSent.current) {
        scoreSent.current = true;
        const response = await axios.post(
          `${config.API_URL}/scores`,
          {
            size,
            currentUser: currentUser.login,
            gameTime: time,
          },
          { withCredentials: true }
        );
        if (response.data.success) {
          setNewScoreId(response.data.scoreId);
        }
      }
    };
    saveScore();
  }, [currentUser, size, time]);

  const resetGame = async () => {
    dispatch({ type: "RESET_TIMER" });
    dispatch({ type: "SET_SIZE", payload: null });
    dispatch({ type: "SET_CURRENT_USER", payload: null });
    await axios.delete(`${config.API_URL}/logout`, {
      withCredentials: true,
    });
    navigate("/");
  };
  const handleScores = () => {
    navigate("/leaderboard", { state: { newScoreId: newScoreId } });
  };

  const playAgain = () => {
    dispatch({ type: "RESET_TIMER" });
    dispatch({ type: "SET_SIZE", payload: null });
    navigate("/");
  };

  const displayTime = () => {
    const minutes = Math.floor(time / 6000);
    const seconds = Math.floor((time % 6000) / 100);
    const centiseconds = time % 100;

    const formattedCentiseconds = String(centiseconds).padStart(2, "0");

    if (minutes > 0) {
      const formattedSeconds = String(seconds).padStart(2, "0");
      return `${minutes} min ${formattedSeconds}.${formattedCentiseconds} s`;
    } else {
      return `${seconds}.${formattedCentiseconds} s`;
    }
  };

  return (
    <div className="finish-screen-container">
      <div className="finish-screen-content">
        <h2>Gratulacje, {currentUser?.login}!</h2>
        <p className="time-info">Ukończyłeś/aś grę w czasie: {displayTime()}</p>
        <div className="finish-screen-buttons">
          <button className="btn-primary" onClick={playAgain}>
            Zagraj ponownie
          </button>
          <button className="btn-secondary" onClick={handleScores}>
            Najlepsze wyniki
          </button>
          <button className="btn-tertiary" onClick={resetGame}>
            Zakończ grę
          </button>
        </div>
      </div>
    </div>
  );
}

export default FinishScreen;
