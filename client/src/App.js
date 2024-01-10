import React from "react";
import { Route, Routes } from "react-router-dom";
import StartScreen from "./components/StartScreen";
import Board from "./components/Board";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<StartScreen />} />
        <Route path="/game" element={<Board />} />
      </Routes>
    </div>
  );
}
export default App;
