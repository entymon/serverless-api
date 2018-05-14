const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const { AWS, cognitoConfig } = require('../configs/awsConfig');

const provider = new AWS.CognitoIdentityServiceProvider({
  region: process.env._AWS_REGION
});

/**
 * Sign Up (does noe work for my current user pool TODO: create new with option to register)
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

/**
 * Gets user data
 * @param accessToken
 * @returns {Promise<any>}
 */
module.exports.getUserProfile = (accessToken) => {
  const params = {
    AccessToken: accessToken
  };

  return new Promise((resolve, reject) => {
    provider.getUser(params, function (err, data) {
      if (err) reject(err);
      else resolve(data);
    });
  });
};

/**
 * Updates user attributes
 * @param accessToken
 * @param UserAttributes
 * @returns {Promise<any>}
 */
module.exports.updateAttribute = (accessToken, UserAttributes) => {

  const params = {
    AccessToken: accessToken,
    UserAttributes
  };

  return new Promise((resolve, reject) => {
    provider.updateUserAttributes(params, function (err, data) {
      if (err) reject(err);
      else resolve(data);
    });
  });
};

/**
 * Get list of added users
 * @returns {Promise<any>}
 */
module.exports.listUsers = () => {
  const params = {
    UserPoolId: process.env.COGNITO_USER_POOL_ID
  };

  return new Promise((resolve, reject) => {
    provider.listUsers(params, function (err, data) {
      if (err) reject(err);
      else resolve(data);
    });
  });
};

/**
 * Get Credentials
 * @returns {Promise<any>}
 */
module.exports.getCredentials = () => {

  AWS.config.region = process.env._AWS_REGION;
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: process.env.COGNITO_IDENTITY_POOL_ID
  });

  return new Promise((resolve) => {
    AWS.config.credentials.get(() => {
      resolve({
        accessKeyId: AWS.config.credentials.accessKeyId,
        secretAccessKey: AWS.config.credentials.secretAccessKey,
        sessionToken: AWS.config.credentials.sessionToken,
        identityId: AWS.config.credentials.identityId
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
module.exports.adminCreateUser =
  (username, email, temporaryPassword, resend = false) => {
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

/**
 * Authorize user and get tokens
 * @param username
 * @param password
 * @returns {Promise<any>}
 */
module.exports.signIn = (username, password) => {
  // AWS.config.credentials.get();
  const authenticationData = {
    Username: username,
    Password: password,
  };
  const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
  const poolData = {
    UserPoolId: process.env.COGNITO_USER_POOL_ID,
    ClientId: process.env.COGNITO_USER_POOL_CLIENT_ID
  };
  const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
  const userData = {
    Username: username,
    Pool: userPool
  };
  const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

  return new Promise((resolve, reject) => {
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function (result) {
        resolve({
          idToken: result.getIdToken().getJwtToken(),
          refreshToken: result.getRefreshToken().getToken(),
          accessToken: result.getAccessToken().getJwtToken(),
        });
      },
      onFailure: function(err) {
        reject(err);
      },
    });
  });
};


