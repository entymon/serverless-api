const express = require('express');
const {
  validateBody, presence, isArray,
  validateParams, isLength
} = require('property-validator');
const router = express.Router();
const {
  createPost,
  getPostByUuid,
  getAllPosts,
  deletePost,
  updatePost
} = require('../models/post');
const { DYNAMO_DB_ERROR, VALIDATION_ERROR } = require('../configs/constants');

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
 *          type: object
 *          schema:
 *            $ref: "#/definitions/DynamoDBScan"
 *      401:
 *        description: authorization error
 *        schema:
 *          $ref: "#/definitions/401_ErrorModel"
 *      default:
 *        description: API error
 *        schema:
 *          $ref: '#/definitions/ErrorModel'
 */
router.get('/', (req, res) => {
  getAllPosts().then((data) => {
    delete data.ScannedCount;
    res.status(200).json(data);
  });
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
 *      401:
 *        description: authorization error
 *        schema:
 *          $ref: "#/definitions/401_ErrorModel"
 *      422:
 *        description: validation error
 *        schema:
 *          $ref: "#/definitions/422_ErrorModel"
 *      default:
 *        description: API error
 *        schema:
 *          $ref: '#/definitions/ErrorModel'
 */
router.get('/:uuid', (req, res) => {
  const validation = validateParams(req, [
    presence('uuid'),
    isLength('uuid', { min: 34 }),
  ]);

  if (validation.valid) {
    getPostByUuid(req.params.uuid)
      .then(data => res.status(200).json(data));
  } else {
    res.status(422).send({
      message: VALIDATION_ERROR,
      body: validation.errors
    });
  }
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
 *      401:
 *        description: authorization error
 *        schema:
 *          $ref: "#/definitions/401_ErrorModel"
 *      422:
 *        description: validation error
 *        schema:
 *          $ref: "#/definitions/422_ErrorModel"
 *      default:
 *        description: API error
 *        schema:
 *          $ref: '#/definitions/ErrorModel'
 */
router.post('/', (req, res) => {

  const validation = validateBody(req, [
    presence('title'),
    presence('excerpt'),
    presence('content'),
    presence('author.uuid'),
    presence('author.username'),
    presence('categories'),
    isArray('categories')
  ]);

  if (validation.valid) {
    createPost(req.body)
      .then(data => res.status(201).json(data));
  } else {
    res.status(422).send({
      message: VALIDATION_ERROR,
      body: validation.errors
    });
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
 *      401:
 *        description: authorization error
 *        schema:
 *          $ref: "#/definitions/401_ErrorModel"
 *      422:
 *        description: validation error
 *        schema:
 *          $ref: "#/definitions/422_ErrorModel"
 *      default:
 *        description: API error
 *        schema:
 *          $ref: '#/definitions/ErrorModel'
 */
router.put('/:uuid', (req, res) => {

  const validBody = validateBody(req, [
    presence('uuid'),
    isLength('uuid', { min: 34 }),
    presence('title'),
    presence('excerpt'),
    presence('content'),
    presence('author.uuid'),
    presence('author.username'),
    presence('categories'),
    isArray('categories')
  ]);

  const validParam = validateParams(req, [
    presence('uuid'),
    isLength('uuid', { min: 34 }),
  ]);

  if (validBody.valid && validParam.valid) {
    updatePost(req.params.uuid, req.body)
      .then(() => {
        res.status(200)
          .json(req.body);
      })
      .catch(error => {
        delete error[error.code];
        res.status(200).json({
          message: DYNAMO_DB_ERROR,
          body: error
        });
      });
  } else {
    const error = validBody.errors.concat(validParam.errors);
    res.status(422).send({
      message: VALIDATION_ERROR,
      body: error
    });
  }
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
 *        description: success - element was deleted
 *      401:
 *        description: authorization error
 *        schema:
 *          $ref: "#/definitions/401_ErrorModel"
 *      422:
 *        description: validation error
 *        schema:
 *          $ref: "#/definitions/422_ErrorModel"
 *      503:
 *        description: unique database error
 *        schema:
 *          $ref: "#/definitions/503_DB_ErrorModel"
 *      default:
 *        description: API error
 *        schema:
 *          $ref: '#/definitions/ErrorModel'
 */
router.delete('/:uuid', (req, res) => {

  const validation = validateParams(req, [
    presence('uuid'),
    isLength('uuid', { min: 34 }),
  ]);

  if (validation.valid) {
    deletePost(req.params.uuid)
      .then(() => res.json({}))
      .catch(error => {
        delete error[error.code];
        res.status(200).json({
          message: DYNAMO_DB_ERROR,
          body: error
        });
      });
  } else {
    res.status(422).send({
      message: VALIDATION_ERROR,
      body: validation.errors
    });
  }
});

module.exports = router;
