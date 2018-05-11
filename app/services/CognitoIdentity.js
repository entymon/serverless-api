const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const AWS = require('aws-sdk');

const myCredentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: process.env.COGNITO_IDENTITY_POOL_ID
});

new AWS.Config({
  apiVersion: '2018-05-11',
  credentials: myCredentials,
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

module.exports.test = () => {
  console.log(AWS.config);
};

module.exports.signUp = () => {
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
