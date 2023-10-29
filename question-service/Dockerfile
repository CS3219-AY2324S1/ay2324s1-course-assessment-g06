FROM node:alpine as build
WORKDIR /src/app
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
# docker run -p 1010:3000 cs3219-quest

# docker run -d -p 127.0.0.1:3000:3000  --env-file ../.env cs3219-question-v1
# localhost:3001