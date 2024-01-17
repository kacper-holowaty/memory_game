const mqtt = require("mqtt");
const WebSocket = require("ws");

function setupMQTT() {
  const brokerUrl = "mqtt://localhost:1883";
  const mqttClient = mqtt.connect(brokerUrl);

  let seconds = 0;

  mqttClient.on("connect", () => {
    console.log("Connected to MQTT broker");

    setInterval(() => {
      seconds++;
      mqttClient.publish("timer", seconds.toString());
    }, 1000);
  });

  return mqttClient;
}

function setupWebSocket(server, mqttClient) {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    console.log("User connected with WebSocket");

    mqttClient.subscribe("timer");

    mqttClient.on("message", (topic, message) => {
      if (topic === "timer") {
        const timerValue = parseInt(message);
        ws.send(JSON.stringify({ event: "timer", value: timerValue }));
      }
    });

    ws.on("close", () => {
      console.log("User disconnected");
    });
  });
}

module.exports = { setupMQTT, setupWebSocket };

// const mqtt = require("mqtt");
// const WebSocket = require("ws");

// function setupMQTT() {
//   const brokerUrl = "mqtt://localhost:1883";
//   const mqttClient = mqtt.connect(brokerUrl);

//   let seconds = 0;
//   let isTimerStarted = false;

//   mqttClient.on("connect", () => {
//     console.log("Connected to MQTT broker");

//     setInterval(() => {
//       if (isTimerStarted) {
//         seconds++;
//         mqttClient.publish("timer", seconds.toString());
//       }
//     }, 1000);
//   });

//   mqttClient.on("message", (topic, message) => {
//     if (topic === "startTimer" && !isTimerStarted) {
//       isTimerStarted = true;
//     }
//   });

//   return { mqttClient, startTimer: () => (isTimerStarted = true) };
// }

// function setupWebSocket(server, { mqttClient, startTimer }) {
//   const wss = new WebSocket.Server({ server });

//   wss.on("connection", (ws) => {
//     console.log("User connected with WebSocket");

//     mqttClient.subscribe("timer");

//     mqttClient.on("message", (topic, message) => {
//       if (topic === "timer") {
//         const timerValue = parseInt(message);
//         ws.send(JSON.stringify({ event: "timer", value: timerValue }));
//       }
//     });

//     ws.on("message", (message) => {
//       if (message === "startTimer") {
//         startTimer();
//       }
//     });

//     ws.on("close", () => {
//       console.log("User disconnected");
//     });
//   });
// }

// module.exports = { setupMQTT, setupWebSocket };
