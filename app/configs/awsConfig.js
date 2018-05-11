const AWS = require('aws-sdk');

/**
 * Global configuration
 */
const globalConfiguration = {
  apiVersion: '2018-05-11',
  region: process.env._AWS_REGION,
  accessKeyId: process.env._AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env._AWS_SECRET_ACCESS_KEY,
  logger: console.log
};

new AWS.Config(globalConfiguration);
module.exports.AWS = AWS;

/**
 * Cognito Configuration
 */
// const cognitoConfig = {
//   IdentityPoolId: process.env.COGNITO_IDENTITY_POOL_ID,
//   UserPoolId: process.env.COGNITO_USER_POOL_ID,
//   ClientId: process.env.COGNITO_USER_POOL_CLIENT_ID,
// };
//
// const cognitoCredentials = new AWS.CognitoIdentityCredentials(cognitoConfig);
// AWS.config.update({
//   credentials: cognitoCredentials
// });
//
// module.exports.Cognito = cognitoCredentials;

/**
 * DynamoDB Configuration
 */
let dynamoDBConfig;
if (process.env.IS_OFFLINE === 'true') {
  dynamoDBConfig = {
    region: 'localhost',
    endpoint: 'http://localhost:8000',
  };
} else {
  dynamoDBConfig = {
    region: 'eu-west-1',
    endpoint: 'http://localhost:8000'
  };
}
module.exports.documentClient = new AWS.DynamoDB.DocumentClient(dynamoDBConfig);

