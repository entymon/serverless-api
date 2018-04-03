const express = require('express');
const { getUserByUuid, createUser } = require('../models/user');

const router = express.Router();

router.get('/', (req, res) => {
  res.send('user get');
});

router.get('/:uuid', (req, res) => {

  getUserByUuid({ uuid: req.params.uuid })
    .catch(error => {
      console.log(error);
      res.status(400).json(error);
    })
    .then(result => {
      res.json(result);
    });
});

router.post('/', (req, res) => {

  const { uuid, name } = req.body;
  if (typeof uuid !== 'string') {
    res.status(400).json({ error: '"uuid" must be a string' });
  } else if (typeof name !== 'string') {
    res.status(400).json({ error: '"name" must be a string' });
  }

  createUser({ uuid, name })
    .catch(error => {
      console.log(error);
      res.status(400).json(error);
    })
    .then(() => {
      res.json({ uuid, name });
    });
});

module.exports = router;
