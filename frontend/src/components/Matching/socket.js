import io from 'socket.io-client';

// Check if user is logged in via local storage token
const user = JSON.parse(localStorage.getItem("user"));
let jwtToken = null;

if (user && user.accessToken) {
    jwtToken = user.accessToken;
} else {
    console.log("User is not authorized yet");
}

const URL = process.env.MATCHING_SERVICE_CORS || "http://localhost:3002"

export const socket = io(URL, {
    query: { token: jwtToken }, // Include the token if available
});
