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
      return (
        <>
          <span className="time-part">{minutes}</span>
          <span className="time-unit">min </span>
          <span className="time-part">{formattedSeconds}</span>
          <span className="time-separator">.</span>
          <span className="time-part">{formattedCentiseconds}</span>
          <span className="time-unit">s</span>
        </>
      );
    } else {
      return (
        <>
          <span className="time-part">{seconds}</span>
          <span className="time-separator">.</span>
          <span className="time-part">{formattedCentiseconds}</span>
          <span className="time-unit">s</span>
        </>
      );
    }
  };

  return (
    <div className="timer">
      <span className="timer-icon">
        <GoClock />
      </span>
      <div className="time-display">{displayTime()}</div>
    </div>
  );
};

export default Timer;
