const CognitoExpress = require('cognito-express');
const { TOKEN_EXPIRED } = require('../configs/constants');

const cognitoExpress = new CognitoExpress({
  region: process.env.COGNITO_AWS_REGION,
  cognitoUserPoolId: process.env.COGNITO_USER_POOL_ID,
  tokenUse: 'access',
  tokenExpiration: 3600000
});

module.exports = (req, res, next) => {
  const accessTokenFromClient = req.headers.accesstoken;

  if (!accessTokenFromClient) {
    return res.status(401).json({
      message: 'access token missing from header',
      body: {}
    });
  }

  cognitoExpress.validate(accessTokenFromClient, function (err, response) {

    if (err) {
      const responseModel = {
        message: '',
        body: err
      };
      if (err.name === TOKEN_EXPIRED) {
        responseModel.message = 'access token expired';
      }
      return res.status(401).json(responseModel);
    }

    res.locals.user = response;
    next();
  });
};
