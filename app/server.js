require('dotenv').config();

const express = require('serverless-express/express');
const bodyParser = require('body-parser');
const AWS = require('aws-sdk');
const routes = require('./controllers/index');

const dynamoDb = require('./services/dynamodb');

const app = express();


app.use(bodyParser.json({ strict: false }));

app.use('/', routes);


// Get User endpoint
app.get('/users/:userId', function (req, res) {
  const params = {
    TableName: USERS_TABLE,
    Key: {
      userId: req.params.uuid,
    },
  };

  dynamoDb.get(params, (error, result) => {
    if (error) {
      console.log(error);
      res.status(400).json({ error: 'Could not get user' });
    }
    if (result.Item) {
      const { uuid, name } = result.Item;
      res.json({ uuid, name });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  });
});

// Create User endpoints
app.post('/users', function (req, res) {
  const { userId, name } = req.body;
  if (typeof userId !== 'string') {
    res.status(400).json({ error: '"userId" must be a string' });
  } else if (typeof name !== 'string') {
    res.status(400).json({ error: '"name" must be a string' });
  }

  const params = {
    TableName: USERS_TABLE,
    Item: {
      userId: userId,
      name: name,
    },
  };

  dynamoDb.put(params, (error) => {
    if (error) {
      console.log(error);
      res.status(400).json({ error: 'Could not create user' });
    }
    res.json({ userId, name });
  });
});

module.exports = app;
