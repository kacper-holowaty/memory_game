import React, { useState, useEffect } from "react";
import { useMemory } from "../context/MemoryContext";
import { useNavigate } from "react-router-dom";
function StartScreen() {
  const { dispatch, state } = useMemory();
  const { size, currentUser } = state;
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSizeSelected, setIsSizeSelected] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);

  function handleButton(rozmiar) {
    dispatch({ type: "SET_SIZE", payload: rozmiar });
    setIsSizeSelected(true);
    setSelectedSize(rozmiar);
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
  
  useEffect(() => {
    const emojis = ["😊", "😂", "😍", "🤔", "😎", "🤩", "🥳", "🤯", "🦔"];
    const container = document.querySelector(".start-screen");

    const createEmoji = () => {
      if (!container) return;
      const emoji = document.createElement("div");
      emoji.classList.add("emoji");
      emoji.innerText = emojis[Math.floor(Math.random() * emojis.length)];
      emoji.style.left = `${Math.random() * 100}vw`;
      emoji.style.animationDuration = `${Math.random() * 5 + 5}s`;
      container.appendChild(emoji);

      setTimeout(() => {
        emoji.remove();
      }, 10000);
    };

    const interval = setInterval(createEmoji, 300);

    return () => clearInterval(interval);
  }, []);
  return (
    <div className="start-screen">
      <div className="emoji-rain"></div>
      <h1 className="title">EMOJI MEMORY</h1>
      <h2 className="choose-board-size">Wybierz rozmiar planszy:</h2>
      <div className="button-group">
        <button
          className={`size-button ${selectedSize === 4 ? "selected" : ""}`}
          onClick={() => handleButton(4)}
        >
          4x4
        </button>
        <button
          className={`size-button ${selectedSize === 6 ? "selected" : ""}`}
          onClick={() => handleButton(6)}
        >
          6x6
        </button>
        <button
          className={`size-button ${selectedSize === 8 ? "selected" : ""}`}
          onClick={() => handleButton(8)}
        >
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
