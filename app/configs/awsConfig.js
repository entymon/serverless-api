let config;
if (process.env.IS_OFFLINE === 'true') {
  config = {
    region: 'localhost',
    endpoint: 'http://localhost:8000',
    // accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    // secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    logger: console.log
  };
} else {
  config = {
    region: 'eu-west-1',
    endpoint: 'http://localhost:8000'
  };
}

module.exports = config;
