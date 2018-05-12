require('dotenv').config();

const express = require('express');
const swaggerJSDoc = require('swagger-jsdoc');
const cognitoAuth = require('../middlewares/cognitoAuth');

const swaggerSpec = swaggerJSDoc({
  swaggerDefinition: {
    info: {
      title: 'Serverless API CMS',
      version: '1.0.0',
    },
  },
  apis: [
    './app/controllers/*',
    './app/documentation/security.yml',
    './app/documentation/cognito.yml',
    './app/documentation/errors.yml',
    './app/documentation/models.yml',
  ],
});

const router = express.Router();

router.get('/', function (req, res) {
  res.send('Hello World!');
});

const { describeTable } = require('../services/DynamoDB');
router.get('/test', function (req, res) {
  describeTable('posts')
    .then(data => res.json(data))
    .catch(error => {
      res.json(error);
    });
});

if (process.env.COGNITO_AUTHORIZATION === true) {
  router.use(cognitoAuth);
}

router.use('/admin', require('./admin'));
router.use('/posts', require('./post'));
router.use('/users', require('./user'));

/**
 * @swagger
 * /documentation.json:
 *   get:
 *    description: Create new post in DynamoDB
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: swagger 2.0 documentation
 */
router.get('/documentation.json', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

router.all('*', async (req, res, next) => {
  res.send('Route does not exist. End of the world');
});

module.exports = router;
