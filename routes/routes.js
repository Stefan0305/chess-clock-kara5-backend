const express= require('express')

const router= express.Router()

router.get('/', (req, res) => {
    red.json({msg: 'GET all players'})
})  

router.get('/:id', (req, res) => {
    res.json({msg: 'GET player with specified id'})
})

module.exports= router