FROM node:latest as build
WORKDIR /src/app
# Install app dependencies

COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .
EXPOSE 3003
CMD [ "node", "server.js" ]
