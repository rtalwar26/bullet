FROM node:12.16.1

RUN useradd --user-group --create-home --shell /bin/false app
ENV HOME=/home/app
ENV APP_DIR=gun-server


COPY gun-server.js package.json $HOME/$APP_DIR/

RUN chown -R app:app $HOME/*

USER app
WORKDIR $HOME/$APP_DIR

USER root






WORKDIR $HOME/$APP_DIR
RUN chown -R app:app $HOME/*
RUN npm install --only=prod --verbose

ENV TZ=Asia/Kolkata
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

USER app

# CMD ["node", "src/app.js"]