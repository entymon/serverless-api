const AWS = require('aws-sdk');

/**
 * Global configuration
 */
new AWS.Config({
  apiVersion: '2018-05-11',
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  logger: console.log
});

module.exports.AWS = AWS;

/**
 * Cognito Configuration
 */
const cognitoConfig = {
  UserPoolId: process.env.COGNITO_USER_POOL_ID,
  ClientId: process.env.COGNITO_USER_POOL_CLIENT_ID,
};

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

