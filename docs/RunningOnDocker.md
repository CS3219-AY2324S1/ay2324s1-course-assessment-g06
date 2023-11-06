# Running on Docker

Welcome to our guide on running our application using Docker. This document will provide you with step-by-step instructions to get our application up and running on your local machine using Docker.

Before you start, please ensure you have the necessary software installed and have internet access. This guide assumes you are using a Unix-like operating system such as Linux or MacOS. If you're using a different OS, the steps should be similar, but some commands may vary.

Follow the instructions carefully to clone our repository, setup environment variables and run the applications on docker! Let's get started!

## Software Requirements

Download and install these software if you do not have them locally.

- [Docker Desktop](https://www.docker.com/get-started/)

## Internet Access

Ensure that you are connected to the internet.

> Note!\
> If you are on NUS Network, make sure you use a VPN that can connect to Google Cloud SQL and MongoDB Atlas.

## Containerization

Docker is used to containerize our various micro-services
which serves our combined application.

Our application is composed of the following services:
- User Service: Manages user data and authentication.
- Question Service: Handles all operations related to questions.
- Matching Service: Responsible for matching users based on their preferences.
- Frontend: The user interface of our application.

## Git clone our repository (skip if you had already done so)

To clone the repository, follow these steps:
1. Open your terminal.
2. Navigate to the directory where you want to clone the repository.
3. Run the following command

```bash
git clone https://github.com/CS3219-AY2324S1/ay2324s1-course-assessment-g06.git
cd ay2324s1-course-assessment-g06/
```

## Setup environment variables (skip if you had already done so)
1. At the root directory, open a terminal
2. Duplicate `template.env` in docs as `.env`
   ```
   cd docs/
   cp template.env ../.env
   cp template.env ../frontend/.env
   cd ..
   ```
3. Open `.env` file
4. Fill up the MYSQL root password
   (previously configured when installing MySQL)
   - Example: if your root password is "password1234",
     `SQL_PASSWORD=yourrootpassword`
5. Fill up a JWT token password
   (for generating and decoding JWT tokens)
   - Example: if you want to set the password to "password",
     `JWT_SECRET=yoursecret`
6. Fill up the MongoDB Atlas connection string
    ```
    MONGO_USERNAME=<Your username>
    MONGO_PASSWORD=<Your Password>
    MONGO_HOST=<Your Cluster>
    ```

## Start Docker and Check Version

Before running Docker Compose, ensure that Docker is installed and running on your machine. You can check the version of Docker installed by running the following command in your terminal:

```bash
docker --version
```

This should display the Docker version installed on your machine.

## Run Docker Compose
To start all services, navigate to the root directory of the project where the docker-compose.yml file is located, and run the following command:

```bash
docker compose up
```

This will start all the services defined in the docker-compose.yml file. If you want to run the services in the background, you can use the -d flag:

```bash
docker compose up -d
```

## Testing
After running the services, you should test them to ensure they're working as expected. You can do this by navigating to the URLs of the services in your web browser or using a tool like Postman to send requests to the services' endpoints as defined in our endpoints file.

You should be able to access the server on http://localhost:3001 now!

## Stopping the Services

When you're done testing or developing, you can stop all the services by running the following command in the same directory as your `docker-compose.yml` file:

```bash
docker-compose down
```

This will stop and remove all the running containers. If you want to also remove the volumes defined in your docker-compose.yml file, you can use the -v flag:

```bash
docker-compose down -v
```

---

Thank you for following along with this guide. We hope it has been helpful in setting up and running our application using Docker. 

🌟 Don't forget to star the repo if you find PeerPrep exciting and useful!

Thank you for visiting, and happy coding!

-CS3219 Team G06