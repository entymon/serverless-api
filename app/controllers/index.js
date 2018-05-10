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
    './app/documentation/models.yml',
  ],
});

const router = express.Router();

router.get('/', function (req, res) {
  res.send('Hello World!');
});

if (process.env.COGNITO_AUTHORIZATION === true) {
  router.use(cognitoAuth);
}

router.use('/posts', require('./post'));
router.use('/users', require('./user'));

// Define your routes that need authentication check
router.get('/test', function (req, res, next) {
  res.send(`Hi ${res.locals.user.username}, your API call is authenticated!`);
});

router.get('/swagger.json', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

router.all('*', async (req, res, next) => {
  res.send('End of the world');
});

module.exports = router;


//
// {
//   "name": "TokenExpiredError",
//   "message": "jwt expired",
//   "expiredAt": "2018-05-07T20:53:15.000Z"
// }
