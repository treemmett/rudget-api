import 'reflect-metadata';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { createConnection } from 'typeorm';
import dotenv from 'dotenv';
import errorHandler from './middleware/errorHandler';
import { errors } from 'celebrate';
import express from 'express';
import generateRoutes from './routes';

dotenv.config();

const {
  DB_HOST = 'db',
  DB_USER = 'postgres',
  DB_PASS = 'postgres',
  DB_DATABASE = 'rudget',
  DB_PORT = '5432'
} = process.env;

createConnection({
  cli: {
    entitiesDir: 'build/entities',
    migrationsDir: 'build/migration',
    subscribersDir: 'build/subscriber'
  },
  database: DB_DATABASE,
  entities: ['build/entities/**/*.js'],
  host: DB_HOST,
  logging: false,
  migrations: ['build/migration/**/*.js'],
  password: DB_PASS,
  port: parseInt(DB_PORT, 10),
  subscribers: ['build/subscriber/**/*.js'],
  synchronize: true,
  type: 'postgres',
  username: DB_USER
})
  .then(async () => {
    const app = express();

    const routes = await generateRoutes();

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use(cookieParser());

    app.use(routes);

    app.use(errors());

    app.use(errorHandler());

    const port = process.env.PORT || 3000;
    // eslint-disable-next-line no-console
    app.listen(port, () => console.log(`API up on ${port}`));
  })
  .catch(e => {
    console.log(e);
    console.log('Error');
  });
