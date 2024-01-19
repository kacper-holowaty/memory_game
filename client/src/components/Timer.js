import React, { useEffect, useState } from "react";

const Timer = () => {
  const [secondsRemaining, setSecondsRemaining] = useState(0);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8000");

    // Nasłuchuj na zdarzenia WebSocket
    socket.onmessage = (event) => {
      console.log("Czy mam wiadomość?");
      const data = JSON.parse(event.data);
      if (data.event === "timer") {
        setSecondsRemaining(data.value);
      }
    };
    return () => socket.close();
  }, []);

  return (
    <div>
      <p>Timer: {secondsRemaining} seconds</p>
    </div>
  );
};

export default Timer;
