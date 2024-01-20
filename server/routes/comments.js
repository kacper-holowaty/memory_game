const express = require("express");
const commentRoutes = express.Router();
const dbo = require("../db/conn");
const ObjectId = require("mongodb").ObjectId;

commentRoutes.route("/comments").post(async (req, res) => {
  try {
    const db = dbo.getDb("memorygame");

    const { text } = req.body;

    const result = await db.collection("comments").insertOne({ comment: text });
    if (result.acknowledged) {
      res.status(201).json({
        success: true,
        message: "Dodano komentarz.",
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Wystąpił błąd podczas dodawania komentarza.",
      });
    }
  } catch (error) {
    console.error("Błąd podczas dodawania komentarza:", error);
    res.status(500).json({
      success: false,
      message: "Wystąpił błąd podczas dodawania komentarza.",
    });
  }
});

commentRoutes.route("/comments").get(async (req, res) => {
  try {
    const db = dbo.getDb("memorygame");
    const comments = await db.collection("comments").find({}).toArray();

    res.status(200).json({ success: true, comments: comments });
  } catch (error) {
    console.error("Błąd podczas pobierania komentarzy:", error);
    res.status(500).json({
      success: false,
      message: "Wystąpił błąd podczas pobierania komentarzy.",
    });
  }
});

commentRoutes.route("/comments/:id").delete(async (req, res) => {
  try {
    const db = dbo.getDb("memorygame");
    const commentId = req.params.id;

    const result = await db
      .collection("comments")
      .deleteOne({ _id: ObjectId(commentId) });

    if (result.deletedCount === 1) {
      res
        .status(200)
        .json({ success: true, message: "Komentarz usunięty pomyślnie." });
    } else {
      res.status(404).json({
        success: false,
        message: "Nie znaleziono komentarza do usunięcia.",
      });
    }
  } catch (error) {
    console.error("Błąd podczas usuwania komentarza:", error);
    res.status(500).json({
      success: false,
      message: "Wystąpił błąd podczas usuwania komentarza.",
    });
  }
});

commentRoutes.route("/comments/:id").put(async (req, res) => {
  try {
    const db = dbo.getDb("memorygame");
    const commentId = req.params.id;
    const newComment = req.body.text;

    const result = await db
      .collection("comments")
      .updateOne(
        { _id: ObjectId(commentId) },
        { $set: { comment: newComment } }
      );

    if (result.modifiedCount === 1) {
      res.status(200).json({
        success: true,
        message: "Komentarz został zaktualizowany.",
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Nie znaleziono komentarza.",
      });
    }
  } catch (error) {
    console.error("Błąd podczas edycji komentarza:", error);
    res.status(500).json({
      success: false,
      message: "Wystąpił błąd podczas edycji komentarza.",
    });
  }
});

module.exports = commentRoutes;
