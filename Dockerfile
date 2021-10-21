FROM node

WORKDIR /usr/app

COPY package.json yarn.lock ./

COPY . .

RUN yarn install

EXPOSE 3000

CMD ["yarn","run","start:dev"]
