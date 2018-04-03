const dynamoDb = require('../services/dynamodb');

module.exports.createUser = async () => {

};

module.exports.updateUser = async (uuid) => {

};

module.exports.getAllUsers = async () => {

};

module.exports.getUserByUuid = async (uuid) => {
  const params = {
    TableName: USERS_TABLE,
    Key: {
      uuid: uuid,
    },
  };

  dynamoDb.get(params, (error, result) => {
    if (error) {
      console.log(error);
      res.status(400).json({ error: 'Could not get user' });
    }
    if (result.Item) {
      const { uuid, name } = result.Item;
      res.json({ uuid, name });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  });
};

module.exports.getUserByName = async (uuid) => {

};

module.exports.deleteUser = async (uuid) => {

};
