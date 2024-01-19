const express = require("express");
const app = express();
const http = require("http").createServer(app);
// const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT || 8000;
const dbo = require("./db/conn");
// const WebSocket = require("ws");
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
