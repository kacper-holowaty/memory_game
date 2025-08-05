import React, { useState, useEffect } from "react";
import { useMemory } from "../context/MemoryContext";
import { useNavigate } from "react-router-dom";
function StartScreen() {
  const { dispatch, state } = useMemory();
  const { size, currentUser } = state;
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSizeSelected, setIsSizeSelected] = useState(false);

  function handleButton(rozmiar) {
    dispatch({ type: "SET_SIZE", payload: rozmiar });
    setIsSizeSelected(true);
  }

  useEffect(() => {
    if (size && isPlaying) {
      if (currentUser) {
        navigate("/game");
      } else {
        navigate("/login");
      }
    }
  }, [navigate, size, isPlaying, currentUser]);
  return (
    <div className="start-screen">
      <h1 className="title">EMOJI MEMORY</h1>
      <h2 className="choose-board-size">Wybierz rozmiar planszy:</h2>
      <div className="button-group">
        <button className="size-button" onClick={() => handleButton(4)}>
          4x4
        </button>
        <button className="size-button" onClick={() => handleButton(6)}>
          6x6
        </button>
        <button className="size-button" onClick={() => handleButton(8)}>
          8x8
        </button>
      </div>
      <div>
        <button
          className={`start-button ${isSizeSelected ? "active" : "inactive"}`}
          onClick={() => isSizeSelected && setIsPlaying(true)}
          disabled={!isSizeSelected}
        >
          🎮 Start
        </button>
      </div>
    </div>
  );
}

export default StartScreen;
