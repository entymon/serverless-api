const express = require('serverless-express/express');
const bodyParser = require('body-parser');
const AWS = require('aws-sdk');

const app = express();
const USERS_TABLE = process.env.USERS_TABLE;
require('dotenv').config();

const IS_OFFLINE = process.env.IS_OFFLINE;
let dynamoDb;
if (IS_OFFLINE === 'true') {
  dynamoDb = new AWS.DynamoDB.DocumentClient({
    region: 'localhost',
    endpoint: 'http://localhost:8000'
  });
  console.log(dynamoDb);
} else {
  dynamoDb = new AWS.DynamoDB.DocumentClient();
}

app.use(bodyParser.json({ strict: false }));

app.get('/', function (req, res) {
  res.send('Hello World home!');
});

app.get('/norman/:id', function (req, res) {
  res.json({
    id: req.params.id
  });
});

app.get('/express', function (req, res) {
  res.send('Hello World help!');
});

app.get('/test', function (req, res) {
  res.send('Hello World test!');
});


// Get User endpoint
app.get('/users/:userId', function (req, res) {
  const params = {
    TableName: USERS_TABLE,
    Key: {
      userId: req.params.userId,
    },
  };

  dynamoDb.get(params, (error, result) => {
    if (error) {
      console.log(error);
      res.status(400).json({ error: 'Could not get user' });
    }
    if (result.Item) {
      const { userId, name } = result.Item;
      res.json({ userId, name });
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
