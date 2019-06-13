FROM node:10.15.3-alpine
EXPOSE 3000 9229

RUN mkdir -p /app
WORKDIR /app

COPY package.json /app
COPY yarn.lock /app
RUN yarn

COPY . /app

RUN yarn build

CMD yarn start