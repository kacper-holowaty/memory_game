import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import axios from "axios";
import { useMemory } from "./context/MemoryContext";
import StartScreen from "./components/StartScreen";
import Board from "./components/Board";
import LoginPanel from "./components/LoginPanel";
import FinishScreen from "./components/FinishScreen";
import Leaderboard from "./components/Leaderboard";

function App() {
  const { dispatch } = useMemory();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:8000/me", {
          withCredentials: true,
        });
        if (response.data.success) {
          dispatch({ type: "SET_CURRENT_USER", payload: response.data.user });
        }
      } catch (error) {
        console.log("Użytkownik nie jest zalogowany.");
      }
    };

    fetchUser();
  }, [dispatch]);

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
