const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const { AWS } = require('../configs/awsConfig');

const cognitoConfig = {
  IdentityPoolId: process.env.COGNITO_IDENTITY_POOL_ID,
  UserPoolId: process.env.COGNITO_USER_POOL_ID,
  ClientId: process.env.COGNITO_USER_POOL_CLIENT_ID,
};


module.exports.signUp = () => {

  AWS.config = {
    apiVersion: '2018-05-11',
    region: process.env._AWS_REGION,
    accessKeyId: process.env._AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env._AWS_SECRET_ACCESS_KEY,
    logger: console.log,
    credentials: new AWS.CognitoIdentityCredentials(cognitoConfig)
  };

  console.log(AWS.config)

  // Make the call to obtain credentials
  AWS.config.credentials.get(function(){

    // Credentials will be available when this function is called.
    const accessKeyId = AWS.config.credentials.accessKeyId;
    const secretAccessKey = AWS.config.credentials.secretAccessKey;
    const sessionToken = AWS.config.credentials.sessionToken;
    const identityId = AWS.config.credentials.identityId;

    console.log(accessKeyId);
    console.log(secretAccessKey);
    console.log(sessionToken);
    console.log(identityId);

    // return res.send({
    //   accessKeyId: accessKeyId
    // });

  });


  // const attributeList = [];
  //
  // const dataEmail = {
  //   Name: 'email',
  //   Value: 'email@mydomain.com'
  // };
  //
  // const attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);
  //
  // attributeList.push(attributeEmail);
  //
  // console.log(userPool);
  //
  // userPool.signUp('username', 'password', attributeList, null, function(err, result) {
  //   if (err) {
  //     console.log(err);
  //     return;
  //   }
  //   const cognitoUser = result.user;
  //   console.log('user name is ' + cognitoUser.getUsername());
  // });
};
