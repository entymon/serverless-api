const CognitoExpress = require('cognito-express');

const cognitoExpress = new CognitoExpress({
  region: process.env.COGNITO_AWS_REGION,
  cognitoUserPoolId: process.env.COGNITO_USER_POOL_ID,
  tokenUse: 'access',
  tokenExpiration: 3600000
});

module.exports = (req, res, next) => {
  const accessTokenFromClient = req.headers.accesstoken;

  if (!accessTokenFromClient) return res.status(401).send('Access Token missing from header');

  cognitoExpress.validate(accessTokenFromClient, function (err, response) {

    if (err) return res.status(401).send(err);

    res.locals.user = response;
    next();
  });
};
