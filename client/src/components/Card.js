import React, { useState } from "react";

function Card({ item }) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };
  return (
    <div
      className={`card ${isFlipped ? "flipped" : ""}`}
      onClick={handleCardClick}
    >
      <div>
        <div className={`front-card ${isFlipped ? "hidden" : ""}`}>{item}</div>
        <div className={`back-card ${isFlipped ? "" : "hidden"}`}>?</div>
      </div>
    </div>
  );
}

export default Card;
