# Stage 1: Build docker image of react app
FROM node:latest as build

# Create an app directory to hold the application code inside the image
WORKDIR /src/app

# Copy app dependencies (package.json, package-lock.json, tsconfig.json, etc)
COPY package*.json ./

# Install app dependencies
RUN npm install --silent

# Copy the rest of the application code
COPY . .

EXPOSE 3001

CMD ["npm", "start"]