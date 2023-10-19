const axios = require('axios');

const userSvcApi = "http://localhost:3003/api/auth";

const verifyUserToken = (req, res, next) => {
    const token = req.headers['x-access-token'];

    if (!token) {
        return res.status(403).send({ message: "No token provided!" });
    }

    axios.post(`${userSvcApi}/verifyToken`, null, { 
        headers: { 'x-access-token': token }
    })
    .then(response => {
        if (response.status === 200) {
            next();
        } else {
            // If the status code is not 200 or any other unexpected status code is received
            res.status(401).send({ message: "Unauthorized!" });
        }
    })
    .catch(error => {
        res.status(401).send({ message: "Unauthorized!" });
    });
};

module.exports = verifyUserToken;
