FROM node:10.15.3-alpine
ARG PORT
EXPOSE ${PORT}

RUN mkdir -p /app
WORKDIR /app

COPY package.json /app
COPY yarn.lock /app
RUN apk --no-cache add --virtual builds-deps build-base python
RUN yarn

COPY . /app

RUN yarn build

CMD yarn start