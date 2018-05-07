## INTRO

This project like each other is a base for learning. This one is very first project based on serverless framework.
Keyword: NodeJS, Lambda, DynamoDB, AWS

# SETUP

### General Setup

1. Run `yarn` and install all dependencies
2. Copy `.env.example` as `.env`

### Setup local environment

1. Install DynamoDB locaaly: `sls dynamodb install`
2. `$ yarn start`

### Deploy to stage

1. Create account in Amazon Web Services and add new user. Full instruction how to do this you can find on viedo:
```https://www.youtube.com/watch?v=HSd9uYj2LJA``` (AWS UI was changed - secret key and token you can get from last step).
Author recommand use application to authorize deployment which is very usefull.

### Offline Setup

1. In project was used: `serverless-offline` and `serverless-dynamodb-local` which helps for local development
2. From your root project run command: `$ sls dynamodb install` which installs local dynamoDB (You will have access to it from :8000)
3. Run `serverless offline start` to start OFFLINE project


# OTHER

### Usefull commands

1. `serverless` - shows you all
2. `serverless info` - show info about endpoints

### TROUBLESHOOTING

1. I have got one problem where I didn't know what's going on. Followed to instructions in tutorial: `https://serverless.com/blog/serverless-express-rest-api/`
I used syntax `tableName: 'users-table-${self:provider.stage}'` - serverless command line does not show any problems however each command execution gave empty result.

### TODO

- Add Webpack and eslint





