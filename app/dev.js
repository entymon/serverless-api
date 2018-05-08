require('dotenv').config();

const express = require('serverless-express/express');
const bodyParser = require('body-parser');
const routes = require('./controllers/index');

const app = express();

app.use(bodyParser.json({ strict: false }));
app.use('/', routes);

app.listen(4000, () => console.log('Example app listening on port 4000!'));
