const dynamodb = require('../configs/dynamodb');

const AttributeTypes = [
  'B', 'BOOL', 'BS', 'L', 'M', 'N', 'NS', 'NULL', 'S', 'SS'
];

/**
 * Allowed attributes
 * @type {string[]}
 */
module.exports.attributeTypes = AttributeTypes;

/**
 * Create Table in DynamoDB with UUID primary key
 * @param name
 * @param sortKeyName
 * @param sortKeyType
 * @returns {Promise<any>}
 */
module.exports.createTable = (name, sortKeyName, sortKeyType) => {

  return new Promise((resolve, reject) => {
    if (!AttributeTypes.includes(sortKeyType)) {
      reject(new Error('sort type is not allowed'));
    } else {

      const params = {
        TableName: name,
        KeySchema: [
          { AttributeName: 'uuid', KeyType: 'HASH' },
          { AttributeName: sortKeyName, KeyType: 'RANGE' }  //Sort key
        ],
        AttributeDefinitions: [
          { AttributeName: 'uuid', AttributeType: 'S' },
          { AttributeName: sortKeyName, AttributeType: sortKeyType }
        ],
        ProvisionedThroughput: {
          ReadCapacityUnits: 10,
          WriteCapacityUnits: 10
        }
      };

      dynamodb.createTable(params, function (err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    }
  });
};

/**
 * Delete table in DynamoDB
 * @param name
 * @returns {Promise<any>}
 */
module.exports.deleteTable = (name) => {
  return new Promise((resolve, reject) => {
    const params = {
      TableName: name,
    };

    dynamodb.deleteTable(params, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

/**
 * Describes table in DynamoDB
 * @param name
 * @returns {Promise<any>}
 */
module.exports.describeTable = (name) => {
  return new Promise((resolve, reject) => {
    const params = {
      TableName: name,
    };

    dynamodb.describeTable(params, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};
