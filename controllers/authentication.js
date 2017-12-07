const User = require('../models/user');
const jwt = require('jwt-simple');
const config = require('../config');

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id , iat: timestamp } , config.secret);
}

exports.signup = (req,res,next) => {
  const email = req.body.email;
  const password = req.body.password;

  console.log("this is being store", password);

  if (!email || !password){
    return res.status(422).send({error: 'Missing Email and Password'})
  }

  User.findOne({email: email}, (err , existingUser) => {
    if(err) {
      return next(err);
    }
    if(existingUser){
      return res.status(422).send({error: 'Email has already registered.'});
    }
  });
    const user = new User({
      email: email,
      password: password
    })
    user.save((err) => {
      if(err) { return next(err)}

      res.json({ token: tokenForUser(user)});
    });
}
