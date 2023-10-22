// const jwt = require("jsonwebtoken");
// const config = require("../config/save.config.js");
// const db = require("../models");
// const SessionHistory = db.SessionHistory;

// verifyToken = (req, res, next) => {
//   console.log('verifyToken middleware is running');

//   let token = req.headers["x-access-token"];

//   if (!token) {
//     return res.status(403).send({
//       message: "No token provided!"
//     });
//   }

//   jwt.verify(token,
//     config.secret,
//     (err, decoded) => {
//         if (err) {
//         return res.status(401).send({
//             message: "Unauthorized!",
//         });
//         }
//         req.userId = decoded.id;
//         next();
//     });
// };

// const saveJwt = {
//   verifyToken: verifyToken,
// };
// module.exports = saveJwt;

const USER_SERVICE = process.env.USER_SERVICE || "http://localhost:3003";
const axios = require('axios');
const config = require("../config/save.config.js");
const jwt = require("jsonwebtoken");


verifyToken = async (req, res, next) => {
  console.log('verifyToken middleware is running');

  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    });
  }

  try {
    // Make a request to user-service to verify the token
    let response = await axios.get(`${USER_SERVICE}/api/auth/verifyToken`, {
      headers: { 'x-access-token': token }
    });
    
    // Check for HTTP 200 status code
    if (response.status !== 200) {
      return res.status(401).send({
        message: "Unauthorized!",
      });
    }
    // This is okay because we know the token is validated by the user-service
    let decoded = jwt.decode(token);
    console.log("JWT claims:", decoded);
    req.userId = decoded.id;
    console.log("req.userId:", req.userId);
    next();
  } catch (error) {
    console.error("Error verifying token with user-service:", error.message);
    console.log(error);
    return res.status(500).send({
      message: "Internal server error"
    });
  }
};

const saveJwt = {
  verifyToken: verifyToken,
};

module.exports = saveJwt;