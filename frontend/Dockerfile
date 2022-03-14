# build environment
FROM node:14 AS development
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json /app/package.json
RUN npm install 
COPY . /app
RUN npm run build

EXPOSE 8081