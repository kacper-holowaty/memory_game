import React from "react";
import { GoClock } from "react-icons/go";
import { useMemory } from "../context/MemoryContext";

const Timer = () => {
  const {
    state: { time },
  } = useMemory();

  const displayTime = () => {
    const minutes = Math.floor(time / 6000);
    const seconds = Math.floor((time % 6000) / 100);
    const centiseconds = time % 100;

    const formattedCentiseconds = String(centiseconds).padStart(2, "0");

    if (minutes > 0) {
      const formattedSeconds = String(seconds).padStart(2, "0");
      return `${minutes} min ${formattedSeconds}.${formattedCentiseconds} s`;
    } else {
      return `${seconds}.${formattedCentiseconds} s`;
    }
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
