import express from 'express';
import dotenv from 'dotenv';
import { dbConnection } from './database/DBConnection.js';
import { appRouter } from './app.router.js';
dotenv.config({ path: './config.env' });

const app = express();
const port = 3000;
dbConnection();

app.get('/', (req, res) => res.send('Home Page'));
// Routing
appRouter(app, express);


app.listen(port, () => console.log(`Example app listening on port ${port}!`));