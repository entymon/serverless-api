const express = require('express');
const { getUserProfile } = require('../services/CognitoIdentity');
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

module.exports = router;
