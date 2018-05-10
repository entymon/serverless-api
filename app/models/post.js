const AWS = require('aws-sdk');
const uuidv1 = require('uuid/v1');
const awsConfig = require('../configs/awsConfig');

const dbTable = 'posts';
const docClient = new AWS.DynamoDB.DocumentClient(awsConfig);

/**
 * Create Post
 * @param item
 * @returns {Promise<any>}
 */
module.exports.createPost = async (item) => {
  item.uuid = uuidv1();
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

/**
 * Update post
 * @param uuid
 * @returns {Promise<void>}
 */
module.exports.updatePost = async (uuid, item) => {
  const params = {
    TableName: dbTable,
    Item: item
  };

  return new Promise((resolve, reject) => {
    docClient.put(params, function(err, data) {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

/**
 * Get all posts
 * @returns {Promise<any>}
 */
module.exports.getAllPosts = async () => {
  const params = {
    TableName: dbTable
  };

  return new Promise((resolve, reject) => {
    docClient.scan(params, function (err, data) {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

/**
 * Get post by uuid
 * @param uuid
 * @returns {Promise<any>}
 */
module.exports.getPostByUuid = async (uuid) => {
  const params = {
    Key: {
      uuid: uuid
    },
    TableName: dbTable
  };
  return new Promise((resolve, reject) => {
    docClient.get(params, function (err, data) {
      if (err) {
        console.log(err, err.stack);
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

/**
 * Delete post
 * @param uuid
 * @returns {Promise<void>}
 */
module.exports.deletePost = async (uuid) => {
  const params = {
    TableName: dbTable,
    Key: {
      uuid: uuid
    }
  };

  return new Promise((resolve, reject) => {
    docClient.delete(params, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};
