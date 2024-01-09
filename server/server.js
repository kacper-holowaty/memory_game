// const express = require('express');
// const path = require('path');
// const app = express();
// const cors = require('cors');
// const port = 5000;
// const bodyParser = require('body-parser')

// app.use(cors());
// app.use(express.json());
// app.use(bodyParser.json());

// // app.use(express.json());
// // app.use(express.static('public'));
// // app.use(express.static(path.join(__dirname, 'images')));

// app.listen(port, () => {
//     console.log(`Uruchomiono aplikację pod adresem http://localhost:${port}...`);
// });

const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use(require("./routes/memory"));
const dbo = require("./db/conn");

app.listen(port, () => {
  dbo.connectToServer(function (err) {
    if (err) console.error(err);
  });
  console.log(`Server is running on port: ${port}`);
});
