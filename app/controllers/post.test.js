const request = require('supertest');
const assert = require('assert');
const _ = require('lodash');

process.env.COGNITO_AUTHORIZATION = 1;

const app = require('../server');
const client = require('../models/post');
const db = require('../services/DynamoDB');
global.fetch = require('node-fetch');
const cognito = require('../services/CognitoIdentity');

const uuid = '7499d330-55e5-11e8-97e1-05025753431f';
let accessToken = '';

describe('Add record to Post table', () => {

  const data = {
    categories: [
      '324234cfefd',
      'dfe21323we'
    ],
    title: 'Example of title',
    excerpt: 'Excerpt example test',
    uuid: uuid,
    content: 'This is example content',
    author: {
      uuid: 'uuid',
      username: 'test author'
    },
    createdAt: '2018-05-12T16:06:45.784Z'
  };
  beforeAll( async (done) => {
    await client.updatePost(uuid, data);
    const tokens = await cognito.signIn(
      process.env.DEMO_USERNAME,
      process.env.DEMO_PASSWORD
    );
    accessToken = tokens.accessToken;
    done();
  });
});

describe('Tests endpoints: ANY /posts', () => {

  describe('GET /posts ==> get all posts', () => {

    const expectedProps = [ 'uuid', 'title', 'excerpt', 'content', 'author', 'categories', 'createdAt', 'updatedAt' ];

    it('should return with JSON for authentication error', () => {
      return request(app)
        .get('/posts')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(401)
        .then(res => {
          expect(res.body).toHaveProperty('message');
          expect(res.body).toHaveProperty('details');
        });
    });

    it('should return JSON array', () => {
      return request(app)
        .get('/posts')
        .set('Accept', 'application/json')
        .set('accesstoken', accessToken)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(res => {

          expect(res.body).toHaveProperty('Items');
          expect(res.body).toHaveProperty('Count');

          expect(res.body.Items).toBeInstanceOf(Array);
          expect(res.body.Count).toEqual(jasmine.any(Number));
        });
    });

    it('should return objects with correct props', () => {
      return request(app)
        .get('/posts')
        .set('Accept', 'application/json')
        .set('accesstoken', accessToken)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(res => {
          const sampleKeys = Object.keys(res.body.Items[0]);
          expectedProps.forEach((key) => {
            expect(sampleKeys.includes(key)).toBe(true);
          });
        });
    });

    it('shouldn\'t return objects with extra props', () => {
      return request(app)
        .get('/posts')
        .set('Accept', 'application/json')
        .set('accesstoken', accessToken)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(res => {
          const items = res.body.Items;
          const extraProps = Object.keys(items[0]).filter((key) => {
            return !expectedProps.includes(key);
          });
          expect(extraProps.length).toBe(0);
        });
    });
  });

  describe('GET /posts/:uuid ==> get post by uuid', () => {

    const expectedProps = [ 'uuid', 'title', 'excerpt', 'content', 'author', 'categories', 'createdAt', 'updatedAt' ];

    it('should return with JSON for authentication error', () => {
      return request(app)
        .get('/posts')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(401)
        .then(res => {
          expect(res.body).toHaveProperty('message');
          expect(res.body).toHaveProperty('details');
        });
    });

    it('respond for not allowed length of query parameter', (done) => {
      return request(app)
        .get('/posts/not-valid-uuid')
        .set('Accept', 'application/json')
        .set('accesstoken', accessToken)
        .expect('Content-Type', /json/)
        .expect(422)
        .end((err, result) => {
          done(err);
        });
    });

    it('respond for post not found', (done) => {
      return request(app)
        .get('/posts/50398b30-56e8-11e8-b897-d5b46d8bxxxx')
        .set('Accept', 'application/json')
        .set('accesstoken', accessToken)
        .expect('Content-Type', /json/)
        .expect(404)
        .end((err, result) => {
          assert.equal(result.body.message, 'empty content');
          assert.equal(_.isEmpty(result.body.details), true);
          done(err);
        });
    });

    it('should respond with post found with proper props', (done) => {
      return request(app)
        .get('/posts/7499d330-55e5-11e8-97e1-05025753431f')
        .set('Accept', 'application/json')
        .set('accesstoken', accessToken)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(res => {
          expect(res.body).toHaveProperty('Item');

          const sampleKeys = Object.keys(res.body.Item);
          expectedProps.forEach((key) => {
            expect(sampleKeys.includes(key)).toBe(true);
          });
          done();
        });
    });
  });

  describe('POST /posts ==> create ne post', () => {

  });

});

describe('Add record to Post table', () => {

  afterAll( async (done) => {
    await client.deletePost(uuid);
    done();
  });
});
