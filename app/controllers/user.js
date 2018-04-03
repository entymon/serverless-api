const express = require('express');
const { getUserByUuid, createUser } = require('../models/user');

//========== configuration
const AWS = require('aws-sdk');
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

const USERS_TABLE = process.env.USERS_TABLE;
//============ configuration

const router = express.Router();

router.get('/', (req, res) => {
  res.send('user get');
});

router.get('/:uuid', (req, res) => {

  console.log(req.params.uuid, 'qweqwewqeqweWEWQQWQWE');
  const params = {
    TableName: USERS_TABLE,
    Key: {
      uuid: req.params.uuid
    }
  };

  dynamoDb.get(params).promise()
    .catch(error => {
      console.log(error);
      res.status(400).json({ error: 'Could not get user' });
    })
    .then(result => {
      if (result.Item) {
        const { uuid, name } = result.Item;
        res.json({ uuid, name });
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    });
});

router.post('/', (req, res) => {

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
      name: name
    }
  };

  dynamoDb.put(params, (error) => {
    if (error) {
      console.log(error);
      res.status(400).json({ error: 'Could not create user' });
    }
    res.json({ uuid, name });
  });
});

module.exports = router;
