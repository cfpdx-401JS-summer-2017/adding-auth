const express = require('express');
const router = express.Router();
const Dragon = require('../models/dragon');
const jsonParser = require('body-parser').json();

router
    .get('/:id', (req, res, next) => {
        Dragon.findById(req.params.id)
            .lean()
            .then(dragon => {
                if(!dragon) res.status(404).send(`Cannot GET ${req.params.id}`);
                else res.send(dragon);
            })
            .catch(next);
    })
    .get('/', (req, res, next) => {
        Dragon.find()
            .lean()
            .select('name color __v')
            .then(dragons => res.send(dragons))
            .catch(next);

    })
    .use(jsonParser)
    
    .post('/', (req, res, next) =>{
        const dragon = new Dragon(req.body);
        dragon
            .save()
            .then(dragon => res.send(dragon))
            .catch(next);
    })
    .put('/:id', (req,res,next) => {
        Dragon.findByIdAndUpdate(req.params.id, req.body, {new: true})
            .then(dragon => res.send(dragon))
            .catch(next);
    })
    .delete('/:id', (req,res,next) => {
        Dragon.findByIdAndRemove(req.params.id)
            .then(actor => res.send( { removed: actor !== null }))
            .catch(next);
    });


module.exports = router;