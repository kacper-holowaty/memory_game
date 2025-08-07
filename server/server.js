const express = require("express");
const app = express();
const http = require("http").createServer(app);
const cookieParser = require("cookie-parser");
const cors = require("cors");
const session = require("express-session");
require('dotenv').config();
const port = process.env.PORT || 8000;
const dbo = require("./db/conn");

app.use(
  cors({
    origin: [
      "http://localhost:3000",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
  })
);
app.get("/", (req, res) => {
  res.json({ message: "Memory Game API is running!" });
});
app.use(require("./routes/memory"));
app.use(require("./routes/user"));
app.use(require("./routes/scores"));

http.listen(port, () => {
  dbo.connectToServer(function (err) {
    if (err) console.error(err);
  });
  console.log(`Server is running on port: ${port}`);
});
