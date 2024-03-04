import React, { useState, useEffect } from "react";
import { useMemory } from "../context/MemoryContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function FinishScreen() {
  const { state, dispatch } = useMemory();
  const { size, currentUser, socket } = state;
  const [gameTime, setGameTime] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const finishGame = async () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        await socket.send("get_current_time");

        if (gameTime && currentUser && size) {
          await axios.post("http://localhost:8000/scores", {
            size,
            currentUser,
            gameTime,
          });
        }
      }
    };
    finishGame();
  }, [currentUser, size, socket, gameTime]);

  useEffect(() => {
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.event === "current_time") {
        setGameTime(data.value);
      }
    };
  }, [socket]);

  const resetGame = async () => {
    dispatch({ type: "SET_SIZE", payload: null });
    dispatch({ type: "SET_CURRENT_USER", payload: null });
    if (socket) {
      await socket.send("reset_timer");
    }
    await axios.delete("http://localhost:8000/logout", {
      withCredentials: true,
    });
    navigate("/");
  };
  const handleScores = () => {
    navigate("/leaderboard");
  };

  const playAgain = async () => {
    dispatch({ type: "SET_SIZE", payload: null });
    if (socket) {
      await socket.send("reset_timer");
    }
    await axios.delete("http://localhost:8000/playagain", {
      withCredentials: true,
    });
    navigate("/");
  };

  const displayTime = () => {
    const minutes = Math.floor(gameTime / 60);
    const seconds = gameTime % 60;

    const formattedSeconds = String(seconds).padStart(2, "0");

    if (gameTime < 60) {
      return `${gameTime} s`;
    } else {
      return `${minutes}:${formattedSeconds} min`;
    }
  };

  return (
    <div>
      <h2>Gratulacje {currentUser} udało ci się ukończyć grę!</h2>
      <h2>Twój czas: {displayTime()}</h2>
      <div>
        <button onClick={resetGame}>Zakończ grę</button>
        <button onClick={playAgain}>Zagraj ponownie</button>
        <button onClick={handleScores}>Najlepsze wyniki</button>
      </div>
    </div>
  );
}

export default FinishScreen;
