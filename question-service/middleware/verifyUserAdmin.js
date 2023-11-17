const axios = require('axios');

const auth_server = process.env.USR_SVC_AUTH;

const verifyUserAdmin = (req, res, next) => {

    const token = req.headers['x-access-token'];

    if (!token) {
        return res.status(401).send({ message: "No token provided!" });
    }

    // Directly check if user is an admin
    axios.get(`${auth_server}/verifyAdmin`, {
        headers: { 'x-access-token': token }
    })
    .then(adminResponse => {
        if (adminResponse.status === 200) {
            next();  // The user is a valid admin, proceed to the next middleware
        } else {
            // Forward the status code from the adminResponse
            res.status(adminResponse.status).send({ message: adminResponse.data.message });
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

module.exports = verifyUserAdmin;
