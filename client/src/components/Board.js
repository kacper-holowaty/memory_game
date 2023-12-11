import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Board = ({ size }) => {
  const [tablica, setTablica] = useState([]);

  useEffect(() => {
    const pobierzDane = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/board?size=${size}`);
        setTablica(response.data);
      } catch (error) {
        console.error('Nie udało się pobrać danych:', error);
      }
    };

    pobierzDane();
  }, [size]);

  return (
    <div>
      <h2>Game Board</h2>
      <div className="board">
        {tablica.map((item, index) => (
          <div key={index} className="card">Element{index+1}</div>
        ))}
      </div>
    </div>
  );
};

export default Board;