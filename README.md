[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/6BOvYMwN)

> **[ IMPORTANT FOR NUS CONNECTIONS!]**\
> If you are connected to the NUS Campus Network (either directly or indirectly), you will not be able to connect to MongoDB Atlas and Google Cloud SQL, which is required by our application. You can circumvent this by going through a VPN.

# Application Installation and Setup

Click for instructions for the respective modes:

- [Running Locally](docs/RunningLocally.md)
- [Running on Docker](docs/RunningOnDocker.md)

# Resources for Developer / Tester

## Software

For development, you may also want to install:

- [Docker Desktop](https://www.docker.com/get-started/)
- [Postman](https://www.postman.com/downloads/)
- [MySQLWorkBench](https://dev.mysql.com/downloads/workbench/)

## Documentation

- [API Endpoints](docs/APIEndpoints.md)
- [Containerization](docs/Containerization.md)

## Microservices
These are the microservices we defined for our application. Each microservice is a separate folder. You can start individual services separately to test, but there are dependencies among the services, they might not function as expected on it's own.

- [User Service](user-service)
- [Matching Service](matching-service)
- [Question Service](question-service)
- [Frontend](frontend)

To run User-Service
1. `cd user-service`
2. `npm install`
3. `nodemon server.js`

To run Matching-Service
1. `cd matching-service`
2. `npm install`
3. `nodemon server.js`

To run Question-Service
1. `cd question-service`
2. `npm install`
3. `nodemon server.js`

To run Frontend
1. `cd frontend`
2. `npm install`
3. `npm start`