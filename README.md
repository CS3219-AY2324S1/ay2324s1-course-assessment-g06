[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/6BOvYMwN)

# 👋 Welcome to PeerPrep! 👋

 Hello and welcome to the GitHub repository for PeerPrep, a collaborative platform dedicated to empowering and connecting learners from around the globe! This is done by Group G06 for CS3219 in AY23/24 Semester 1!

### What is PeerPrep?
PeerPrep is an innovative platform designed to enhance your learning journey through collaborative preparation. Whether you're gearing up for exams, mastering a new subject, or simply quenching your thirst for knowledge, PeerPrep is here to make the process interactive, effective, and enjoyable.

Check out our deployment of the code on [GCP](https://fe-a2rwifv3ta-dt.a.run.app/)!

---

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
- [NodeJS](https://nodejs.org/en/download)
- [MySQL](https://dev.mysql.com/downloads/mysql/)

## Documentation

- [API Endpoints](docs/APIEndpoints.md)

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

---

<div align="center">
  <img width="55" src="https://raw.githubusercontent.com/gilbarbara/logos/master/logos/axios.svg"/>
  <img width="55" src="https://raw.githubusercontent.com/gilbarbara/logos/master/logos/docker-icon.svg"/>
  <img width="55" src="https://raw.githubusercontent.com/gilbarbara/logos/master/logos/express.svg"/>
  <img width="55" src="https://raw.githubusercontent.com/gilbarbara/logos/master/logos/google-cloud.svg"/>
  <img width="55" src="https://raw.githubusercontent.com/gilbarbara/logos/master/logos/google-cloud-functions.svg"/>
  <img width="55" src="https://raw.githubusercontent.com/gilbarbara/logos/master/logos/google-cloud-run.svg"/>
  <img width="55" src="https://raw.githubusercontent.com/gilbarbara/logos/master/logos/javascript.svg"/>
  <img width="55" src="https://raw.githubusercontent.com/gilbarbara/logos/master/logos/jwt-icon.svg"/>
  <img width="55" src="https://raw.githubusercontent.com/gilbarbara/logos/master/logos/material-ui.svg"/>
  <img width="55" src="https://raw.githubusercontent.com/gilbarbara/logos/master/logos/mongodb-icon.svg"/>
  <img width="55" src="https://raw.githubusercontent.com/gilbarbara/logos/master/logos/mysql-icon.svg"/>
  <img width="55" src="https://raw.githubusercontent.com/gilbarbara/logos/master/logos/nodejs-icon.svg"/>
  <img width="55" src="https://raw.githubusercontent.com/gilbarbara/logos/master/logos/nodemon.svg"/>
  <img width="55" src="https://raw.githubusercontent.com/gilbarbara/logos/master/logos/postman-icon.svg"/>
  <img width="55" src="https://raw.githubusercontent.com/gilbarbara/logos/master/logos/react.svg"/>
  <img width="55" src="https://raw.githubusercontent.com/gilbarbara/logos/master/logos/react-router.svg"/>
  <img width="55" src="https://raw.githubusercontent.com/gilbarbara/logos/master/logos/socket.io.svg"/>
  <img width="55" src="https://raw.githubusercontent.com/gilbarbara/logos/master/logos/typescript-icon.svg"/>
</div>


---
🌟 Don't forget to star the repo if you find PeerPrep exciting and useful!

Thank you for visiting, and happy coding!

-CS3219 Team G06