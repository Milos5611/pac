FROM node:10-slim
WORKDIR /usr/src/app
VOLUME /usr/src/app/src
VOLUME /usr/src/app/public
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000 35729 3572
ENV HOST=0.0.0.0
CMD [ "npm", "dev" ]
