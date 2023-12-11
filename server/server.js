const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const port = 5000;

app.use(cors());
// app.use(express.json());
// app.use(express.static('public'));
// app.use(express.static(path.join(__dirname, 'images')));

app.get('/board', (req, res) => {
  const { size } = req.query; // Pobierz rozmiar planszy z parametru zapytania
  console.log(size);
  const dane_tablica = Array(size*size).fill("Remiza");

  res.json(dane_tablica);
});

app.listen(port, () => {
    console.log(`Uruchomiono aplikację pod adresem http://localhost:${port}...`);
});