const Models=require('../models')
const bcryptjs = require('bcryptjs')
const passport = require('passport')

//@ router for register

module.exports.register=(req,res)=>{
    passport.authenticate('register', (err, user, info) => {
        if (err) {
          console.log(err);
        }
        if (info != undefined) {
          console.log(info.message);
          res.send(info.message);
        } else {
            res.send(user)
        }
      })(req, res);
}

//@ router for login

module.exports.login= async (req, res)=>{
      passport.authenticate('login', (err, token, info) => {
        if (err) {
          console.log(err);
        }
        if (info != undefined) {
          console.log(info.message);
          res.send(info.message);
        } else {
            res.send(token)
        }
      })(req, res);

}


//@ts-check route for logout

module.exports.logout = async (req, res) => {   
    const token = req.header('x-auth')
    const {user} = req
  console.log("inside logout toke data and user data",token,user)
    
  Models.AuthToken.destroy({ where: { token } })
    .then((response) => {
        res.status(204).send("token succesfully deleted")
    })
    .catch((err) => {
        res.status(400).send(
            { errors: [{ message: 'not authenticated' }] }
          );
    })
  };

  //@ts-check route for user account details

  module.exports.account = async (req,res) => {
     const {user} = req
     res.json(user)
  }