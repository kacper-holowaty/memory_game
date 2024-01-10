import React from "react";
import { useMemory } from "../context/MemoryContext";
import { useNavigate } from "react-router-dom";

function StartScreen() {
  const { dispatch } = useMemory();
  const navigate = useNavigate();

  function handleButton(rozmiar) {
    dispatch({ type: "SET_SIZE", payload: rozmiar });
    navigate("/game");
  }
  // w przyszłości można dodać obsługę kilku graczy
  return (
    <div>
      Wybierz rozmiar planszy:
      <button onClick={() => handleButton(4)}>4x4</button>
      <button onClick={() => handleButton(6)}>6x6</button>
      <button onClick={() => handleButton(8)}>8x8</button>
    </div>
  );
}

export default StartScreen;
