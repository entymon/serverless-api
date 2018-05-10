const express = require('express');
const { validateBody, presence, isArray } = require('property-validator');
const router = express.Router();
const {
  createPost,
  getPostByUuid,
  getAllPosts
} = require('../models/post');

router.get('/', (req, res, next) => {
  getAllPosts().then(data => res.json(data));
});

router.get('/:uuid', (req, res, next) => {
  getPostByUuid(req.params.uuid).then(data => res.json(data));
});

/**
 * @swagger
 * /posts:
 *   post:
 *    description: Create new post in DynamoDB
 *    produces:
 *      - application/json
 *    parameters:
 *      - in: 'body'
 *        name: 'body'
 *        description: 'Create Post'
 *        required: true
 *        schema:
 *          $ref: '#/definitions/PostCreate'
 *    responses:
 *      201:
 *        description: created post object
 *        schema:
 *          $ref: "#/definitions/Post"
 *
 */
router.post('/', (req, res, next) => {

  const validation = validateBody(req, [
    presence('title'),
    presence('content'),
    presence('author.uuid'),
    presence('author.username'),
    presence('categories'),
    isArray('categories')
  ]);

  if (validation.valid) {
    res.status(200).send('Welcome!');
    createPost(req.body)
      .then(data => res.json({
        status: 200,
        message: 'post was added',
        body: data
      }));
  } else {
    res.status(422).send({ errors: validation.errors });
  }
});

router.put('/:uuid', (req, res, next) => {
  res.send('update post by uuid');
});

router.delete('/:uuid', (req, res) => {
  res.send('delete post');
});

module.exports = router;
