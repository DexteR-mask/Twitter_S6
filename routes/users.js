var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
var { user, tweet } = require('../mongose')
/* GET users listing. */

function getU(res)
{
  user.find({}).then(function (users) {
    res.status(400).send(users);
  });
}


router.get('/', function (req, res, next) {
  getU(res)
});



router.post('/',function(req,res){
  res.status(400);
})





router.post('/add', async function (req, res) {
  const hash = bcrypt.hashSync(req.body.password , 10);
  const doc1 = new user
    (
      {
        username: req.body.username,
        password: hash,
        age: req.body.age,
        name: req.body.name
      }
    )
  // await user.deleteMany({});
  await doc1.save();
  
  getU(res);


})







router.post('/addtweet', async function (req, res) {

  const tweet1 = new tweet
    (
      {
        msg: req.body.msg
      }
    )
    tweet1.save();
  await user.updateOne({ username : req.body.username }, {
    $push: { tweets : tweet1 }
  });
  
  getU(res)

})





router.post('/remove', async function (req, res) {

  await user.deleteOne({ username: req.body.username });
  // doc1.save();
  getU(res)

})





module.exports = router;
