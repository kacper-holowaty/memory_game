const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const port = 3000;

app.use(cors());
app.use(express.json());
// app.use(express.static('public'));
// app.use('/src', express.static('src'));
app.use(express.static(path.join(__dirname, '../client/public')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Uruchomiono aplikację pod adresem http://localhost:${port}...`);
});