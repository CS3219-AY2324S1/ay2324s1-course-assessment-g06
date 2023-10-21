const axios = require('axios');

const userSvcApi = "http://localhost:3003/api/auth";

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
            res.status(401).send({ message: "Unauthorized by qnssvc!" });
        }
    })
    .catch(error => {
        res.status(401).send({ message: "Unauthorized! by qns svc" });
    });
};

module.exports = verifyUserToken;
