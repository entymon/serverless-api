const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const { AWS, cognitoConfig } = require('../configs/awsConfig');

const provider = new AWS.CognitoIdentityServiceProvider({
  region: process.env._AWS_REGION
});



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

module.exports.listUsers = () => {
  const params = {
    UserPoolId: process.env.COGNITO_USER_POOL_ID
  };

  provider.listUsers(params, function (err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
  });
};

/**
 * Get Credentials
 * @returns {Promise<any>}
 */
module.exports.getCredentials = () => {

  AWS.config.region = process.env._AWS_REGION;
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: process.env.COGNITO_IDENTITY_POOL_ID,
  });

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
 * Create new user - no auth
 * @param username
 * @param email
 * @param temporaryPassword
 * @param resend
 * @returns {Promise<any>}
 */
module.exports.adminCreateUser = (
  username,
  email,
  temporaryPassword,
  resend = false
) => {
  let mode = 'SUPPRESS';
  if (resend) mode = 'RESEND';

  const params = {
    DesiredDeliveryMediums: ['EMAIL'],
    ForceAliasCreation: true,
    MessageAction: mode,
    TemporaryPassword: temporaryPassword,
    UserAttributes: [
      {
        Name: 'email',
        Value: email
      }
    ],
    Username: username,
    UserPoolId: process.env.COGNITO_USER_POOL_ID
  };

  return new Promise((resolve, reject) => {
    provider.adminCreateUser(params, function (err, data) {
      if (err) reject(err);
      else resolve(data);
    });
  });
};


