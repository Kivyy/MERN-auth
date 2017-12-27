const User = require('../models/user');
const jwt = require('jwt-simple');
const config = require('../config');

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id , iat: timestamp } , config.secret);
};

exports.signin = (req,res,next) => {
  console.log(req.body);
  res.send({token: tokenForUser(req.user)});
};

exports.signup = (req,res,next) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password){
    return res.status(422).send({error: 'Missing Email and Password'})
  }
  // Mongoose help method to search database by field and return a cb
  User.findOne({email: email}, (err , existingUser) => {
    if(err) {
      return next(err);
    }
    if(existingUser){
      console.log("this hit")
      return res.status(422).send({error: 'Email has already registered.'});
    }
  });
  // if the user was not found in existing db , we will create a new one for the user
    const user = new User({
      email: email,
      password: password
    })
    user.save((err) => {
      if(err) { return next(err)}

      res.json({ token: tokenForUser(user)});
    });
}
