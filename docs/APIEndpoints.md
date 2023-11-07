 # API Endpoints

Welcome to the PeerPrep API Endpoints guide! This guide will help you understand the various API endpoints used in our services. This is ideal for developers and testers who want to interact with our services programmatically.

Before you start, please ensure you have a basic understanding of HTTP methods, API routes, and JSON. This guide assumes you are familiar with the concepts of user authentication, user history, question service, and matching service.

Follow the guide carefully to understand the purpose of each endpoint, the required headers, parameters, and whether admin privileges are required. Let's dive in!

## User Service

User Authentication in `User-Service` is implemented using [JWT](https://jwt.io/). The following table lists the API endpoints for user authentication.

| HTTP Method | API Route                 | Purpose                 | Headers         | Parameters (JSON)                             | Require Admin?|
|-------------|---------------------------|-------------------------|-----------------|-----------------------------------------------|---------------|
| POST        | `/api/auth/signup`        | User Signup             | -               | `username, email, password, roles (optional)` | N             |
| POST        | `/api/auth/signin`        | User Signin             | -               | `username, password`                          | N             |
| DELETE      | `/api/auth/removeuser`    | Remove a User           | `x-access-token`| None                                          | N             |
| PATCH       | `/api/auth/updateprofile` | Update User Profile     | `x-access-token`| `username, email`                             | N             |
| PATCH       | `/api/auth/updatepassword`| Update User Password    | `x-access-token`| `currentPassword, newPassword`                | N             |
| GET         | `/api/auth/getuser`       | Get User Profile        | `x-access-token`| None                                          | N             |
| GET         | `/api/auth/verifytoken`   | Verify JWT Token        | `x-access-token`| None                                          | N             |
| GET         | `/api/auth/verifyadmin`   | Verify if User is Admin | `x-access-token`| None                                          | Y             |


User History in `User-Service` is implemented using [MySQL](https://www.mysql.com/). The following table lists the API endpoints for user history.

| HTTP Method | API Route                   | Purpose                               | Headers         | Parameters (JSON)                             |Require Admin?|
|-------------|-----------------------------|---------------------------------------|-----------------|-----------------------------------------------|--------------|
| POST        | `/api/hist/save`            | Save user history                     | `x-access-token`| `questionId`, `difficulty`, `attempt`         | N            |
| POST        | `/api/hist/customsave`      | Save custom user history              | `x-access-token`| `questionId`, `difficulty`, `attempt`, `date` | N            |
| GET         | `/api/hist/attempts`        | Get all attempted dates from history  | `x-access-token`| None                                          | N            |
| GET         | `/api/hist/getall`          | Get all questions from user history   | `x-access-token`| None                                          | N            |

## Question Service

Questions in `Question-Service` are implemented using [MongoDB](https://www.mongodb.com/). The following table lists the API endpoints for questions.

| HTTP Method | API Route                  | Purpose                                       | Headers         | Parameters (JSON) | Query Parameters |Require Admin?|
|-------------|----------------------------|-----------------------------------------------|-----------------|-------------------|------------------|--------------|
| GET         | `/api/questions/`          | Retrieve all questions                        | `x-access-token`| None              | None             | N |
| GET         | `/api/questions/pagination/first` | Retrieve first page of paginated questions | `x-access-token`| None              | None             | N |
| GET         | `/api/questions/pagination/remaining` | Retrieve remaining paginated questions   | `x-access-token`| None              | None             | N |
| GET         | `/api/questions/:id`       | Retrieve a question by ID                     | `x-access-token`| None              | None             | N |
| POST        | `/api/questions`           | Create a new question                         | `x-access-token`|`title, frontendQuestionId, difficulty, content, category, topics`| None             | Y             |
| PUT         | `/api/questions/:id`       | Update a question                             | `x-access-token`|`title, frontendQuestionId, difficulty, content, category, topics`| None             | Y             |
| PATCH       | `/api/questions/:id`       | Soft delete a question                        | `x-access-token`| None              | None             | Y             |
| DELETE      | `/api/questions/:id`       | Delete a question                             | `x-access-token`| None              | None             | Y             |
| GET         | `/api/questions/matched`   | Get a random question via filters             | `x-access-token`| None              | `difficulty`, `topics` | N |
| POST        | `/api/questions/questionbyid` | Retrieve questions by IDs                  | `x-access-token`| `ids` (array)     | None             | N |
| GET         | `/api/questions/total`     | Get total number of questions per difficulty  | None            | None              | None             | -            |

## Matching Service

Matching administration and Code execution is done in `Matching-Service`. The following table lists the API endpoints.

| HTTP Method | API Route                  | Purpose                                       | Headers         | Parameters (JSON) | Query Parameters |Require Admin?|
|-------------|----------------------------|-----------------------------------------------|-----------------|-------------------|------------------|--------------|
| GET         | `/api/room/:roomId`        | Retrieve room information by ID               | -               | - | None | N |
| POST        | `/api/code/run`            | Run user submitted code                       | `x-access-token`| `code, input, language, fileName` | None | N |

---
That concludes our guide to the API endpoints used in PeerPrep. We hope this guide has been helpful in understanding the various endpoints and their purposes. 

Remember, when testing these endpoints, ensure you have the necessary permissions and provide the correct headers and parameters. 

🌟 Don't forget to star the repo if you find PeerPrep exciting and useful!

Thank you for visiting, and happy coding!

-CS3219 Team G06