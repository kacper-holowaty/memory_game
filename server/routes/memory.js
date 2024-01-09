const express = require("express");
const memoryRoutes = express.Router();
const dbo = require("../db/conn");
const ObjectId = require("mongodb").ObjectId;

memoryRoutes.route("/board").post((req, res) => {
  const { size } = req.body;

  const emoji = [
    "🦔",
    "🐬",
    "🐫",
    "🐄",
    "🦈",
    "🐖",
    "🐓",
    "🐞",
    "🐝",
    "🐤",
    "🐧",
    "🐒",
    "🦄",
    "🐌",
    "🦀",
    "🦖",
    "🐢",
    "🦑",
    "🐘",
    "🐿",
    "🐉",
    "🦓",
    "🦒",
    "🐅",
    "🐊",
    "🐈",
    "🐩",
    "🐏",
    "🐁",
    "🐎",
    "🦆",
    "🐜",
  ];

  let board = Array(size * size).fill("str");

  emoji.sort(() => Math.random() - 0.5);

  for (let i = 0; i < board.length; i += 2) {
    board[i] = emoji[i / 2];
    board[i + 1] = emoji[i / 2];
  }

  res.json({ board });
});

memoryRoutes.put("/board", (req, res) => {
  const { list } = req.body;

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  const shuffledList = shuffleArray(list);

  res.json({ shuffledList });
});

module.exports = memoryRoutes;
