const express = require('express');
const router = express.Router();

// Posts routes
router.get('/', (req, res, next) => {
  res.send('post get');
});

router.get('/:uuid', (req, res, next) => {
  res.send('post get by uuid');
});

router.post('/', (req, res, next) => {
  res.send('create post');
});

router.put('/:uuid', (req, res, next) => {
  res.send('update post');
});

router.delete('/:uuid', (req, res) => {
  res.send('delete post');
});

module.exports = router;
