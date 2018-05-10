require('dotenv').config();

const express = require('serverless-express/express');
const bodyParser = require('body-parser');
const routes = require('./controllers/index');

const app = express();

app.use(bodyParser.json({ strict: false }));
app.use('/', routes);

module.exports = app;

