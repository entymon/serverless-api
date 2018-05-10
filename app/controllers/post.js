const express = require('express');
const { validateBody, presence, isArray } = require('property-validator');
const router = express.Router();
const {
  createPost,
  getPostByUuid,
  getAllPosts
} = require('../models/post');

/**
 * @swagger
 * /posts:
 *   get:
 *    description: Get all posts
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: Returns all posts
 *        schema:
 *          type: array
 *          items:
 *            $ref: "#/definitions/Post"
 *      default:
 *        description: API error
 *        schema:
 *          $ref: '#/definitions/ErrorModel'
 */
router.get('/', (req, res, next) => {
  getAllPosts().then(data => res.json(data));
});

/**
 * @swagger
 * /posts/{uuid}:
 *  get:
 *    description: Get post by uuid
 *    produces:
 *      - application/json
 *    parameters:
 *      - in: 'path'
 *        name: 'uuid'
 *        description: 'Identity of post'
 *        required: true
 *        type: 'string'
 *    responses:
 *      200:
 *        description: Returns post
 *        schema:
 *          $ref: "#/definitions/Post"
 *      default:
 *        description: API error
 *        schema:
 *          $ref: '#/definitions/ErrorModel'
 */
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
 *      default:
 *        description: API error
 *        schema:
 *          $ref: '#/definitions/ErrorModel'
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
    createPost(req.body)
      .then(data => res.json(data));
  } else {
    res.status(422).send({ errors: validation.errors });
  }
});

/**
 * @swagger
 * /posts/{uuid}:
 *   put:
 *    description: Update post
 *    produces:
 *      - application/json
 *    parameters:
 *      - in: 'path'
 *        name: 'uuid'
 *        description: 'Identity of post'
 *        required: true
 *        type: 'string'
 *      - in: 'body'
 *        name: 'body'
 *        description: 'Post data for update'
 *        required: true
 *        schema:
 *          $ref: '#/definitions/Post'
 *    responses:
 *      200:
 *        description: updated post object
 *        schema:
 *          $ref: "#/definitions/Post"
 *      default:
 *        description: API error
 *        schema:
 *          $ref: '#/definitions/ErrorModel'
 */
router.put('/:uuid', (req, res, next) => {
  res.send('update post by uuid');
});

/**
 * @swagger
 * /posts/{uuid}:
 *   delete:
 *    description: Delete post by uuid
 *    produces:
 *      - application/json
 *    parameters:
 *      - in: 'path'
 *        name: 'uuid'
 *        description: 'Identity of post'
 *        required: true
 *        type: 'string'
 *    responses:
 *      200:
 *        description: empty response
 *      default:
 *        description: API error
 *        schema:
 *          $ref: '#/definitions/ErrorModel'
 */
router.delete('/:uuid', (req, res) => {
  res.send('delete post');
});

module.exports = router;
