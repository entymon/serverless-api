const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.send('user get');
});

router.get('/:uuid', (req, res) => {
  res.send('user get by uuid');
});

router.post('/', (req, res) => {
  res.send('user post');
});

module.exports = router;
