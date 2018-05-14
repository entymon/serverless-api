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
module.exports.cognitoConfig = {
  IdentityPoolId: process.env.COGNITO_IDENTITY_POOL_ID,
  UserPoolId: process.env.COGNITO_USER_POOL_ID,
  ClientId: process.env.COGNITO_USER_POOL_CLIENT_ID,
};

/**
 * DynamoDB Configuration
 */
let dynamoDBConfig;
if (parseInt(process.env.IS_OFFLINE)) {
  dynamoDBConfig = {
    region: 'localhost',
    endpoint: 'http://localhost:8000',
  };
} else {
  dynamoDBConfig = {
    region: process.env._AWS_REGION,
    endpoint: 'http://localhost:8000'
  };
}
module.exports.documentClient = new AWS.DynamoDB.DocumentClient(dynamoDBConfig);

