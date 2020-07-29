FROM node:alpine3.11

WORKDIR /app

EXPOSE 3000

ADD . .

RUN npm install --only=prod

ENTRYPOINT node app.js

CMD /bin/sh
