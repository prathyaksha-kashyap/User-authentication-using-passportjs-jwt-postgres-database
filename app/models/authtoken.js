'use strict';
const jwt = require('jsonwebtoken')

module.exports = (sequelize, DataTypes) => {
  const AuthToken = sequelize.define('AuthToken', {
    token: DataTypes.STRING
  }, {});
  
  AuthToken.associate = function(models) {
    AuthToken.belongsTo(models.User)
  };

  //@ static method to generate token using jwt
  AuthToken.generate = async function(user, UserId) { 
    
    let tokenData = {
       id : user.id,
       username : user.username
    }

    //@ token is created with expiration time of 24hrs
    const token = jwt.sign(tokenData,"jwt@123",{expiresIn: 86400 })    
    return AuthToken.create({ token, UserId })
  }
  return AuthToken;
};