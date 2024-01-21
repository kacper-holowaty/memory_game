import React from "react";
import { Route, Routes } from "react-router-dom";
import StartScreen from "./components/StartScreen";
import Board from "./components/Board";
import LoginPanel from "./components/LoginPanel";
import FinishScreen from "./components/FinishScreen";
import Leaderboard from "./components/Leaderboard";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<StartScreen />} />
        <Route path="/login" element={<LoginPanel />} />
        <Route path="/game" element={<Board />} />
        <Route path="/game/finish" element={<FinishScreen />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </div>
  );
}
export default App;
