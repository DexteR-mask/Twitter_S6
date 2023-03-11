const mongoose = require('mongoose');


const tweetsSchema = new mongoose.Schema({
  msg:String,
  likes:Number,

  //tweets: mongoose.ObjectId 
});



const UsersSchema = new mongoose.Schema({
    username: String,
    password: String,
    age: Number,
    name: String,
    tweets:[mongoose.ObjectId]
    //tweets: mongoose.ObjectId 
  });
const user =new mongoose.model('user',UsersSchema);
const tweet =new mongoose.model('tweet',tweetsSchema);
// docs=new user({ 

//     username: "jas2121",
//     password: "what are u thinking ",
//     age: '21',
//     name: 'Jaspreet Singh'

// })

module.exports = {user,tweet};