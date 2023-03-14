var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
const Joi = require("joi");
var jwt = require("jsonwebtoken");
var { user, tweet } = require("../mongose");
const { boolean } = require("joi");
const secret = "jkvikjhbkj";
const Checkjoi = Joi.object({
  username: Joi.string().token(),
  password: Joi.string().min(8),
  age: Joi.number(),
  name: Joi.string().pattern(/^[a-zA-Z]+$/),
});

//------------------------------------------

function getU(res) {
  user.find({}).then(function (users) {
    res.status(200).send(users);
  });
}

//------------------------------------------
router.get("/", function (req, res, next) {
  getU(res);
});
//------------------------------------------

router.post("/tweet", function (req, res) {
  tweet.find({ _id: req.body.id }).then(function (tweet) {
    res.status(200).send(tweet);
  });
});
//------------------------------------------

router.post("/add", async function (req, res) {
  const hash = bcrypt.hashSync(req.body.password, 10);

  const ret = Checkjoi.validate({
    username: req.body.username,
    password: hash,
    age: req.body.age,
    name: req.body.name,
  });
  if (ret.error != undefined) {
    res.status(400).json(ret.error);
  } else {
    const doc1 = new user({
      username: req.body.username,
      password: hash,
      age: req.body.age,
      name: req.body.name,
    });
    // await user.deleteMany({});
    await doc1.save();
    getU(res);
  }
});
//------------------------------------------

router.post("/login", function (req, res) {
  user.findOne({ username: req.body.username }).then(function (user) {
    if (user === null) {
      res.status(400).send("user Not Found");
    } else {
      bcrypt.compare(req.body.password, user.password).then(function (result) {
        if (result == true) {
          var token = jwt.sign(
            {
              data: user.username,
            },
            secret,
            { expiresIn: 60 * 5 }
          );
          res.status(200).send(token);
        } else {
          res.status(400).send("password Incoreect");
        }
      });
    }
  });
});

//------------------------------------------

router.post("/verify", function (req, res) {
  jwt.verify(req.body.token, secret, function (err, decoded) {
    if (err == null) {
      res.status(200).send(decoded.data); // bar
    } else {
      res.status(400).send(err);
    }
  });
});

//------------------------------------------

router.post("/addtweet", async function (req, res) {
  const tweet1 = new tweet({
    msg: req.body.msg,
  });
  tweet1.save();
  await tweet.updateOne(
    { username: req.body.username },

    {
      $push: { tweets: tweet1 },
    }
  );
  getU(res);
});

//------------------------------------------

router.post("/editweet", async function (req, res) {
  await user.updateOne(
    { _id: req.body.id },
    {
      msg: req.body.msg,
    }
  );
  getU(res);
});

//------------------------------------------

router.post("/remove", async function (req, res) {
  await user.deleteOne({ username: req.body.username });
  // doc1.save();
  getU(res);
});

//------------------------------------------

router.all("*", function (req, res) {
  res.status(404).send("not found");
});

//------------------------------------------

module.exports = router;
