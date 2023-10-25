FROM node:latest as build
WORKDIR /src/app
# Install app dependencies

COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .
EXPOSE 3003
CMD [ "node", "server.js" ]
# docker run -d -p 1011:3000 cs3219-user
# newer
# docker run -d -p 127.0.0.1:3003:3003  --env-file ../.env cs3219-user-v1
# http://localhost:3003/