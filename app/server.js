require('dotenv').config();

const express = require('serverless-express/express');
const bodyParser = require('body-parser');
const routes = require('./controllers/index');

const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  swaggerDefinition: {
    info: {
      title: 'Serverless API CMS',
      version: '1.0.0',
    },
  },
  apis: [routes],
};

// Initialize swagger-jsdoc -> returns validated swagger spec in json format
const swaggerSpec = swaggerJSDoc(options);

const app = express();

app.use(bodyParser.json({ strict: false }));

app.get('/api-docs.json', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.use('/', routes);

module.exports = app;

