const axios = require('axios');

const USER_SERVICE = process.env.USR_SVC_AUTH || "http://localhost:3003/api/auth";
const userSvcApi = USER_SERVICE;

const verifyUserAdmin = (req, res, next) => {

    const token = req.headers['x-access-token'];

    if (!token) {
        return res.status(403).send({ message: "No token provided!" });
    }

    // Directly check if user is an admin
    axios.get(`${userSvcApi}/verifyAdmin`, {
        headers: { 'x-access-token': token }
    })
    .then(adminResponse => {
        if (adminResponse.status === 200) {
            next();  // Move to the next middleware or request handler
        } else {
            res.status(401).send({ message: "User is not an admin!" });
        }
    })
    .catch(error => {
        res.status(401).send({ message: "Unauthorized! by qns svc" });
    });
};

module.exports = verifyUserAdmin;
