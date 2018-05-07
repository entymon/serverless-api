require('dotenv').config();

const express = require('express');
const CognitoExpress = require('cognito-express');

const {
  getUserByUuid,
  getUserByName
} = require('../models/user');

const router = express.Router();

router.get('/', function (req, res) {
  // res.send('Hello World!');
  res.json({
    region: process.env.AWS_REGION,
    userPoolId: process.env.COGNITO_USER_POOL_ID,
  });
});

// Initializing CognitoExpress constructor
const cognitoExpress = new CognitoExpress({
  region: process.env.AWS_REGION,
  cognitoUserPoolId: process.env.COGNITO_USER_POOL_ID,
  tokenUse: 'access',
  tokenExpiration: 3600000
});

// Our middleware that authenticates all APIs under our 'authenticatedRoute' Router
router.use(function (req, res, next) {

  //I'm passing in the access token in header under key accessToken
  const accessTokenFromClient = req.headers.accesstoken;

  //Fail if token not present in header.
  if (!accessTokenFromClient) return res.status(401).send('Access Token missing from header');

  cognitoExpress.validate(accessTokenFromClient, function (err, response) {

    //If API is not authenticated, Return 401 with error message.

    if (err) return res.status(401).send(err);

    //Else API has been authenticated. Proceed.
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
