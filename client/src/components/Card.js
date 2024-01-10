import React from "react";

function Card({ card, handleChoice, flipped, disabled }) {
  const handleClick = () => {
    if (!disabled) {
      handleChoice(card);
    }
  };
  return (
    <div className="card">
      <div className={flipped ? "flipped" : ""}>
        <div className="front-card">{card.emoji}</div>
        <div className="back-card" onClick={handleClick}>
          ?
        </div>
      </div>
    </div>
  );
}

export default Card;
