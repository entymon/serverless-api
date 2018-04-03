require('dotenv').config();
const AWS = require('aws-sdk');

const IS_OFFLINE = process.env.IS_OFFLINE;
const USERS_TABLE = process.env.USERS_TABLE;

let dynamoDb;
if (IS_OFFLINE === 'true') {
  dynamoDb = new AWS.DynamoDB.DocumentClient({
    region: 'localhost',
    endpoint: 'http://localhost:8000'
  });
  console.log(dynamoDb);
} else {
  dynamoDb = new AWS.DynamoDB.DocumentClient();
}

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
      uuid: User.uuid
    }
  };
  return new Promise((resolve, reject) => {
    dynamoDb.get(params).promise()
      .catch(error => {
        console.log(error, 'user model level');
        reject({ error: 'Could not get user' });
      })
      .then(result => {
        if (result.Item) {
          const { uuid, name } = result.Item;
          resolve({ uuid, name });
        } else {
          reject({ error: 'User not found' });
        }
      });
  });
};

module.exports.getUserByName = async (uuid) => {

};

module.exports.deleteUser = async (uuid) => {

};
