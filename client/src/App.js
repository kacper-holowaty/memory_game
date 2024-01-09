import React from "react";
import { Route, Routes } from "react-router-dom";
import StartScreen from "./components/StartScreen";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<StartScreen />} />
      </Routes>
    </div>
  );
}
export default App;
