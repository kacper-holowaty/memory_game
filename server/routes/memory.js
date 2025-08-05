const express = require("express");
const memoryRoutes = express.Router();
const dbo = require("../db/conn");
const ObjectId = require("mongodb").ObjectId;

memoryRoutes.route("/board").post((req, res) => {
  const { size } = req.body;

  const emojiArray = [
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

  const emoji = emojiArray.map((value) => ({ emoji: value, matched: false }));

  let board = Array(size * size).fill(null);

  emoji.sort(() => Math.random() - 0.5);

  for (let i = 0; i < board.length; i += 2) {
    board[i] = emoji[i / 2];
    board[i + 1] = emoji[i / 2];
  }

  res.json({ board });
});

memoryRoutes.route("/board/match").put((req, res) => {
  const { choiceOne, choiceTwo } = req.body;

  const areEqual = choiceOne.emoji === choiceTwo.emoji;

  res.json({ areEqual });
});

module.exports = memoryRoutes;
