const request = require('supertest');
const app = require('../server');

describe('Test the root path', () => {
  test('It should response the GET method', () => {
    return request(app).get('/').expect(200);
  });
});

// describe('Test the addLike method', () => {
//   beforeAll(() => {
//
//   });
//   afterAll((done) => {
//
//   });
// });

describe('Flow API', () => {

  describe('GET /posts - get all posts', () => {

    const expectedProps = [ 'uuid', 'title', 'excerpt', 'content', 'author', 'categories' ];

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
          if (res.body.Items.length !== 0) {
            const sampleKeys = Object.keys(res.body.Items[0]);
            expectedProps.forEach((key) => {
              expect(sampleKeys.includes(key)).toBe(true);
            });
          }
        });
    });

    it('shouldn\'t return objects with extra props', () => {
      return request(app)
        .get('/posts')
        .expect(200)
        .then(res => {
          const items = res.body.Items;
          if (items.length !== 0) {
            const extraProps = Object.keys(items[0]).filter((key) => {
              return !expectedProps.includes(key);
            });
            expect(extraProps.length).toBe(0);
          }
        });
    });
  });

});
