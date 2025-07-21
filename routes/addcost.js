var express = require('express');
var router = express.Router();
var functions = require('../database/creation_and_connection');

router.post('/', async (req, res) => {
    try {
        let cost = await functions.AddCost(req.body.user_id, req.body.year, req.body.month, req.body.day, req.body.description, req.body.category, req.body.sum)
        res.status(200).send(`Cost created succesfully: ${cost}`);
    } catch (error) {
        res.status(500).send(error)
    }
});

module.exports = router;
