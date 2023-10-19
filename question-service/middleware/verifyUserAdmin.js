const axios = require('axios');

const userSvcApi = "http://localhost:3003/api/auth";

const verifyUserAdmin = (req, res, next) => {
    console.log('Verifying user admin token...'); // Debugging message to indicate the start of the function

    const token = req.headers['x-access-token'];
    console.log('Token:', token); // Display the token for debugging purposes

    if (!token) {
        console.log('No token provided!'); // Debugging message
        return res.status(403).send({ message: "No token provided!" });
    }

    // Directly check if user is an admin
    axios.get(`${userSvcApi}/verifyAdmin`, {
        headers: { 'x-access-token': token }
    })
    .then(adminResponse => {
        console.log('Admin verification response:', adminResponse.status, adminResponse.data); // Display the response status and data
        if (adminResponse.status === 200) {
            next();  // Move to the next middleware or request handler
        } else {
            console.log('User is not an admin:', adminResponse.status); // Debugging message
            res.status(401).send({ message: "User is not an admin!" });
        }
    })
    .catch(error => {
        console.error('Error during admin check:', error); // Display the error for debugging purposes
        res.status(401).send({ message: "Unauthorized! by qns svc" });
    });
};

module.exports = verifyUserAdmin;
