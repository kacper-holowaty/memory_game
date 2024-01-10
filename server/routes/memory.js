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

memoryRoutes.route("/board/match").put((req, res) => {
  const { choiceOne, choiceTwo, board } = req.body;

  const areEqual = choiceOne.emoji === choiceTwo.emoji;

  if (areEqual) {
    const updatedBoard = board.map((card) =>
      card.emoji === choiceOne.emoji ? { ...card, matched: true } : card
    );

    res.json({ areEqual, updatedBoard });
  } else {
    res.json({ areEqual });
  }
});

module.exports = memoryRoutes;
