const express = require('express');
const router = express.Router();
const {
  createPost,
  getPostByUuid,
  getAllPosts
} = require('../models/post');

// Posts routes
router.get('/', (req, res, next) => {
  getAllPosts().then(data => res.json(data));
});

router.get('/:uuid', (req, res, next) => {
  getPostByUuid(req.params.uuid).then(data => res.json(data));
});

router.post('/', (req, res, next) => {

  console.log(req.body);
  // TODO: Add validation for each field etc
  const post = {
    title: 'test title my new post',
    content: 'lorem ipsum dolor semit and etc trlala cola cran',
    author: {
      uuid: 'sdassadasdwewe',
      name: 'Pawel',
    },
    categories: [
      'asdwewew', 'weweweerewr'
    ]
  };
  createPost(post).then(data => res.json(data));
});

router.put('/:uuid', (req, res, next) => {
  res.send('update post by uuid');
});

router.delete('/:uuid', (req, res) => {
  res.send('delete post');
});

module.exports = router;
