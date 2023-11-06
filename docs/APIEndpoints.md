 # API Endpoints

🔨 Working In Progress 🔨

User Authentication in `User-Service` is implemented using [JWT](https://jwt.io/). The following table lists the API endpoints for `User-Service`.

| HTTP Method | API Route                 | Purpose                 | Headers         | Parameters (JSON)                             | User Roles    |
|-------------|---------------------------|-------------------------|-----------------|-----------------------------------------------|---------------|
| POST        | `/api/auth/signup`        | User Signup             | -               | `username, email, password, roles (optional)` | Any           |
| POST        | `/api/auth/signin`        | User Signin             | -               | `username, password`                          | Any           |
| DELETE      | `/api/auth/removeuser`    | Remove a User           | `x-access-token`| None                                          | -             |
| PATCH       | `/api/auth/updateprofile` | Update User Profile     | `x-access-token`| `username, email`                             | User / Admin  |
| PATCH       | `/api/auth/updatepassword`| Update User Password    | `x-access-token`| `currentPassword, newPassword`                | User / Admin  |
| GET         | `/api/auth/getuser`       | Get User Profile        | `x-access-token`| None                                          | User / Admin  |
| GET         | `/api/auth/verifytoken`   | Verify JWT Token        | `x-access-token`| None                                          | User / Admin  |
| GET         | `/api/auth/verifyadmin`   | Verify if User is Admin | `x-access-token`| None                                          | Admin Only    |


