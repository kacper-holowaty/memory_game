import React from "react";

function Card({ card, handleChoice, flipped, disabled }) {
  const handleClick = () => {
    if (!disabled) {
      handleChoice(card);
    }
  };
  return (
    <div className={`card ${flipped ? "flipped" : ""}`} onClick={handleClick}>
      <div className="card-inner">
        <div className="front-card">{card.emoji}</div>
        <div className="back-card">?</div>
      </div>
    </div>
  );
}

export default Card;
