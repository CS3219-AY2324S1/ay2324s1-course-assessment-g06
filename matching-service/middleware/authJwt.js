const axios = require('axios');
const jwt = require("jsonwebtoken");
const auth_server = process.env.USR_SVC_AUTH;

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
    let response = await axios.get(`${auth_server}/verifyToken`, { 
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
    req.userId = decoded.id;
    next();
  } catch (error) {
    console.error("Error verifying token with matching-service:", error.message);
    console.log(error);
    return res.status(500).send({
      message: "Internal server error"
    });
  }
};

const authJwt = {
  verifyToken: verifyToken,
};

module.exports = authJwt;
