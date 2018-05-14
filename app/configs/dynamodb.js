const AWS = require('aws-sdk');
const config = new AWS.Config();

if (parseInt(process.env.IS_OFFLINE)) {
  config.update({
    region: 'localhost',
    endpoint: 'http://localhost:8000',
  });
} else {
  config.update({
    region: process.env._AWS_REGION,
    endpoint: process.env.DYNAMO_DB_HOST,
  });
}
const dynamoDB = new AWS.DynamoDB(config);
module.exports = dynamoDB;
