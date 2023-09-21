import axios from "axios";

const API_URL = "http://localhost:3001/api/auth/";

class AuthService {
  // This will perform a POST request to the backend API with the user's username and password.
  // If the login is successful, the response will contain an accessToken and a user object.
  // The accessToken is a JWT that is used to authenticate all requests made by the user.
  // The user object is a JSON object that contains the user's details.
  // The user object is stored in localStorage, which means the user will be logged in even after the page is refreshed.
  login(username: string, password: string) {
    return axios
      .post(API_URL + "signin", {
        username,
        password
      })
      .then(response => {
        if (response.data.accessToken) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }
        return response.data;
      });
  }

  // This will remove the user object from localStorage, logging the user out.
  logout() {
    localStorage.removeItem("user");
  }

  // This will perform a POST request to the backend API with the user's username, email, and password.
  register(username: string, email: string, password: string) {
    return axios.post(API_URL + "signup", {
      username,
      email,
      password
    });
  }

  // This will return the user object from localStorage if there is one.
  // The user object is parsed from a JSON string to a JavaScript object before it's returned.
  getLoggedInUser() {
    const userStr = localStorage.getItem("user");
    if (userStr) return JSON.parse(userStr);
    
    return null;
  }
}

module.exports = AuthService;

// export default new AuthService();