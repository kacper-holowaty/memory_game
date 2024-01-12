import React, { useState, useEffect } from "react";
import { useMemory } from "../context/MemoryContext";
import { useNavigate } from "react-router-dom";

function StartScreen() {
  const { dispatch, state } = useMemory();
  const { size } = state;
  const navigate = useNavigate();
  const [numberOfPlayers, setNumberOfPlayers] = useState(null);

  function handleButton(rozmiar) {
    dispatch({ type: "SET_SIZE", payload: rozmiar });
  }

  useEffect(() => {
    if (size && numberOfPlayers) {
      if (numberOfPlayers === 1) {
        navigate("/login");
      }
    }
  }, [navigate, size, numberOfPlayers]);
  // w przyszłości można dodać obsługę kilku graczy
  return (
    <div>
      <h2>Wybierz rozmiar planszy:</h2>
      <div>
        <button onClick={() => handleButton(4)}>4x4</button>
        <button onClick={() => handleButton(6)}>6x6</button>
        <button onClick={() => handleButton(8)}>8x8</button>
      </div>
      <h2>Wybierz liczbę graczy:</h2>
      <div>
        <button onClick={() => setNumberOfPlayers(1)}>1 gracz</button>
        <button onClick={() => setNumberOfPlayers(2)}>2 graczy</button>
      </div>
    </div>
  );
}

export default StartScreen;
