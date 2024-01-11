import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const Timer = () => {
  const [secondsRemaining, setSecondsRemaining] = useState(0);

  useEffect(() => {
    const socket = io("http://localhost:8000");

    // Nasłuchuj na temat "timer" i aktualizuj stan
    socket.on("timer", (seconds) => {
      setSecondsRemaining(seconds);
    });

    // Zakończ nasłuchiwanie po opuszczeniu komponentu
    return () => socket.disconnect();
  }, []);

  return (
    <div>
      <p>Timer: {secondsRemaining} seconds</p>
    </div>
  );
};

export default Timer;
