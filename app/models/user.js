'use strict';
const bcrypt = require('bcryptjs')

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {});
  
  User.associate = function(models) {
    User.hasMany(models.AuthToken);
  };


  //@ User model static method
  User.authenticate = async function(email, password) {
    const user = await User.findOne({ where: { email } });
    
    if (bcrypt.compareSync(password,user.password)) {
      return user.authorize();
    } else {
      throw new Error('invalid email/password');
    }    
  }


  //@ User model instance method
  User.prototype.authorize = async function () {
    const { AuthToken } = sequelize.models;
    const user = this
   
    const authToken = await AuthToken.generate(user,this.id);
    await user.addAuthToken(authToken);
    return { user, authToken }
  };


  //removing tokens based on passed token
  User.prototype.logout = async function (token) {
    sequelize.models.AuthToken.destroy({ where: { token } });
  };

  return User;
};