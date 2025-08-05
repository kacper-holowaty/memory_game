import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useMemory } from "../context/MemoryContext";

function Leaderboard() {
  const { dispatch } = useMemory();
  const navigate = useNavigate();
  const [scores, setScores] = useState([]);
  const [playerName, setPlayerName] = useState("");
  const [difficulty, setDifficulty] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/scores", {
          params: {
            player: playerName,
            difficulty: difficulty,
          },
        });

        setScores(response.data.scores);
      } catch (error) {
        console.error("Błąd podczas pobierania wyników:", error);
      }
    };

    fetchData();
  }, [playerName, difficulty]);

  const handleInputChange = (e) => {
    setPlayerName(e.target.value);
  };

  const handleSelectChange = (e) => {
    setDifficulty(e.target.value);
  };

  const displayTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    const formattedSeconds = String(seconds).padStart(2, "0");

    return `${minutes}:${formattedSeconds}`;
  };

  const resetGame = async () => {
    dispatch({ type: "SET_SIZE", payload: null });
    dispatch({ type: "SET_CURRENT_USER", payload: null });
    dispatch({ type: "RESET_TIMER" });
    await axios.delete("http://localhost:8000/logout", {
      withCredentials: true,
    });
    navigate("/");
  };
  const playAgain = async () => {
    dispatch({ type: "SET_SIZE", payload: null });
    dispatch({ type: "RESET_TIMER" });
    await axios.delete("http://localhost:8000/playagain", {
      withCredentials: true,
    });
    navigate("/");
  };

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-header">Tablica wyników</div>
      <div className="leaderboard-buttons">
        <button className="left-button-finish" onClick={resetGame}>
          Zakończ grę
        </button>
        <button className="right-button-play-again" onClick={playAgain}>
          Zagraj ponownie
        </button>
      </div>
      <div className="leaderboard-form">
        <label>
          Nazwa gracza:
          <input type="text" value={playerName} onChange={handleInputChange} />
        </label>
        <label>
          Poziom trudności:
          <select value={difficulty} onChange={handleSelectChange}>
            <option value="">-- Wybierz --</option>
            <option value="ŁATWY">ŁATWY</option>
            <option value="ŚREDNI">ŚREDNI</option>
            <option value="TRUDNY">TRUDNY</option>
          </select>
        </label>
      </div>
      <div className="leaderboard-scores">
        <ol>
          {scores.map((score, index) => (
            <li key={index}>
              {`Nazwa gracza: ${score.player}, Czas: ${displayTime(
                score.gameTimeInSeconds
              )} min, Poziom trudności: ${score.difficulty}`}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export default Leaderboard;
