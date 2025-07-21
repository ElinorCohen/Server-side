var express = require('express');
var router = express.Router();

//get the about page that shows the project members
router.get('/', (req, res,next) => {
    const developers = [{'firstname':'Daniel','lastname':'Semerjian','id':000000000,'email':'semdaniel1@gmail.com'},
        {'firstname':'Shay','lastname':'Solomon','id':111111111,'email':'shays433@gmail.com'},
        {'firstname':'Elinor','lastname':'Cohen','id':222222222,'email':'elinorco24@gmail.com'}];
    try {
        res.send(developers);
    } catch (error) {
        res.status(500).send(error);
    }
})

module.exports = router;
