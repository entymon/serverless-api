const request = require('supertest');
const app = require('../server');
const client = require('../models/post');
const db = require('../services/DynamoDB');

const uuid = '7499d330-55e5-11e8-97e1-05025753431f';

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
  beforeAll(() => {
    client.updatePost(uuid, data);
  });
});

describe('Tests endpoints: ANY /posts', () => {

  describe('GET /posts - get all posts', () => {

    const expectedProps = [ 'uuid', 'title', 'excerpt', 'content', 'author', 'categories', 'createdAt', 'updatedAt' ];

    it('should return JSON array', () => {
      return request(app)
        .get('/posts')
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

});
