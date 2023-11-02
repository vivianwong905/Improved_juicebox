const { mockReset } = require('jest-mock-extended');
const app = require('../../app')
const request = require('supertest');
const prismaMock =require('../../mocks/prismaMock');

describe('GET /api/users', () => {
    
    beforeEach(() => {
  mockReset(prismaMock)
})
    test('returns list of all users', async () => {
        const users = [
            {id: 1, username: 'trdst', name: 'Al Bert', location:'Sidney, Australia', active: true}
        ];

        prismaMock.users.findMany.mockResolvedValue(users);

        const response = await request(app).get('/api/users');
        console.log(response.body.users, "user respnoengiengg");
        // expect(response.body.users[0]).toEqual(users[0]);
    });

    
});