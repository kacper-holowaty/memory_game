const express = require("express");
const scoreRoutes = express.Router();
const dbo = require("../db/conn");
const verifyToken = require("../middleware/auth");

scoreRoutes.route("/scores").post(verifyToken, async (req, res) => {
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
      gameTime: gameTime,
      createdAt: new Date().toISOString(),
    });

    if (result.acknowledged) {
      res.status(201).json({
        success: true,
        message: "Wynik gry został zapisany pomyślnie.",
        scoreId: result.insertedId,
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

scoreRoutes.get("/scores", verifyToken, async (req, res) => {
  try {
    const db = dbo.getDb("memorygame");
    const scoresCollection = db.collection("scores");

    const { player, difficulty, page = 1, limit = 10 } = req.query;

    const filterOptions = {};
    if (player) {
      filterOptions.player = { $regex: new RegExp(player, "i") };
    }
    if (
      difficulty &&
      ["ŁATWY", "ŚREDNI", "TRUDNY"].includes(difficulty.toUpperCase())
    ) {
      filterOptions.difficulty = difficulty.toUpperCase();
    }

    const pageInt = parseInt(page, 10);
    const limitInt = parseInt(limit, 10);
    const skip = (pageInt - 1) * limitInt;

    const scoresPipeline = [
      { $match: filterOptions },
      { $addFields: { gameTime: { $toInt: "$gameTime" } } },
      { $sort: { gameTime: 1 } },
      {
        $group: {
          _id: "$gameTime",
          docs: { $push: "$$ROOT" },
        },
      },
      { $sort: { _id: 1 } },
      {
        $group: {
          _id: null,
          allScores: { $push: "$docs" },
        },
      },
      {
        $unwind: {
          path: "$allScores",
          includeArrayIndex: "rank",
        },
      },
      { $unwind: "$allScores" },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: ["$allScores", { rank: { $add: ["$rank", 1] } }],
          },
        },
      },
      { $skip: skip },
      { $limit: limitInt },
    ];

    const totalScoresPipeline = [{ $match: filterOptions }, { $count: "total" }];

    const [scores, totalResult] = await Promise.all([
      scoresCollection.aggregate(scoresPipeline).toArray(),
      scoresCollection.aggregate(totalScoresPipeline).toArray(),
    ]);

    const totalScores = totalResult.length > 0 ? totalResult[0].total : 0;
    const totalPages = Math.ceil(totalScores / limitInt);

    res.status(200).json({
      success: true,
      message: "Pobrano wyniki.",
      scores,
      pagination: {
        currentPage: pageInt,
        totalPages,
        totalScores,
        limit: limitInt,
      },
    });
  } catch (error) {
    console.error("Błąd podczas pobierania wyników:", error);
    res.status(500).json({
      success: false,
      message: "Wystąpił błąd podczas pobierania wyników.",
    });
  }
});

scoreRoutes.get("/scores/:id/rank", verifyToken, async (req, res) => {
  try {
    const db = dbo.getDb("memorygame");
    const scoresCollection = db.collection("scores");
    const { ObjectId } = require("mongodb");

    const scoreId = new ObjectId(req.params.id);

    const score = await scoresCollection.findOne({ _id: scoreId });
    if (!score) {
      return res.status(404).json({
        success: false,
        message: "Nie znaleziono wyniku.",
      });
    }

    const rank = await scoresCollection.countDocuments({
      gameTime: { $lt: score.gameTime },
    });

    res.status(200).json({
      success: true,
      rank: rank + 1,
    });
  } catch (error) {
    console.error("Błąd podczas pobierania pozycji wyniku:", error);
    res.status(500).json({
      success: false,
      message: "Wystąpił błąd podczas pobierania pozycji wyniku.",
    });
  }
});

module.exports = scoreRoutes;
