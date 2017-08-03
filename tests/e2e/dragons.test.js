const db = require('./helpers/db');
const chai = require('chai');
const assert = chai.assert;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);


require('../../lib/connect');

const connection = require('mongoose').connection;

const app = require('../../lib/app');

const request = chai.request(app);

describe('dragons REST api',()=>{
    before(() => connection.dropDatabase());

    let token = null;
    before(() => db.getToken().then(t => token = t));
    
    it('initial /GET returns empty list', () => {
        return request.get('/dragons')
            .set('Authorization', token)
            .then(req => {
                const dragons = req.body;
                assert.deepEqual(dragons, []);
            });
    });

    const drogo = {
        name: 'Smaug',
        color: 'red',
        horde: [
            {name: 'gold', weight: 100000000},
            {name: 'artifacts', weight: 66}
        ]
    };
    const smaug = {
        name: 'Smogg',
        color: 'red'
    };
    
    const scatha = {
        name: 'Scatha',
        color: 'white'

    };
    const glaurung = {
        name: 'Glaurung',
        color: 'black'
    };
    function saveDragon(dragon) {
        return request
            .post('/dragons')
            .set('Authorization', token)
            .send(dragon)
            .then(({body}) => {
                dragon._id = body._id;
                dragon.__v = body.__v;
                return body;
            });

    }
    it('saves a dragon', () => {
        return saveDragon(smaug)
            .then(savedDragon => {
                assert.isOk(savedDragon._id);
                assert.equal(savedDragon.name, smaug.name);
                assert.equal(savedDragon.color, smaug.color);
            });
    });

    it('GETs dragon if it exists', () => {
        return request
            .get(`/dragons/${smaug._id}`)
            .set('Authorization', token)
            .then(res => res.body)
            .then(dragon => {
                assert.equal(dragon.name, smaug.name);
                assert.equal(dragon.color, smaug.color);
            });
    });

    it('returns 404 if dragon does not exist', () => {
        return request.get('/dragons/58ff9f496aafd447254c29b5')
            .set('Authorization', token)
            .then(() => {
                //resolve
                throw new Error('successful status code not expected');
            },
            ({ response }) => {
                //reject
                assert.ok(response.notFound);
                assert.isOk(response.error);
            }
            );
    });

    it('GET all dragons', () => {
        return Promise.all([
            saveDragon(scatha),
            saveDragon(glaurung),
        ])
            .then(() => request
                .get('/dragons')
                .set('Authorization', token)
            )
                
            .then(res => {
                const dragons = res.body;
                assert.deepEqual(dragons, [smaug, scatha, glaurung]);
            });
    });
    it('rewrites dragon data by id', ()=>{
        return request.put(`/dragons/${smaug._id}`)
            .set('Authorization', token)
            .send(drogo)
            .then(res => {
                assert.isOk(res.body._id);
                assert.equal(res.body.name,drogo.name);
                assert.equal(res.body.color,drogo.color);
            });
    });
    it('deletes dragon by id', () =>{
        return request.delete(`/dragons/${scatha._id}`)
            .set('Authorization', token)
            .then(res => {
                assert.deepEqual(JSON.parse(res.text), { removed: true });
            });
    });
    it('fails to delete dragon by id', () =>{
        return request.delete(`/dragons/${scatha._id}`)
            .set('Authorization', token)
            .then(res => {
                assert.deepEqual(JSON.parse(res.text), { removed: false });
            });
    });
            
});