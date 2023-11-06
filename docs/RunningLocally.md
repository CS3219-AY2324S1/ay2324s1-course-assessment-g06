# Running Locally  

Welcome to PeerPrep! This guide will help you set up and run our services on your local machine. This is ideal for development and testing purposes. 

Before you start, please ensure you have the necessary software installed and have internet access. This guide assumes you are using a Unix-like operating system such as Linux or MacOS. If you're using a different OS, the steps should be similar, but some commands may vary.

Follow the instructions carefully to clone our repository, set up environment variables, and start the services. Let's get started!

## Software Requirements

Download and install these software if you do not have them locally.

- [NodeJS](https://nodejs.org/en/download)
- [MySQL](https://dev.mysql.com/downloads/mysql/)

## Internet Access

Ensure that you are connected to the internet.

> Note!\
> If you are on NUS Network, make sure you use a VPN that can connect to Google Cloud SQL and MongoDB Atlas.

## Git clone our repository

To clone the repository, follow these steps:
1. Open your terminal.
2. Navigate to the directory where you want to clone the repository.
3. Run the following command

```bash
git clone https://github.com/CS3219-AY2324S1/ay2324s1-course-assessment-g06.git
cd ay2324s1-course-assessment-g06/
```

## Setup environment variables
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

## Installing node packages
Go into the individual microservices and do NPM install on all
``` bash
cd frontend
npm install
cd ../user-service
npm install
cd ../question-service
npm install
cd ../matching-service
npm install
cd ..
```

## Starting application
Run these on commands individual terminals
- ```cd frontend; npm start```
- ```cd user-service; nodemon server.js```
- ```cd question-service; nodemon server.js```
- ```cd matching-service; nodemon server.js```

You should be able to access the server on http://localhost:3001 now!

## Stopping Applications

When you're done testing or developing, you can stop all the services by pressing `Ctrl + C` in each terminal where the services are running. This will stop the execution of the services.

---
Thank you for following along with this guide. We hope it has been helpful in setting up and running our application locally. 

🌟 Don't forget to star the repo if you find PeerPrep exciting and useful!

Thank you for visiting, and happy coding!

-CS3219 Team G06