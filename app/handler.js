const handler = require('serverless-express/handler');
const app = require('./server');

module.exports.app = handler(app);
