# # development build
# # Stage 1: Build docker image of react app
# FROM node:latest as build

# # Create an app directory to hold the application code inside the image
# WORKDIR /src/app

# # Copy app dependencies (package.json, package-lock.json, tsconfig.json, etc)
# COPY package*.json ./

# # Install app dependencies
# RUN npm install --silent


# # Copy the rest of the application code
# COPY . .

# EXPOSE 3001

# CMD ["npm", "start"]


# docker run -d -p 127.0.0.1:3001:3001  --env-file ../.env cs3219-frontend-v1

# prod build v2
# Stage 1: Build docker image of react app
FROM node:alpine as build

# Create an app directory to hold the application code inside the image
WORKDIR /src/app

# Copy app dependencies (package.json, package-lock.json, tsconfig.json, etc)
COPY package*.json ./

# Install app dependencies
RUN npm install --silent


# Copy the rest of the application code
COPY . .

ENV REACT_APP_USER_SVC=https://us-a2rwifv3ta-dt.a.run.app/api/auth
ENV REACT_APP_QNS_SVC=https://qs-a2rwifv3ta-dt.a.run.app/api/questions
ENV REACT_APP_MTC_SVC=https://ms-a2rwifv3ta-dt.a.run.app
ENV REACT_APP_USR_SVC_HIST=https://us-a2rwifv3ta-dt.a.run.app/api/hist
ENV REACT_APP_USR_SVC_AUTH=https://us-a2rwifv3ta-dt.a.run.app/api/auth

# Build the app
RUN npm run build

RUN npm i -g serve

EXPOSE 3001

CMD ["serve", "-s", "build","-l","3001"]
