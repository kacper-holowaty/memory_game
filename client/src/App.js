import React from "react";
import { Route, Routes } from "react-router-dom";
import StartScreen from "./components/StartScreen";
import Board from "./components/Board";
import LoginPanel from "./components/LoginPanel";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<StartScreen />} />
        <Route path="/login" element={<LoginPanel />} />
        <Route path="/game" element={<Board />} />
      </Routes>
    </div>
  );
}
export default App;
