const mongoose = require('mongoose');
// I'm require the Schema "class" so we can make a schema instance
const Schema = mongoose.Schema;

const dragSche = new Schema({
    name:{
        type: String,
        required: true
    },
    color:{
        type:String,
        required: true,
        enum:['gold','red','silver','blue','bronze','yellow','copper','black','white','green','brass']
    },
    home:{
        environment: String,
        neighbors: String
    },
    horde: [{
        name: String,
        weight: Number
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Dragon', dragSche);