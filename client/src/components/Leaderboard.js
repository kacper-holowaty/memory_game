import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useMemory } from "../context/MemoryContext";

function Leaderboard() {
  const { dispatch } = useMemory();
  const navigate = useNavigate();
  const location = useLocation();
  const [scores, setScores] = useState([]);
  const [playerName, setPlayerName] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [newScoreId, setNewScoreId] = useState(location.state?.newScoreId || null);

  useEffect(() => {
    const fetchAndHighlight = async () => {
      if (newScoreId) {
        try {
          const rankResponse = await axios.get(
            `http://localhost:8000/scores/${newScoreId}/rank`,
            { withCredentials: true }
          );
          const { rank } = rankResponse.data;
          const newPage = Math.ceil(rank / limit);
          setCurrentPage(newPage);
          navigate(location.pathname, { replace: true, state: {} });
        } catch (error) {
          console.error("Błąd podczas pobierania pozycji wyniku:", error);
          setNewScoreId(null);
        }
      }
    };

    fetchAndHighlight();
  }, [newScoreId, limit, navigate, location.pathname]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/scores", {
          params: {
            player: playerName,
            difficulty: difficulty,
            page: currentPage,
            limit: limit,
          },
          withCredentials: true,
        });

        setScores(response.data.scores);
        setPagination(response.data.pagination);
      } catch (error) {
        console.error("Błąd podczas pobierania wyników:", error);
      }
    };
    fetchData();
  }, [playerName, difficulty, currentPage, limit]);

  const handleInputChange = (e) => {
    setPlayerName(e.target.value);
  };

  const handleSelectChange = (e) => {
    setDifficulty(e.target.value);
    setCurrentPage(1);
  };

  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value));
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setCurrentPage(newPage);
    }
  };

  const displayTime = (time) => {
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

  const resetGame = async () => {
    dispatch({ type: "SET_SIZE", payload: null });
    dispatch({ type: "SET_CURRENT_USER", payload: null });
    dispatch({ type: "RESET_TIMER" });
    await axios.delete("http://localhost:8000/logout", {
      withCredentials: true,
    });
    navigate("/");
  };
  
  const playAgain = () => {
    dispatch({ type: "SET_SIZE", payload: null });
    dispatch({ type: "RESET_TIMER" });
    navigate("/");
  };

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-content">
        <h1 className="leaderboard-header">Tablica wyników</h1>
        <div className="leaderboard-buttons">
          <button className="btn-primary" onClick={playAgain}>
            Zagraj ponownie
          </button>
          <button className="btn-secondary" onClick={resetGame}>
            Zakończ i wyloguj
          </button>
        </div>
        <div className="leaderboard-form">
          <div className="form-group">
            <label htmlFor="playerName">Filtruj po nazwie gracza:</label>
            <input
              id="playerName"
              type="text"
              value={playerName}
              onChange={handleInputChange}
              placeholder="Wpisz nazwę gracza..."
            />
          </div>
          <div className="form-group">
            <label htmlFor="difficulty">Filtruj po poziomie trudności:</label>
            <select
              id="difficulty"
              value={difficulty}
              onChange={handleSelectChange}
            >
              <option value="">Wszystkie</option>
              <option value="ŁATWY">Łatwy</option>
              <option value="ŚREDNI">Średni</option>
              <option value="TRUDNY">Trudny</option>
            </select>
          </div>
        </div>
        <ul className="leaderboard-scores">
          {scores.map((score, index) => (
            <li
              key={score._id}
              className={score._id === newScoreId ? "highlighted" : ""}
            >
              <span className="rank">{score.rank}.</span>
              <div className="score-info">
                <span className="player-name">{score.player}</span>
                <span className="difficulty">
                  Poziom: {score.difficulty}
                </span>
              </div>
              <span className="game-time">{displayTime(score.gameTime)}</span>
            </li>
          ))}
        </ul>
        {pagination && pagination.totalPages > 0 && (
          <div className="pagination-controls">
            <div className="limit-selector">
              <label htmlFor="limit">Wyników na stronę:</label>
              <select id="limit" value={limit} onChange={handleLimitChange}>
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
              </select>
            </div>
            <div className="page-nav">
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
              >
                «
              </button>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                ‹
              </button>
              <span>
                Strona {pagination.currentPage} z {pagination.totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pagination.totalPages}
              >
                ›
              </button>
              <button
                onClick={() => handlePageChange(pagination.totalPages)}
                disabled={currentPage === pagination.totalPages}
              >
                »
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Leaderboard;
