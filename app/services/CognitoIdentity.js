const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const { AWS } = require('../configs/awsConfig');

const cognitoConfig = {
  IdentityPoolId: process.env.COGNITO_IDENTITY_POOL_ID,
  UserPoolId: process.env.COGNITO_USER_POOL_ID,
  ClientId: process.env.COGNITO_USER_POOL_CLIENT_ID,
};

/**
 * Get Credentials
 * @returns {Promise<any>}
 */
module.exports.getCredentials = () => {
  AWS.config.credentials = new AWS.CognitoIdentityCredentials(cognitoConfig);

  return new Promise((resolve) => {
    AWS.config.credentials.get(() => {
      resolve({
        accessKeyId: AWS.config.credentials.accessKeyId,
        secretAccessKey: AWS.config.credentials.secretAccessKey,
        sessionToken: AWS.config.credentials.sessionToken,
        identityId: AWS.config.credentials.identityId,
      });
    });
  });
};

/**
 * Sign Up
 * @param user
 * @returns {Promise<any>}
 */
module.exports.signUp = (user) => {
  const userPool = new AmazonCognitoIdentity.CognitoUserPool(cognitoConfig);
  const attributeList = [];

  const dataEmail = {
    Name: 'email',
    Value: user.email
  };

  const attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);
  attributeList.push(attributeEmail);

  return new Promise((resolve, reject) => {
    userPool.signUp(user.username, user.password, attributeList, null, function (err, result) {
      if (err) {
        reject(err);
      } else {
        const cognitoUser = result.user;
        resolve(cognitoUser);
      }
    });
  });
};
