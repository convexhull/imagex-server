FROM node:12.18.0-stretch

WORKDIR /home/node/app

COPY . .

RUN yarn install

EXPOSE 4000

CMD ["yarn", "start"]