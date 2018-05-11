const express = require('express');
const { signUp, getCredentials } = require('../services/CognitoIdentity');

const router = express.Router();

/**
 * helper
 */
router.get('/credentials', (req, res) => {
  getCredentials()
    .then(credentials => res.status(200).json(credentials));
});

router.get('/', (req, res) => {

});

router.get('/:username', (req, res) => {
  res.send('get user by username');
});

router.post('/', (req, res) => {
  res.send('create user');
});

module.exports = router;
