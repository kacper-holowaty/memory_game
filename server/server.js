const express = require("express");
const app = express();
const http = require("http").createServer(app);
// const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT || 8000;
const dbo = require("./db/conn");

const setupMQTT = require("./mqtt").setupMQTT;
const setupWebSocket = require("./mqtt").setupWebSocket;

app.use(cors());

app.use(express.json());
// app.use(cookieParser());
app.use(require("./routes/memory"));
app.use(require("./routes/user"));

// Połączenie z bazą danych
http.listen(port, () => {
  dbo.connectToServer(function (err) {
    if (err) console.error(err);
  });
  console.log(`Server is running on port: ${port}`);
});

// Inicjalizacja MQTT
const mqttClient = setupMQTT();
setupWebSocket(http, mqttClient);

////////////////////////////////////////////////////////////////////////////////////////
// const express = require("express");
// const app = express();
// const http = require("http").createServer(app);
// const cors = require("cors");
// const WebSocket = require("ws");
// const mqtt = require("mqtt");

// require("dotenv").config({ path: "./config.env" });
// const port = process.env.PORT || 8000;

// const dbo = require("./db/conn");

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Obsługa HTTP
// app.use(require("./routes/memory"));
// app.use(require("./routes/user"));

// const wss = new WebSocket.Server({ server: http });
// let timerInterval;
// let secondsElapsed = 0;
// let isTimerRunning = false;

// // Obsługa MQTT
// const mqttClient = mqtt.connect("ws://localhost:8000"); // Dostosuj port WebSocket

// wss.on("connection", (ws) => {
//   console.log("A client connected to WebSocket");

//   ws.on("message", (message) => {
//     // console.log("Received message from client:", message);

//     if (message === "start") {
//       startTimer();
//     } else if (message === "stop") {
//       stopTimer();
//     }
//   });
// });

// // Obsługa MQTT - subskrypcja tematu timer_control
// mqttClient.on("connect", () => {
//   console.log("Connected to MQTT broker");

//   mqttClient.subscribe("timer_control");
// });

// mqttClient.on("message", (topic, message) => {
//   console.log(`Received MQTT message on topic ${topic}:`, message.toString());

//   if (topic === "timer_control") {
//     handleTimerControlMessage(message.toString());
//   }
// });

// function handleTimerControlMessage(command) {
//   if (command === "start") {
//     startTimer();
//   } else if (command === "stop") {
//     stopTimer();
//   }
// }

// function startTimer() {
//   if (!isTimerRunning) {
//     isTimerRunning = true;
//     timerInterval = setInterval(() => {
//       secondsElapsed++;
//       broadcastTime();
//     }, 1000);
//   }
// }

// function stopTimer() {
//   if (isTimerRunning) {
//     isTimerRunning = false;
//     clearInterval(timerInterval);
//   }
// }

// function broadcastTime() {
//   const timeMessage = {
//     type: "time",
//     seconds: secondsElapsed,
//   };
//   wss.clients.forEach((client) => {
//     if (client.readyState === WebSocket.OPEN) {
//       client.send(JSON.stringify(timeMessage));
//     }
//   });

//   // Publikowanie czasu również przez MQTT
//   mqttClient.publish("timer", JSON.stringify(timeMessage));
// }

// // Połączenie z bazą danych
// http.listen(port, () => {
//   dbo.connectToServer((err) => {
//     if (err) console.error(err);
//   });
//   console.log(`Server is running on port: ${port}`);
// });
