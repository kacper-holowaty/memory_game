const express = require("express");
const app = express();
const http = require("http").createServer(app);
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT || 8000;
const dbo = require("./db/conn");
const setupMQTT = require("./mqtt").setupMQTT;
const setupWebSocket = require("./mqtt").setupWebSocket;

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(require("./routes/memory"));
app.use(require("./routes/user"));
app.use(require("./routes/comments"));
app.use(require("./routes/scores"));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

http.listen(port, () => {
  dbo.connectToServer(function (err) {
    if (err) console.error(err);
  });
  console.log(`Server is running on port: ${port}`);
});

const mqttClient = setupMQTT();
setupWebSocket(http, mqttClient);
