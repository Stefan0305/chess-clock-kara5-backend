const { error } = require('console');
const express = require('express');
const mongoose = require('mongoose');
const Player = require('./models/playerModel')
const bodyParser = require('body-parser')
const cors = require('cors');

const app = express();
const jsonParser = bodyParser.json()


app.use(cors({
    origin: '*'
}));

const PORT = 5000;
const MONG_URI = 'mongodb+srv://stefan:admin@chessleaderboardkara5.7fku0su.mongodb.net/';

// end points
app.get('/leaderboard', async (req, res) => {
    const players = await Player.find({}).sort({ rank: -1 })
    res.status(200).json(players)
})

app.get('/leaderboard/player/:id', jsonParser, async (req, res) => {
    try {
        const player = await Player.findOne({ _id: req.params.id })
        res.status(200).json(player)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

app.post('/player/add', jsonParser, async (req, res) => {
    const name = req.body.playerName
    const ifExists = await Player.exists({ name: req.body.playerName })
    if (ifExists) {
        res.status(400).json({ error: "Player with that name already exists!" })
        return;
    }
    try {
        const player = await Player.create({ name })
        res.status(200).json({ message: "Player registered!" })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

app.patch('/new-game/update-results', async (req, res) => {
    const winner = await Player.findById(req.query.winner)
    console.log(winner)
    const loser = await Player.findById(req.query.loser)
    console.log(loser)

    let rW = winner.rank;
    let rL = loser.rank;

    const K= 30;

    const Pb = Probability(rW, rL);
    const Pa = Probability(rL, rW);

    rW = rW + K * (1 - Pa);
    rL = rL + K * (0 - Pb);

    const winnerNew = {
        name: winner.name,
        rank: Math.round(rW),
        score: {
            played: winner.score.played + 1,
            won: winner.score.won + 1,
            lost: winner.score.lost,
            draw: winner.score.draw
        }
     }
    const updated1= await Player.replaceOne({_id: req.query.winner}, winnerNew)

    const loserNew = {
        name: loser.name,
        rank: Math.round(rL),
        score: {
            played: loser.score.played + 1,
            won: loser.score.won,
            lost: loser.score.lost + 1,
            draw: loser.score.draw
        }
     }
    const updated2= await Player.replaceOne({_id: req.query.loser}, loserNew)

})

// Function to calculate the Probability
function Probability(rating1, rating2) {
    return (
        (1.0 * 1.0) / (1 + 1.0 * Math.pow(10, (1.0 * (rating1 - rating2)) / 400))
    );
}

mongoose.connect(MONG_URI)
    .then(() => {
        console.log('Connection success')
        app.listen(PORT, () => console.log(`Server started on PORT: ${PORT}`));
    })
    .catch((error) => {
        console.log(error)
    })
