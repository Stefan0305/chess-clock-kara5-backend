const { error } = require('console');
const express = require('express');
const mongoose = require('mongoose');
const Player = require('./models/playerModel')
const bodyParser = require('body-parser')
const cors = require('cors');

const app = express();
const jsonParser = bodyParser.json()


app.use(cors({
    origin: 'http://localhost:3000'
}));

const PORT = 5000;
const MONG_URI = 'mongodb+srv://stefan:admin@chessleaderboardkara5.7fku0su.mongodb.net/';

// end points
app.get('/leaderboard', async (req, res) => {
    const players= await Player.find({}).sort({rank: -1})
    res.status(200).json(players)
})

app.get('/player/:name', jsonParser, async (req, res) => {
    const findBy = req.body.name
    try {
        const player = await Player.findOne({name: req.body.name})
        res.status(200).json(player)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
})

app.post('/player/add', jsonParser, async (req, res) => {
    const name = req.body.playerName
    const ifExists = await Player.exists({name: req.body.playerName})
    if(ifExists){
        res.status(400).json({error: "Player with that name already exists!"})
        return;
    }
    try {
        const player = await Player.create({name})
        res.status(200).json({message: "Player registered!"})
    } catch (error) {
        res.status(400).json({error: error.message})
    }
})

mongoose.connect(MONG_URI)
    .then(() => {
        console.log('Connection success')
        app.listen(PORT, () => console.log(`Server started on PORT: ${PORT}`));
    })
    .catch((error) => {
        console.log(error)
    })
