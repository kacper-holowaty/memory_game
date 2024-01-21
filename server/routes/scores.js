const express = require("express");
const scoreRoutes = express.Router();
const dbo = require("../db/conn");
const ObjectId = require("mongodb").ObjectId;

scoreRoutes.route("/scores").post(async (req, res) => {
  try {
    const { size, currentUser, gameTime } = req.body;

    // Mapa trudności
    const difficultyMap = {
      4: "ŁATWY",
      6: "ŚREDNI",
      8: "TRUDNY",
    };

    const difficulty = difficultyMap[size] || "???";

    const db = dbo.getDb("memorygame");
    const result = await db.collection("scores").insertOne({
      player: currentUser,
      difficulty,
      gameTimeInSeconds: gameTime,
    });

    if (result.acknowledged) {
      res.status(201).json({
        success: true,
        message: "Wynik gry został zapisany pomyślnie.",
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Nie udało się zapisać wyniku gry.",
      });
    }
  } catch (error) {
    console.error("Błąd podczas zapisywania wyniku gry:", error);
    res.status(500).json({
      success: false,
      message: "Wystąpił błąd podczas zapisywania wyniku gry.",
    });
  }
});

module.exports = scoreRoutes;
