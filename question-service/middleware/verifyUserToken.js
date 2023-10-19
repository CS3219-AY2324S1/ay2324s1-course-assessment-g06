const axios = require('axios');

const userSvcApi = "http://localhost:3003/api/auth";

const verifyUserToken = (req, res, next) => {
    console.log('Verifying user token...'); // Debugging message to indicate the start of the function

    const token = req.headers['x-access-token'];
    console.log('Token:', token); // Display the token for debugging purposes

    if (!token) {
        console.log('No token provided!'); // Debugging message
        return res.status(403).send({ message: "No token provided!" });
    }

    axios.get(`${userSvcApi}/verifyToken`, { 
        headers: { 'x-access-token': token }
    })
    .then(response => {
        console.log('Response from userSvcApi:', response.status, response.data); // Display the response status and data
        if (response.status === 200) {
            next();
        } else {
            // If the status code is not 200 or any other unexpected status code is received
            console.log('Unexpected response status:', response.status); // Debugging message
            res.status(401).send({ message: "Unauthorized by qnssvc!" });
        }
    })
    .catch(error => {
        console.error('Error during token verification:', error); // Display the error for debugging purposes
        res.status(401).send({ message: "Unauthorized! by qns svc" });
    });
};

module.exports = verifyUserToken;
