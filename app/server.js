const express = require('serverless-express/express');
const app = express();
require('dotenv').config();

app.get('/', function (req, res) {
  res.send('Hello World home!')
});

app.get('/norman/:id', function (req, res) {
  res.json({
    id: req.params.id
  });
});

app.get('/express', function (req, res) {
  res.send('Hello World help!')
});

app.get('/test', function (req, res) {
  res.send('Hello World test!')
});

module.exports = app;

