const express = require("express");
const userRoutes = express.Router();
const bcrypt = require("bcrypt");
const dbo = require("../db/conn");
const ObjectId = require("mongodb").ObjectId;

userRoutes.route("/register").post(async (req, res) => {
  const saltRounds = 10;
  const { login, password } = req.body;

  try {
    const db = dbo.getDb();
    const existingUser = await db.collection("users").findOne({ login });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Użytkownik o podanym loginie już istnieje.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const result = await db.collection("users").insertOne({
      login,
      password: hashedPassword,
    });

    if (result.acknowledged && result.insertedId) {
      res.status(201).json({
        success: true,
        message: "Użytkownik został pomyślnie zarejestrowany.",
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Wystąpił błąd podczas rejestracji.",
      });
    }
  } catch (error) {
    console.error("Błąd podczas rejestracji użytkownika:", error);
    res
      .status(500)
      .json({ success: false, message: "Wystąpił błąd podczas rejestracji." });
  }
});

module.exports = userRoutes;
