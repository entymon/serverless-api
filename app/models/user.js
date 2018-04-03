require('dotenv').config();
const AWS = require('aws-sdk');

const IS_OFFLINE = process.env.IS_OFFLINE;

let dynamoDb;
if (IS_OFFLINE === 'true') {
  dynamoDb = new AWS.DynamoDB.DocumentClient({
    region: 'localhost',
    endpoint: 'http://localhost:8000'
  });
} else {
  dynamoDb = new AWS.DynamoDB.DocumentClient();
}

const USERS_TABLE = process.env.USERS_TABLE;

module.exports.createUser = async (User) => {
  const params = {
    TableName: USERS_TABLE,
    Item: {
      uuid: User.uuid,
      name: User.name,
    },
  };

  // dynamoDb.put(params, (error, x) => {
  //   console.log(error, x, 'qweqwewe');
  // });
  return dynamoDb.put(params).promise();
};

module.exports.updateUser = async (uuid) => {

};

module.exports.getAllUsers = async () => {

};

module.exports.getUserByUuid = async (User) => {
  const params = {
    TableName: USERS_TABLE,
    Key: {
      uuid: User.uuid,
    },
  };
  return dynamoDb.get(params).promise();
};

module.exports.getUserByName = async (uuid) => {

};

module.exports.deleteUser = async (uuid) => {

};
