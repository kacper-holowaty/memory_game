import React from "react";
import { Route, Routes } from "react-router-dom";
import StartScreen from "./components/StartScreen";
import Board from "./components/Board";
import LoginPanel from "./components/LoginPanel";
import FinishScreen from "./components/FinishScreen";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<StartScreen />} />
        <Route path="/login" element={<LoginPanel />} />
        <Route path="/game" element={<Board />} />
        <Route path="/game/finish" element={<FinishScreen />} />
      </Routes>
    </div>
  );
}
export default App;
