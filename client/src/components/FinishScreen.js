import React, { useState, useEffect } from "react";
import { useMemory } from "../context/MemoryContext";
import axios from "axios";

function FinishScreen() {
  const { state } = useMemory();
  const { size, currentUser, socket } = state;
  // implementacja logiki:
  // odczytywanie czasu przez mqtt
  // zerowanie licznika przez mqtt
  // odczytanie size
  // dodanie danych do bazy, do kolekcji scores
  // wywołanie axios logout (aby usunąć cookie oraz komentarze)
  // ustawienie size na null (dispatch)
  // dwa przyciski (play again) oraz (leaderboard)
  // const [socket, setSocket] = useState(null);
  const [gameTime, setGameTime] = useState(null);

  useEffect(() => {
    const finishGame = async () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        await socket.send("get_current_time");

        // await socket.send("reset_timer"); // jeszcze nie tu

        await axios.post("http://localhost:8000/scores", {
          size,
          currentUser,
          gameTime,
        });

        // await axios.delete("http://localhost:8000/logout");
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
      <span>Twój czas: {displayTime()}</span>
    </div>
  );
}

export default FinishScreen;
