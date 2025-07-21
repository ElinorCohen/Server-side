var express = require('express');
var router = express.Router();
var functions = require('../database/creation_and_connection');

router.get('/', async (req, res) => {
    try {
        const {user_id, month, year} = req.query;
        let report = await functions.CreateReport(user_id,month,year);
        res.status(200).json(report);
    } catch (error) {
        res.status(500).send(error)
    }

});

module.exports = router;
