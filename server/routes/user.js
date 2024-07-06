const express = require("express");
const userRoutes = express.Router();
const bcrypt = require("bcrypt");
const dbo = require("../db/conn");
const ObjectId = require("mongodb").ObjectId;
const { saveLogsToFile } = require("../logger");

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

userRoutes.route("/login").post(async (req, res) => {
  const { login, password } = req.body;

  try {
    const db = dbo.getDb();
    const user = await db.collection("users").findOne({ login });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Podany użytkownik nie istnieje.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      saveLogsToFile(`Zalogowano jako ${user.login}`);
      res.cookie("user_id", user._id.toString(), { httpOnly: false });
      res.status(200).json({
        success: true,
        message: "Zalogowano pomyślnie.",
      });
    } else {
      res.status(401).json({
        success: false,
        message: "Nieprawidłowy login lub hasło.",
      });
    }
  } catch (error) {
    console.error("Błąd podczas logowania:", error);
    res.status(500).json({
      success: false,
      message: "Wystąpił błąd podczas logowania.",
    });
  }
});

userRoutes.route("/getLoginById/:userId").get(async (req, res) => {
  const { userId } = req.params;
  try {
    const db = dbo.getDb();
    const user = await db
      .collection("users")
      .findOne({ _id: ObjectId(userId) });

    res.status(200).json({
      success: true,
      login: user.login,
    });
  } catch (error) {
    console.error("Błąd podczas pobierania loginu użytkownika:", error);
    res.status(500).json({
      success: false,
      message: "Wystąpił błąd podczas pobierania loginu użytkownika.",
    });
  }
});

userRoutes.route("/logout").delete(async (req, res) => {
  try {
    // const db = dbo.getDb("memorygame");
    saveLogsToFile("Pomyślnie wylogowano");
    // await db.collection("comments").deleteMany({});

    res.clearCookie("user_id");
    res.status(200).json({
      success: true,
      message: "Wylogowano pomyślnie. Wszystkie komentarze zostały usunięte.",
    });
  } catch (error) {
    console.error("Błąd podczas wylogowywania:", error);
    res.status(500).json({
      success: false,
      message: "Wystąpił błąd podczas wylogowywania.",
    });
  }
});

userRoutes.route("/playagain").delete(async (req, res) => {
  try {
    const db = dbo.getDb("memorygame");
    saveLogsToFile("Zakończono rozgrywkę. Nie wylogowano.");
    await db.collection("comments").deleteMany({});

    res.status(200).json({
      success: true,
      message:
        "Ponownie rozpoczęto rozgrywkę. Wszystkie komentarze zostały usunięte.",
    });
  } catch (error) {
    console.error("Błąd podczas ponownego rozpoczynania rozgrywki:", error);
    res.status(500).json({
      success: false,
      message: "Wystąpił błąd podczas ponownego rozpoczynania rozgrywki.",
    });
  }
});
module.exports = userRoutes;
