FROM node:12
WORKDIR /usr/src/app
COPY ./src .
RUN npm install
RUN npm run build
CMD ["node", "."]
EXPOSE 8080