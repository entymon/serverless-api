## INTRO

This is my very first project based on serverless framework.
Keyword: NodeJS, Lambda, DynamoDB, AWS, Swagger



# SETUP

### General Setup

1. Run `yarn` and install all dependencies
2. Copy `.env.example` as `.env`

### Setup local environment

1. Install DynamoDB locaaly: `sls dynamodb install`
2. `$ yarn start`

### Cognito configuration

1. It's not required. Set variable COGNITO_AUTHORIZATION in .env file to `false` for switch off

### API Documentation

This is easy way to check documentation as I didn't publish it yet.

1. Run endpoint: `/swagger.json` in Postman or other HTTP Client
2. Copy JSON code and paste to `https://editor.swagger.io/`


# DEPLOY

### Deploy to stage

1. Create account in Amazon Web Services and add new user. Full instruction how to do this you can find on viedo:
```https://www.youtube.com/watch?v=HSd9uYj2LJA``` (AWS UI was changed - secret key and token you can get from last step).
Author recommand use application to authorize deployment which is very usefull.

### Offline Setup

1. In project was used: `serverless-offline` and `serverless-dynamodb-local` which helps for local development
2. From your root project run command: `$ sls dynamodb install` which installs local dynamoDB (You will have access to it from :8000)
3. Run `serverless offline start` to start OFFLINE project

# OTHER

### Usefull links

1. OpenAPI Specification (2.0) [https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md]
2. Validation documentation (property-validator) [https://www.npmjs.com/package/property-validator]

### Usefull commands

1. `serverless` - shows you all
2. `serverless info` - show info about endpoints

### TROUBLESHOOTING

1. I have got one problem where I didn't know what's going on. Followed to instructions in tutorial: `https://serverless.com/blog/serverless-express-rest-api/`
I used syntax `tableName: 'users-table-${self:provider.stage}'` - serverless command line does not show any problems however each command execution gave empty result.

### Debugging

1. Run `yarn start` for run serverless-offline // actually works perfect without node. Some missed babel libraries blocked console.
2. Run `node app/dev.js` in separate window  - this one listen console logs but has to be restart any time if something was changed


# TODO:

1. [ ] Get list of users from cognito
2. [x] update item in post table dynamoDB
3. [x] add documentation to rest of post endpoint
4. [x] add validation error model
5. [ ] add functional tests
6. [ ] add unit tests
7. [ ] create user via API
8. [ ] update user via API
9. [ ] deploy code to production server



