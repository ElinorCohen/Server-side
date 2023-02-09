// Daniel Semerjian - 318004504
// Shay Solomon - 209088442
// Elinor Cohen - 322624453

var express = require('express');
var router = express.Router();

//get the about page that shows the project members
router.get('/', (req, res,next) => {
    const developers = [{'firstname':'Daniel','lastname':'Semerjian','id':318004504,'email':'semdaniel1@gmail.com'},
        {'firstname':'Shay','lastname':'Solomon','id':209088442,'email':'shays433@gmail.com'},
        {'firstname':'Elinor','lastname':'Cohen','id':322624453,'email':'elinorco24@gmail.com'}];
    try {
        res.send(developers);
    } catch (error) {
        res.status(500).send(error);
    }
})

module.exports = router;
