require('dotenv').config();

const express = require('express');
const CognitoExpress = require('cognito-express');

const cognitoExpress = new CognitoExpress({
  region: process.env.COGNITO_AWS_REGION,
  cognitoUserPoolId: process.env.COGNITO_USER_POOL_ID,
  tokenUse: 'access',
  tokenExpiration: 3600000
});

const {
  getUserByUuid,
  getUserByName
} = require('../models/user');

const router = express.Router();

router.get('/', function (req, res) {
  res.send('Hello World!');
});


router.use(function (req, res, next) {

  const accessTokenFromClient = req.headers.accesstoken;

  if (!accessTokenFromClient) return res.status(401).send('Access Token missing from header');

  cognitoExpress.validate(accessTokenFromClient, function (err, response) {

    if (err) return res.status(401).send(err);

    res.locals.user = response;
    next();
  });
});

router.use('/posts', require('./post'));
router.use('/users', require('./user'));

// Define your routes that need authentication check
router.get('/test', function (req, res, next) {
  res.send(`Hi ${res.locals.user.username}, your API call is authenticated!`);
});

router.all('*', async (request, response, next) => {

});

module.exports = router;


//
// {
//   "name": "TokenExpiredError",
//   "message": "jwt expired",
//   "expiredAt": "2018-05-07T20:53:15.000Z"
// }
