FROM node:alpine as build
WORKDIR /src/app
# Install app dependencies
COPY package*.json ./
RUN npm install

COPY . .
EXPOSE 3002
CMD [ "node", "server.js" ]
