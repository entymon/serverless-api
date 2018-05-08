const express = require('express');
const router = express.Router();
const {
  createPost
} = require('../models/post');

// Posts routes
router.get('/', (req, res, next) => {
  // get posts
});

router.get('/:uuid', (req, res, next) => {
  res.send('post get by uuid');
});

router.post('/', (req, res, next) => {
  createPost().then(data => res.send(data));

});

router.put('/:uuid', (req, res, next) => {
  res.send('update post');
});

router.delete('/:uuid', (req, res) => {
  res.send('delete post');
});

module.exports = router;
