import React, { useEffect, useState } from "react";
import { GoClock } from "react-icons/go";

const Timer = () => {
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8000");

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.event === "timer") {
        setSecondsRemaining(data.value);
      }
    };
    return () => socket.close();
  }, []);

  const displayTime = () => {
    const minutes = Math.floor(secondsRemaining / 60);
    const seconds = secondsRemaining % 60;

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
