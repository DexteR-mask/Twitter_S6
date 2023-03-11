var express = require('express');
var { user} = require('../mongose')
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
   const doc1   =new  user
   (
    { 

        username: "jasi23",
        password: "very bad ",
        age: '18',
        name: 'Jaskaran Singh' 
    }
   )
   doc1.save();
  res.send(' hi how respond with a resource');
});

module.exports = router;
