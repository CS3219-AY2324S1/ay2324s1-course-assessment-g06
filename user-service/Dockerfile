FROM arm64v8/node:latest as build
WORKDIR /usr/src/app
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
RUN npm install
# If you are building your code for production
# RUN npm ci --omit=dev
# Bundle app source
COPY . .
EXPOSE 3000
CMD [ "node", "server.js" ]
# docker run -d -p 1011:3000 cs3219-user
# http://localhost:1011/