import React from "react";
import { useMemory } from "../context/MemoryContext";

function Card({ card, handleChoice, flipped, disabled }) {
  const { state } = useMemory();
  const { size } = state;
  const handleClick = () => {
    if (!disabled) {
      handleChoice(card);
    }
  };
  return (
    <div className="card">
      <div className={flipped ? "flipped" : ""}>
        <div className={`front-card size-${size}`}>{card.emoji}</div>
        <div className={`back-card size-${size}`} onClick={handleClick}>
          ?
        </div>
      </div>
    </div>
  );
}

export default Card;
