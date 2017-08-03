const chai = require('chai');
const assert = chai.assert;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

require('../../lib/connect');

const connection = require('mongoose').connection;

const app = require('../../lib/app');

const request = chai.request(app);

describe('auth', () => {

    before(() => connection.dropDatabase());

    const user = {
        email: 'user',
        password: 'abc'
    };

    describe('user management', () => {
        const badRequest = (url, data, code, error) =>
            request
                .post(url)
                .send(data)
                .then(
                    () => {
                        throw new Error('status should not be okay');
                    },
                    res => {
                        assert.equal(res.status, code);
                        assert.equal(res.response.body.error, error);
                    }
                );
        it('signup requires email', () => {
            badRequest('/api/auth/signup', 
                {password: 'abc'}, 400, 'email and password must be supplied');
        });

        it('signup requires password', () => {
            badRequest('/api/auth/signup', 
                {email: 'abc'}, 400, 'email and password must be supplied');
        });
        let token = '';
        it('signup', () =>
            request
                .post('/api/auth/signup')
                .send(user)
                .then(res => assert.ok(token = res.body.token))
        );
        it('can not use same email', () => 
            badRequest('/api/auth/signup', user, 400, 'email in use')
        );
        it('signin requires email', () =>
            badRequest('/api/auth/signin', 
                {password: 'abc' }, 400, 'email and password must be supplied')
        );
        it('signin requires password', () =>
            badRequest('/api/auth/signin', 
                {email: 'abc' }, 400, 'email and password must be supplied')
        );
        it('signin with wrong user', () =>
            badRequest('/api/auth/signin', 
                {email: 'bad user', password: user.password }, 401, 'Invalid Login')
        );
        it('signin with wrong password', () =>
            badRequest('/api/auth/signin', 
                { email: user.email, password: 'bad' }, 401, 'Invalid Login')
        );

        it('signin', () =>
            request
                .post('/api/auth/signin')
                .send(user)
                .then(res => assert.ok(res.body.token))
        );

        it('token is invalid', () =>
            request
                .get('/api/auth/verify')
                .set('Authorization', 'bad token')
                .then(
                    () => { throw new Error('success response not expected'); },
                    (res) => { assert.equal(res.status, 401); }
                )
        );
        it('token is valid', ()=>
            request
                .get('/api/auth/verify')
                .set('Authorization', token)
                .then(res => assert.ok(res.body))
        );
    });

    describe('unauthorized', () => {

        it('401 with no token', () => {
            return request
                .get('/dragons')
                .then(
                    () => { throw new Error('status should not be 200'); },
                    res => {
                        assert.equal(res.status, 401);
                        assert.equal(res.response.body.error, 'No Authorization Found');
                    }
                );
        });

        it('403 with invalid token', () => {
            return request
                .get('/dragons')
                .set('Authorization', 'badtoken')
                .then(
                    () => { throw new Error('status should not be 200'); },
                    res => {
                        assert.equal(res.status, 401);
                        assert.equal(res.response.body.error, 'Authorization Failed');
                    }
                );
        });

    });

});