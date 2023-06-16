const mongoose = require('mongoose')

const Schema = mongoose.Schema

const playerSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    rank: {
        type: Number,
        required: true
    },
    score: {
        wins: {
            type: Number,
            default: 0
        },
        losses: {
            type: Number,
            default: 0
        },
        draws: {
            type: Number,
            default: 0
        }
    }

})

module.exports = mongoose.model('Player', playerSchema)