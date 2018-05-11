const express = require('express');
const {
  validateBody, presence
} = require('property-validator');
const { getCredentials, adminCreateUser } = require('../services/CognitoIdentity');
const { COGNITO_ERROR, VALIDATION_ERROR } = require('../configs/constants');

const router = express.Router();

/**
 * Gets credentials to cognito
 * TODO: Try to find out what is this!
 */
router.get('/credentials', (req, res) => {
  getCredentials()
    .then(credentials => res.status(200).json(credentials))
    .catch(error => res.status(500).json({
      message: COGNITO_ERROR,
      body: error
    }));
});


/**
 * @swagger
 * /admin/create-user:
 *   post:
 *    description: Create admin user
 *    produces:
 *      - application/json
 *    parameters:
 *      - in: 'body'
 *        name: 'body'
 *        description: 'Create admin user'
 *        required: true
 *        schema:
 *          $ref: '#/definitions/AdminUser'
 *    responses:
 *      200:
 *        description: created user
 *        schema:
 *          $ref: "#/definitions/CognitoUser"
 *      401:
 *        description: authorization error
 *        schema:
 *          $ref: "#/definitions/401_ErrorModel"
 *      422:
 *        description: validation error
 *        schema:
 *          $ref: "#/definitions/422_ErrorModel"
 *      default:
 *        description: API error
 *        schema:
 *          $ref: '#/definitions/ErrorModel'
 */
router.post('/create-user', (req, res) => {

  const validation = validateBody(req, [
    presence('username'),
    presence('password'),
    presence('email')
  ]);

  if (validation.valid) {
    const data = req.body;
    adminCreateUser(data.username, data.email, data.password)
      .then(data => res.status(200).json(data))
      .catch(error => res.status(500).json({
        message: COGNITO_ERROR,
        body: error
      }));
  } else {
    res.status(422).send({
      message: VALIDATION_ERROR,
      body: validation.errors
    });
  }
});

module.exports = router;
