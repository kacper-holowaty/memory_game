const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(403).send("Token jest wymagany do uwierzytelnienia");
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Nieprawidłowy token");
  }
  return next();
};

module.exports = verifyToken;