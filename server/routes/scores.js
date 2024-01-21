const express = require("express");
const scoreRoutes = express.Router();
const dbo = require("../db/conn");
const ObjectId = require("mongodb").ObjectId;

scoreRoutes.route("/scores").post(async (req, res) => {
  try {
    const { size, currentUser, gameTime } = req.body;

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

scoreRoutes.get("/scores", async (req, res) => {
  try {
    const db = dbo.getDb("memorygame");
    const scoresCollection = db.collection("scores");

    const sortOptions = {
      gameTimeInSeconds: 1,
    };

    const filterOptions = {};

    const playerName = req.query.player;
    if (playerName) {
      filterOptions.player = { $regex: new RegExp(playerName, "i") };
    }

    const difficulty = req.query.difficulty;
    if (
      difficulty &&
      ["ŁATWY", "ŚREDNI", "TRUDNY"].includes(difficulty.toUpperCase())
    ) {
      filterOptions.difficulty = difficulty.toUpperCase();
    }

    const scores = await scoresCollection
      .aggregate([
        {
          $match: filterOptions,
        },
        {
          $addFields: {
            gameTimeInSeconds: {
              $toInt: "$gameTimeInSeconds",
            },
          },
        },
        {
          $sort: sortOptions,
        },
      ])
      .toArray();

    res.status(200).json({
      success: true,
      message: "Pobrano wyniki.",
      scores: scores,
    });
  } catch (error) {
    console.error("Błąd podczas pobierania wyników:", error);
    res.status(500).json({
      success: false,
      message: "Wystąpił błąd podczas pobierania wyników.",
    });
  }
});

module.exports = scoreRoutes;
