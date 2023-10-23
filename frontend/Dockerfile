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

ENV REACT_APP_USER_SVC_URL=https://cs3219-ay2324s1-user-service-a2rwifv3ta-an.a.run.app/api/auth/
ENV REACT_APP_QUESTION_HOST=https://cs3219-ay2324s1-question-service-a2rwifv3ta-an.a.run.app/api/questions
ENV REACT_APP_MATCHING_SERVICE_CORS=https://cs3219-ay2324s1-matching-service-a2rwifv3ta-an.a.run.app

# Build the app
RUN npm run build

RUN npm i -g serve

EXPOSE 3001

CMD ["serve", "-s", "build","-l","3001"]

# # prod build v1
# # Stage 1: Build docker image of react app
# FROM node:alpine as build

# # Create an app directory to hold the application code inside the image
# WORKDIR /src/app

# # Copy app dependencies (package.json, package-lock.json, tsconfig.json, etc)
# COPY package*.json ./

# # Install app dependencies
# RUN npm install --silent


# # Copy the rest of the application code
# COPY . .

# # Build the app
# RUN npm run build

# # Stage 2: Copy the react app build to NGINX
# FROM nginx:alpine

# # Copy NGINX configuration file
# COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

# # Copy files to NGINX
# COPY --from=build /src/app/build /usr/share/nginx/html

# # # Expose port 3001
# EXPOSE 3001

# # Start NGINX
# CMD ["nginx", "-g", "daemon off;"]

# docker build -t cs3219-web .
# docker run -p 3001:3001 cs3219-web