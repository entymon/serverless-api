const handler = require('serverless-express/handler');
const app = require('./app/server');

module.exports.app = handler(app);
