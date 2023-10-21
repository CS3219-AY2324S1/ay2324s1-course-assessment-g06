const axios = require('axios');

const userSvcApi = "http://localhost:3003/api/auth";

const verifyUser2Token = (req, res, next) => {

    const token = req.headers['x-access-token2'];

    if (!token) {
        return res.status(403).send({ message: "No token provided!" });
    }

    axios.get(`${userSvcApi}/verifyToken`, { 
        headers: { 'x-access-token': token }
    })
    .then(response => {
        if (response.status === 200) {
            next();
        } else {
            res.status(401).send({ message: "Unauthorized by qnssvc!" });
        }
    })
    .catch(error => {
        res.status(401).send({ message: "Unauthorized! by qns svc" });
    });
};

module.exports = verifyUser2Token;
