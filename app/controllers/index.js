require('dotenv').config();

const express = require('express');
const passport = require('passport');
const passportJWT = require('passport-jwt');
const jwt = require('jsonwebtoken');

const { getUserByUuid } = require('../models/user');

const router = express.Router();
const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

router.all('*', async (request, response, next) => {

});

router.get('/', (req, res, next) => {
  res.send('test');
});
router.use('/posts', require('./post'));
router.use('/users', require('./user'));

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
  secretOrKey: process.env.AUTH0_SECRET
};

const strategy = new JwtStrategy(jwtOptions, (jwt_payload, next) => {

  const userPromise = getUserByUuid(jwt_payload.uuid);
  userPromise.then((user) => {
    if (user) {
      next(null, user);
    } else {
      next(null, false);
    }
  });
});

passport.use(strategy);

router.post('/login', (req, res, next) => {
  let name = '';
  let password = '';
  if (req.body.name && req.body.password) {
    name = req.body.name;
    password = req.body.password;
  }

  const userPromise = getUserByName(name);

  userPromise.then(user => {
    if (!user) {
      res.status(401).json({ message: 'no such user found' });
    }

    if (user.password === password) {
      const payload = { uuid: user.uuid };
      const token = jwt.sign(payload, jwtOptions.secretOrKey);
      res.json({ message: 'ok', token: token });
    } else {
      res.status(401).json({ message: 'passwords did not match' });
    }
  });
});

router.get('/secretDebug',
  (req, res, next) => {
    console.log(req.get('Authorization'));
    next();
  }, (req, res) => {
    res.json('debugging');
  });

router.get('/secret', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json('Success! You can not see this without a token');
});

module.exports = router;
