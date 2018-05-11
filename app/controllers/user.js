const express = require('express');
const {
  validateBody, presence
} = require('property-validator');
const { getUserProfile, updateAttribute } = require('../services/CognitoIdentity');
const { listAttributes } = require('../services/CognitoData');
const { COGNITO_ERROR, VALIDATION_ERROR } = require('../configs/constants');

const router = express.Router();

/**
 * @swagger
 * /users/profile:
 *   get:
 *    description: Get user by access token
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: Returns user data
 *        schema:
 *          type: array
 *          items:
 *            $ref: "#/definitions/CognitoBaseUser"
 *      401:
 *        description: authorization error
 *        schema:
 *          $ref: "#/definitions/401_ErrorModel"
 *      default:
 *        description: API error
 *        schema:
 *          $ref: '#/definitions/ErrorModel'
 */
router.get('/profile', (req, res) => {
  getUserProfile(req.headers.accesstoken)
    .then(data => res.status(200).json(data))
    .catch(error => res.status(200).json({
      message: COGNITO_ERROR,
      body: error
    }));
});

/**
 * @swagger
 * /users/update:
 *   put:
 *    description: Get user by access token. You cannot change these requirements.
 *    produces:
 *      - application/json
 *    parameters:
 *      - in: 'body'
 *        name: 'body'
 *        description: 'attributes data for update'
 *        required: true
 *        schema:
 *          $ref: '#/definitions/UserAttributes'
 *    responses:
 *      200:
 *        description: Returns user data
 *        schema:
 *          $ref: "#/definitions/CognitoBaseUser"
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
router.put('/attributes', (req, res) => {

  const validBody = validateBody(req, [
    isLength('birthdate', { min: 10, max: 10 }),
  ]);

  if (validBody.valid) {

    const attributes = listAttributes(req.body);

    updateAttribute(req.headers.accesstoken, attributes)
      .then(data => res.status(200).json(data))
      .catch(error => res.status(500).json({
        message: COGNITO_ERROR,
        body: error
      }));
  } else {
    const error = validBody.errors.concat(validParam.errors);
    res.status(422).send({
      message: VALIDATION_ERROR,
      body: error
    });
  }
});

module.exports = router;



