import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import db from 'pg';
import {router} from './internal/app/router/router.js';
const hostname = '127.0.0.1';
// const hostname = '0.0.0.0';
const port = 5000;

const app = express();
app.use(bodyParser.json());
// app.use(cors())
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
})

const pool = new db.Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'equestrian',
    password: 'postgres',
    port: 5432,
});

router(app, pool);

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
