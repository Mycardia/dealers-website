FROM node:18.14.0-alpine3.17

ARG WORKDIRECTORY=/app

RUN mkdir -p $WORKDIRECTORY
WORKDIR $WORKDIRECTORY

COPY . /app
RUN npm install

EXPOSE 5005

CMD ["npm","run", "dev"]
