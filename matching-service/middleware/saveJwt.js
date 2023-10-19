const jwt = require("jsonwebtoken");
const config = require("../config/save.config.js");
const db = require("../models");
const SessionHistory = db.SessionHistory;

verifyToken = (req, res, next) => {
  console.log('verifyToken middleware is running');

  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    });
  }

  jwt.verify(token,
    config.secret,
    (err, decoded) => {
        if (err) {
        return res.status(401).send({
            message: "Unauthorized!",
        });
        }
        req.userId = decoded.id;
        next();
    });
};

const saveJwt = {
  verifyToken: verifyToken,
};
module.exports = saveJwt;
