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
# docker run -d -p 127.0.0.1:3001:3001  --env-file ../.env cs3219-frontend-v1

# Build the app
# RUN npm run build

# # Stage 2: Copy the react app build to NGINX
# FROM arm64v8/nginx:latest

# # Copy NGINX configuration file
# COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

# # Copy files to NGINX
# COPY --from=build /app/build /usr/share/nginx/html

# # Expose port 80
# EXPOSE 80

# # Start NGINX
# CMD ["nginx", "-g", "daemon off;"]

# docker build -t cs3219-web .
# docker run -p 8080:80 cs3219-web