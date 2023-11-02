
const { mockReset } = require('jest-mock-extended');
const app = require('../../app')
const request = require('supertest');
const prismaMock =require('../../mocks/prismaMock');

describe('GET posts', () => {
    beforeEach(() => {
  mockReset(prismaMock)
})
    
    test('returns list of all post', async () => {
        const posts = [
            {id: 1, title: 'thsiisagest', content: 'hello! Bert'}
        ];

        prismaMock.posts.findMany.mockResolvedValue(posts);

        const response = await request(app).get('/api/posts');
        console.log(response.body.posts, "POOOST RESPONSEFEFEFEF");
        expect(response.body.posts[0]).toEqual(posts[0]);
    });

    
});