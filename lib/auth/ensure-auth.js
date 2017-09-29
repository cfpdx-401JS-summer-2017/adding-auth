const tokenService = require('./token-service');
const req = require('../../tests/helpers/request');


module.exports = function getEnsureAuth() {

    return function ensureAuth(req, res, next) {
        const token = req.get('Authorization')

        if(!token) {
            return next({ code: 401, error: 'No Authorization Found' });
        }
        tokenService.verify(token)
            .then(payload => {
                req.user = payload;
                next();
            })
            .catch(() => {
                return next({ code: 401, error: 'Authorization Failed' });
            });
    };

};

// use token service to verify that the user is authorized