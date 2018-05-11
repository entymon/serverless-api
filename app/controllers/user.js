const express = require('express');
const { signUp } = require('../services/CognitoIdentity');

const router = express.Router();

router.get('/', (req, res) => {
  signUp();
  res.send('user get');
});

router.get('/:username', (req, res) => {
  res.send('get user by username');
});

router.post('/', (req, res) => {
  res.send('create user');
});

module.exports = router;
