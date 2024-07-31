FROM node:20

WORKDIR /opt/imagex/imagex-server

COPY package*.json .

RUN yarn install

COPY . .

EXPOSE 4000

CMD ["yarn", "start"]