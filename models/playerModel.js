const mongoose = require('mongoose')

const Schema = mongoose.Schema

const playerSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    rank: {
        type: Number,
        default: 700
    },
    score: {
        played: {
            type: Number,
            default: 0
        },
        won: {
            type: Number,
            default: 0
        },
        lost: {
            type: Number,
            default: 0
        },
        draw: {
            type: Number,
            default: 0
        }
    }

})

module.exports = mongoose.model('Player', playerSchema)