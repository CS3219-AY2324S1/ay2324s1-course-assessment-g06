const axios = require('axios');

const auth_server = process.env.USR_SVC_AUTH;

const verifyUser2Token = (req, res, next) => {

    const token = req.headers['x-access-token2'];

    if (!token) {
        return res.status(403).send({ message: "Token 2 not provided!" });
    }

    axios.get(`${auth_server}/verifyToken`, { 
        headers: { 'x-access-token': token }
    })
    .then(userResponse => {
        if (userResponse.status === 200) {
            next();  // The user is a valid user, proceed to the next middleware
        } else {
            // Forward the status code from the adminResponse
            res.status(userResponse.status).send({ message: userResponse.data.message });
        }
    })
    .catch(error => {
        console.log(error);
        // Forward the status code from the error response
        const status = error.response ? error.response.status : 500;
        const message = error.response ? error.response.data.message : "Internal Server Error";
        res.status(status).send({ message: message });
    });
};

module.exports = verifyUser2Token;
