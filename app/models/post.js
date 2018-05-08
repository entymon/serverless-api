const AWS = require('aws-sdk');
const uuidv1 = require('uuid/v1');
const awsConfig = require('../configs/awsConfig');

const dbTable = 'posts';
const docClient = new AWS.DynamoDB.DocumentClient(awsConfig);

module.exports.createPost = async () => {
  const item = {
    'uuid': uuidv1(),
    'title': 'test title',
    'content': 'lorem ipsum dolor semit and etc trlala cola cran',
    'info': {
      'plot': 'Nothing happens at all.',
      'rating': 0
    }
  };
  const params = {
    TableName: dbTable,
    Item: item
  };

  return new Promise((resolve, reject) => {
    docClient.put(params, (err, data) => {
      if (err) {
        console.error('Unable to add item. Error JSON:', JSON.stringify(err, null, 2));
        reject(JSON.stringify(err, null, 2));
      } else {
        resolve(item);
      }
    });
  });

};

module.exports.updatePost = async (uuid) => {

};

module.exports.getAllPosts = async () => {

};

module.exports.getPostByUuid = async (uuid) => {
  const params = {
    Key: {
      'uuid': {
        S: uuid
      }
    },
    TableName: dbTable
  };
  dynamodb.getItem(params, function (err, data) {
    if (err) console.log(err, err.stack);
    else console.log(data);
  });
};

module.exports.deletePost = async (uuid) => {

};
