const express = require("express");
const userRoutes = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Yup = require("yup");
const dbo = require("../db/conn");

userRoutes.route("/register").post(async (req, res) => {
  const { login, password } = req.body;

  const registrationSchema = Yup.object({
    login: Yup.string()
      .required("Login jest wymagany")
      .min(3, "Login musi mieć co najmniej 3 znaki")
      .max(20, "Login może mieć maksymalnie 20 znaków")
      .matches(
        /^[a-zA-Z0-9ąęółśżźćńĄĘÓŁŚŻŹĆŃ_.-]*$/,
        "Login może zawierać tylko litery, cyfry i znaki: _ - ."
      ),
    password: Yup.string()
      .required("Hasło jest wymagane")
      .min(6, "Hasło musi mieć co najmniej 6 znaków")
      .max(30, "Hasło może mieć maksymalnie 30 znaków"),
  });

  try {
    await registrationSchema.validate({ login, password });

    const saltRounds = 10;
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
      const newUser = { _id: result.insertedId, login };
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      res.status(201).json({
        success: true,
        message: "Użytkownik został pomyślnie zarejestrowany i zalogowany.",
        user: {
          id: newUser._id,
          login: newUser.login,
        },
        token,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Wystąpił błąd podczas rejestracji.",
      });
    }
  } catch (error) {
    if (error instanceof Yup.ValidationError) {
      return res.status(400).json({ success: false, message: error.message });
    }
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
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      res.status(200).json({
        success: true,
        message: "Zalogowano pomyślnie.",
        user: {
          id: user._id,
          login: user.login,
        },
        token,
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


userRoutes.route("/logout").delete(async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Wylogowano pomyślnie.",
    });
  } catch (error) {
    console.error("Błąd podczas wylogowywania:", error);
    res.status(500).json({
      success: false,
      message: "Wystąpił błąd podczas wylogowywania.",
    });
  }
});

module.exports = userRoutes;
