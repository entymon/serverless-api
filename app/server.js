require('dotenv').config();

const express = require('serverless-express/express');
const bodyParser = require('body-parser');
const routes = require('./controllers/index');
const AWS = require('aws-sdk');

const app = express();

app.use(bodyParser.json({ strict: false }));

app.use('/', routes);

const IS_OFFLINE = process.env.IS_OFFLINE;

let dynamoDb;
if (IS_OFFLINE === 'true') {
  dynamoDb = new AWS.DynamoDB.DocumentClient({
    region: 'localhost',
    endpoint: 'http://localhost:8000'
  });
  console.log(dynamoDb, 'dynamoDb');
} else {
  dynamoDb = new AWS.DynamoDB.DocumentClient();
}

const USERS_TABLE = process.env.USERS_TABLE;


// Get User endpoint
app.get('/test/:userId', function (req, res) {
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
app.post('/test', function (req, res) {
  const { uuid, name } = req.body;
  if (typeof uuid !== 'string') {
    res.status(400).json({ error: '"uuid" must be a string' });
  } else if (typeof name !== 'string') {
    res.status(400).json({ error: '"name" must be a string' });
  }

  const params = {
    TableName: USERS_TABLE,
    Item: {
      uuid: uuid,
      name: name,
    },
  };

  dynamoDb.put(params, (error) => {
    if (error) {
      console.log(error);
      res.status(400).json({ error: 'Could not create user' });
    }
    res.json({ uuid, name });
  });
});

module.exports = app;
