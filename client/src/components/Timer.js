// import React, { useEffect, useState } from "react";

// const Timer = () => {
//   const [secondsRemaining, setSecondsRemaining] = useState(0);

//   useEffect(() => {
//     const socket = new WebSocket("ws://localhost:8000");

//     // Nasłuchuj na zdarzenia WebSocket
//     socket.onmessage = (event) => {
//       const data = JSON.parse(event.data);
//       if (data.event === "timer") {
//         setSecondsRemaining(data.value);
//       }
//     };

//     // Zakończ nasłuchiwanie po opuszczeniu komponentu
//     return () => socket.close();
//   }, []);

//   return (
//     <div>
//       <p>Timer: {secondsRemaining} seconds</p>
//     </div>
//   );
// };

// export default Timer;

/////////////////////////////////////////////////////////////////////////////
import React, { useEffect, useState } from "react";

const Timer = ({ startTimer }) => {
  const [secondsRemaining, setSecondsRemaining] = useState(0);

  useEffect(() => {
    if (startTimer) {
      const socket = new WebSocket("ws://localhost:8000");

      // Nasłuchuj na zdarzenia WebSocket
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.event === "timer") {
          setSecondsRemaining(data.value);
        }
      };

      // Zakończ nasłuchiwanie po opuszczeniu komponentu
      return () => socket.close();
    }
  }, [startTimer]);

  return (
    <div>
      <p>Timer: {secondsRemaining} seconds</p>
    </div>
  );
};

export default Timer;

// import React, { useState, useEffect } from "react";
// import mqtt from "mqtt";

// const Timer = () => {
//   const [mqttClient, setMqttClient] = useState(null);
//   const [seconds, setSeconds] = useState(0);

//   useEffect(() => {
//     const client = mqtt.connect("ws://localhost:8000");
//     console.log(client);
//     client.on("connect", () => {
//       console.log("Connected to MQTT broker");
//       setMqttClient(client);
//     });

//     client.on("message", (topic, message) => {
//       if (topic === "timer") {
//         const data = JSON.parse(message.toString());
//         setSeconds(data.seconds);
//       }
//     });

//     return () => {
//       if (mqttClient) {
//         mqttClient.end();
//       }
//     };
//   }, [mqttClient]);

//   const handleStartTimer = () => {
//     console.log("Start Timer button clicked");
//     if (mqttClient) {
//       mqttClient.publish("timer_control", "start");
//     }
//   };

//   const handleStopTimer = () => {
//     console.log("Stop Timer button clicked");
//     if (mqttClient) {
//       mqttClient.publish("timer_control", "stop");
//     }
//   };

//   return (
//     <div>
//       <div>Seconds Elapsed: {seconds}</div>
//       <button onClick={handleStartTimer}>Start Timer</button>
//       <button onClick={handleStopTimer}>Stop Timer</button>
//     </div>
//   );
// };

// export default Timer;
