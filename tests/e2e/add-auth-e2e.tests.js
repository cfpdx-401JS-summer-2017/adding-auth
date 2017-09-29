const req = require('../helpers/request');
const chai = require('chai');
const assert = chai.assert;
const connect = require('../../lib/connect');
const dbUri = process.env.MONGO_URI || 'mongodb://localhost:27017/adding-auth';
const { drop } = require('../helpers/db');
const seedPeople = require('../helpers/test-data');
const { verify } = require('../../lib/auth/token-service');

describe('user security API', () => {
  let token = '';

  before(() => {
    connect(dbUri);
    drop();
  });

  it('creates a user with roles', async () => {
    const roleUser = await req.post('/users/signup').send(seedPeople[1]);
    const token = roleUser.body.token;
    assert.isOk(token);
  }),
    it("fails if user doesn't have both email and pw", async () => {
      const fail = await req.post('/users/verify').send(seedPeople[2]);
      assert.equal(fail.body.code, 400);
      assert.equal(fail.body.name, 'Both email and password are required.');
    }),
    it('checks credentials then retrieves the user', async () => {
      const checkCreds = await req.post('/users/signup').send(seedPeople[3]);
      return verify(checkCreds.body.token, () => {
        assert.equal(authedUser.roles.admin, true);
        assert.equal(authedUser.roles.manager, false);
        return
      })
    }),
    it('gets all users', async () => {
      const allUsers = await req.get('/users');
      assert.equal(allUsers.body.length, 2);
    }),
    it('checks user role', async () => {
      const haveRoles = await req.get('/users').query({ 'roles.manager': true});
      assert.equal(haveRoles.body[0].roles.manager, true)
      assert.equal(haveRoles.body.length, 1)
    });
});

