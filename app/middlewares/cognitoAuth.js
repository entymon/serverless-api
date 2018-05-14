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
      details: {}
    });
  }

  cognitoExpress.validate(accessTokenFromClient, function (err, response) {

    if (err) {
      const responseModel = {
        details: '',
        body: err
      };
      if (err.name === TOKEN_EXPIRED) {
        responseModel.details = 'access token expired';
      }
      return res.status(401).json(responseModel);
    }

    res.locals.user = response;
    next();
  });
};
