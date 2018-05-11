const express = require('express');
const { getCredentials, adminCreateUser, listUsers } = require('../services/CognitoIdentity');

const router = express.Router();

/**
 * helper
 */
router.get('/credentials', (req, res) => {
  getCredentials()
    .then(credentials => res.status(200).json(credentials));
});

router.get('/', (req, res) => {
  adminCreateUser();
  res.send('something');
});

router.get('/:username', (req, res) => {
  res.send('get user by username');
});

router.post('/', (req, res) => {
  res.send('create user');
});

module.exports = router;
