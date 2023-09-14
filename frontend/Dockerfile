# Stage 1: Build docker image of react app
FROM arm64v8/node:latest as build

# Create an app directory to hold the application code inside the image
WORKDIR /app

# Copy app dependencies (package.json, package-lock.json, tsconfig.json, etc)
COPY package*.json ./

# Install app dependencies
RUN npm install --silent

# Copy the rest of the application code
COPY . ./

# Build the app
RUN npm run build

# Stage 2: Copy the react app build to NGINX
FROM arm64v8/nginx:latest

# Copy NGINX configuration file
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Copy files to NGINX
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]