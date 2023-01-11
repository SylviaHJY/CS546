const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.user_collection;
const bcrypt = require('bcrypt');
const saltRounds = 16;
const { checkStringName, checkUserNameValid, checkPasswordString, checkPassword } = require('../helpers');

const createUser = async (
  username, password
) => {
  if(!username || !password){
    throw 'All fields need to have valid values.'
  }

  //check username
  checkStringName(username);
  checkUserNameValid(username);

  //check password
  checkPasswordString(password);
  checkPassword(password);

  //check duplicated username
  const usersCollection = await users();
  const user = await usersCollection.findOne({username: username.toLowerCase()});
  if(user) throw 'There is already a user with that username.'

  //hash password
  const hashPassword = await bcrypt.hash(password, saltRounds);

  //insert the username and hashed password into database.
  //create user
  let newUser = {
    username : username.toLowerCase(),
    password : hashPassword
  }

  const insertInfo = await usersCollection.insertOne(newUser);
  if (!insertInfo.acknowledged || !insertInfo.insertedId) throw 'Could not add movie';

  return {userInserted: true};
};

const checkUser = async (username, password) => {
  if(!username || !password){
    throw 'All fields need to have valid values.'
  }

  //check username
  checkStringName(username);
  checkUserNameValid(username);

  //check password
  checkPasswordString(password);
  checkPassword(password);

  //Query the db for the username supplied, if it is not found, throw an error
  const usersCollection = await users();
  const user = await usersCollection.findOne({username: username.toLowerCase()});
  if(user === null) throw 'Either the username or password is invalid.'

  const compareToPassword = await bcrypt.compare(password,user.password);
  if(compareToPassword){
    return {authenticatedUser: true};
  }else{
    throw 'Either the username or password is invalid.'
  }
};

module.exports = {createUser,checkUser};
