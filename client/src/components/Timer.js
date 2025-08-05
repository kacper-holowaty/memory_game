import React from "react";
import { GoClock } from "react-icons/go";
import { useMemory } from "../context/MemoryContext";

const Timer = () => {
  const {
    state: { time },
  } = useMemory();

  const displayTime = () => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    const formattedSeconds = String(seconds).padStart(2, "0");

    return `${minutes}:${formattedSeconds} min`;
  };

  return (
    <div className="timer">
      <span className="timer-icon">
        <GoClock />
      </span>
      <span>{displayTime()}</span>
    </div>
  );
};

export default Timer;
