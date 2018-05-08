const AWS = require('aws-sdk');
const uuidv1 = require('uuid/v1');
const awsConfig = require('../configs/awsConfig');

const Table = 'posts';
const docClient = new AWS.DynamoDB.DocumentClient(awsConfig);

module.exports.createPost = async () => {
  const params = {
    TableName: Table,
    Item: {
      'uuid': uuidv1(),
      'title': 'test title',
      'content': 'lorem ipsum dolor semit and etc trlala cola cran',
      'info': {
        'plot': 'Nothing happens at all.',
        'rating': 0
      }
    }
  };

  console.log(params);
  return new Promise((resolve, reject) => {
    docClient.put(params, (err, data) => {
      if (err) {
        console.error('Unable to add item. Error JSON:', JSON.stringify(err, null, 2));
        reject(err);
      } else {
        console.log('Added item:', JSON.stringify(data, null, 2));
        resolve(JSON.stringify(data, null, 2));
      }
    });
  });
};

module.exports.updatePost = async (uuid) => {

};

module.exports.getAllPosts = async () => {

};

module.exports.getPostByUuid = async (uuid) => {

};

module.exports.deletePost = async (uuid) => {

};
