const express = require('express');
const { signUp, test } = require('../services/CognitoIdentity');

const router = express.Router();

router.get('/', (req, res) => {
  test();
  // signUp();
  res.send('user get');
});

router.get('/:username', (req, res) => {
  res.send('get user by username');
});

router.post('/', (req, res) => {
  res.send('create user');
});

module.exports = router;
