const express = require("express");
const memoryRoutes = express.Router();
const verifyToken = require("../middleware/auth");

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

memoryRoutes.route("/board/start").post(verifyToken, (req, res) => {
  const { size } = req.body;

  const emojiArray = [
    "🦔", "🐬", "🐫", "🐄", "🦈", "🐖", "🐓", "🐞", "🐝", "🐤",
    "🐧", "🐒", "🦘", "🐌", "🦀", "🦖", "🐢", "🦑", "🐘", "🦇",
    "🦥", "🦓", "🦒", "🐅", "🐊", "🐈", "🐩", "🐏", "🐁", "🐎",
    "🦆", "🐜",
  ];

  const shuffledEmojiArray = shuffleArray([...emojiArray]);
  const selectedEmojis = shuffledEmojiArray.slice(0, (size * size) / 2);
  const cardPairs = [...selectedEmojis, ...selectedEmojis];
  const shuffledCards = shuffleArray(cardPairs).map((emoji, index) => ({
    id: index,
    emoji: emoji,
    isFlipped: false,
    isMatched: false,
  }));

  req.session.game = {
    board: shuffledCards,
    choiceOne: null,
    choiceTwo: null,
  };

  const clientBoard = shuffledCards.map((card) => ({
    id: card.id,
    isFlipped: card.isFlipped,
    isMatched: card.isMatched,
  }));

  res.json({ board: clientBoard });
});

memoryRoutes.route("/board/reveal").post(verifyToken, (req, res) => {
  const { cardId } = req.body;
  const game = req.session.game;

  if (!game) {
    return res.status(400).json({ message: "Game not started" });
  }

  const card = game.board.find((c) => c.id === cardId);
  if (!card || card.isFlipped || card.isMatched) {
    return res.status(400).json({ message: "Invalid move" });
  }

  card.isFlipped = true;

  let choiceOne = game.choiceOne;
  let choiceTwo = game.choiceTwo;

  if (!choiceOne) {
    game.choiceOne = card;
  } else {
    game.choiceTwo = card;
  }

  let response = {
    card: { id: card.id, emoji: card.emoji, isFlipped: true },
    match: null,
  };

  if (game.choiceOne && game.choiceTwo) {
    if (game.choiceOne.emoji === game.choiceTwo.emoji) {
      game.board.forEach((c) => {
        if (c.emoji === game.choiceOne.emoji) {
          c.isMatched = true;
        }
      });
      response.match = true;
      response.card1 = game.choiceOne.id;
      response.card2 = game.choiceTwo.id;
    } else {
      response.match = false;
      response.card1 = game.choiceOne.id;
      response.card2 = game.choiceTwo.id;
      game.board.find(c => c.id === game.choiceOne.id).isFlipped = false;
      game.board.find(c => c.id === game.choiceTwo.id).isFlipped = false;
    }
    game.choiceOne = null;
    game.choiceTwo = null;
  }

  req.session.game = game;
  res.json(response);
});

module.exports = memoryRoutes;
