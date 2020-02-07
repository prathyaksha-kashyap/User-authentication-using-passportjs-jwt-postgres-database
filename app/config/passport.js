const jwtSecret = require('./jwtConfig')
const bcrypt = require('bcryptjs')
const jwt =require('jsonwebtoken');
const Sequelize = require('sequelize');
const Models = require('../models')

const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
var JwtStrategy  = require('passport-jwt').Strategy
var ExtractJWT = require('passport-jwt').ExtractJwt

//@ midlleware for regester
const BCRYPT_SALT_ROUNDS = 10;
const Op = Sequelize.Op
passport.use(
    'register',
    new LocalStrategy(
      {
        usernameField: 'username',
        passwordField: 'password',
        
        passReqToCallback: true,
        session: false,
      },
      (req, username, password, done) => {
        console.log(username);
        console.log(req.body.email);
  
        try {
         Models.User.findOne({
            where: {
              [Op.or]: [
                {
                  username,
                },
                { email: req.body.email },
              ],
            },
          }).then(user => {
            if (user != null) {
              console.log('username or email already taken');
              return done(null, false, {
                message: 'username or email already taken',
              });
            }
            bcrypt.hash(password, BCRYPT_SALT_ROUNDS).then(hashedPassword => {
              Models.User.create({
                username,
                password: hashedPassword,
                email: req.body.email,
              }).then(user => {
                console.log('user created');
                return done(null, user);
              });
            });
          });
        } catch (err) {
          return done(err);
        }
      },
    ),
  );

  //passport middleware for login
  passport.use(
    'login',
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
        session: false,
      },
      (email, password, done) => {
        try {
          Models.User.findOne({
            where: {
              email,
            },
          }).then(user => {
            if (user === null) {
              return done(null, false, { message: 'invalid email/password' });
            }
            bcrypt.compare(password, user.password).then(response => {
              if (response !== true) {
                console.log('passwords do not match');
                return done(null, false, { message: 'invalid email/password' });
              } else {
                console.log('user found & authenticated');
                const token = jwt.sign({ id: user.id, username : user.username }, jwtSecret.secret);
                Models.AuthToken.create({ token, UserId:user.id })
                .then((token) => {
                    return done(null, token);
                })
                .catch(err=> console.log(err))
              }
              
            });
          });
        } catch (err) {
          done(err);
        }
      },
    ),
  );

const opts = {}
opts.jwtFromRequest = ExtractJWT.fromHeader('x-auth'),
opts.secretOrKey=jwtSecret.secret,

  //@ this passport midlleware is called for jwt authentication
  passport.use(
    'jwt',
    new JwtStrategy (opts, (jwt_payload, done) => {
      console.log(jwt_payload)
        try {
        Models.User.findOne({
          where: {
            id: jwt_payload.id,
          },
        }).then(user => {
          if (user) {
            console.log('user found in db in passport');
            done(null, user);
          } else {
            console.log('user not found in db');
            done(null, false);
          }
        });
      } catch (err) {
        done(err);
      }
    }),
  );