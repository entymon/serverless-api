const express = require('express');
const { getUserByUuid, createUser } = require('../models/user');

const router = express.Router();

router.get('/', (req, res) => {
  res.send('user get');
});

router.get('/:username', (req, res) => {
  res.send('get user by username');
});

router.post('/', (req, res) => {
  res.send('create user');
});

module.exports = router;
