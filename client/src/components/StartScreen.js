import React, { useState } from "react";
import Board from "./Board";
// import axios from "axios";

function StartScreen() {
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);

  function handleButton(rozmiar) {
    setGameStarted(true);
    setSelectedSize(rozmiar);
  }
  // w przyszłości można dodać obsługę kilku graczy
  return (
    <div>
      Wybierz rozmiar planszy:
      <button onClick={() => handleButton(4)}>4x4</button>
      <button onClick={() => handleButton(6)}>6x6</button>
      <button onClick={() => handleButton(8)}>8x8</button>
      {gameStarted && selectedSize && <Board size={selectedSize} />}
    </div>
  );
}

export default StartScreen;
