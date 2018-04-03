const express = require('express');
const { getUserByUuid, createUser } = require('../models/user');

const router = express.Router();

router.get('/', (req, res) => {
  res.send('user get');
});

router.get('/:uuid', (req, res) => {

  const User = {
    uuid: uuid
  };

  getUserByUuid(User).then((error, result) => {
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

router.post('/', (req, res) => {

  const { uuid, name } = req.body;
  if (typeof uuid !== 'string') {
    res.status(400).json({ error: '"uuid" must be a string' });
  } else if (typeof name !== 'string') {
    res.status(400).json({ error: '"name" must be a string' });
  }

  const User = {
    uuid: uuid,
    name: name
  };
  createUser(User)
    .catch((error) => {
      console.log(error, 'dynamoDB error');
    })
    .then((error) => {
      if (error) {
        console.log(error);
        res.status(400).json({ error: 'Could not create user' });
      }
      res.json(User);
    });
});

module.exports = router;
