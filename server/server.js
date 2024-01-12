// const express = require("express");
// const app = express();
// const cors = require("cors");
// require("dotenv").config({ path: "./config.env" });
// const port = process.env.PORT || 8000;
// app.use(cors());
// app.use(express.json());
// app.use(require("./routes/memory"));
// const dbo = require("./db/conn");

// app.listen(port, () => {
//   dbo.connectToServer(function (err) {
//     if (err) console.error(err);
//   });
//   console.log(`Server is running on port: ${port}`);
// });

const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000", // Zmień na adres swojej aplikacji frontendowej
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});
const cors = require("cors");
require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT || 8000;
const dbo = require("./db/conn");

// Importuj funkcję setupMQTT z pliku mqtt.js
const setupMQTT = require("./mqtt");

// Inicjalizacja Express
app.use(cors());
app.use(express.json());
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

// WebSocket
io.on("connection", (socket) => {
  console.log("User connected with WebSocket");

  mqttClient.subscribe("timer");

  mqttClient.on("message", (topic, message) => {
    if (topic === "timer") {
      const timerValue = parseInt(message);
      io.emit("timer", timerValue);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});
