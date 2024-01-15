const express = require("express");
const userRoutes = express.Router();
const bcrypt = require("bcrypt");
const dbo = require("../db/conn");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
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
      const token = jwt.sign(
        { userId: user._id, login: user.login },
        "secret_key",
        {
          expiresIn: "1h",
        }
      );

      res.cookie("jwt", token, { httpOnly: true, maxAge: 3600000 });

      res.status(200).json({
        success: true,
        message: "Zalogowano pomyślnie.",
      });
    } else {
      res.status(401).json({
        success: false,
        message: "Nieprawidłowe hasło.",
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

// // Middleware do weryfikacji tokena JWT
// const checkToken = (req, res, next) => {
//   const token = req.cookies.jwt;
//   console.log(token);

//   if (!token) {
//     return res
//       .status(401)
//       .json({ success: false, message: "Brak autoryzacji." });
//   }

//   jwt.verify(token, "secret_key", (err, decoded) => {
//     if (err) {
//       return res
//         .status(401)
//         .json({ success: false, message: "Nieprawidłowy token." });
//     }

//     req.user = decoded;
//     next();
//   });
// };

// userRoutes.route("/currentUser").get(checkToken, (req, res) => {
//   res.status(200).json({ success: true, user: req.user });
// });

module.exports = userRoutes;
