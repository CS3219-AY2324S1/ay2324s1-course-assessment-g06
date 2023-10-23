const axios = require('axios');

const USER_SERVICE = process.env.USR_SVC_AUTH || "http://localhost:3003/api/auth";
const userSvcApi = USER_SERVICE;

const verifyUserToken = (req, res, next) => {

    const token = req.headers['x-access-token'];

    if (!token) {
        return res.status(403).send({ message: "Token not provided!" });
    }

    axios.get(`${userSvcApi}/verifyToken`, { 
        headers: { 'x-access-token': token }
    })
    .then(response => {
        if (response.status === 200) {
            next();
        } else {
            console.log(response);
            res.status(401).send({ message: "Failed user verification!" });
        }
    })
    .catch(error => {
        if (error.response.status === 401) {
            res.status(401).send({ message: "Token Failed Authentication!" });
        } else {
            res.status(500).send({ message: "Something went wrong with the auth service" });
        }
    });
};

module.exports = verifyUserToken;
