//require express, express router and bcrypt as shown in lecture code
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const data = require('../data');
const { checkStringName, checkUserNameValid, checkPasswordString, checkPassword } = require('../helpers');
const usersData = data.users;

//If the user is authenticated, it will redirect to /protected.
//If the user is not authenticated, it will render a view with a login form. 
router
  .route('/')
  .get(async (req, res) => {
    //code here for GET
    if(req.session.user){ // user is authenticated
      console.log('[' + new Date().toUTCString() + ']: ' + req.method + ' ' + req.originalUrl + '(Authenticated User)');
      res.redirect('/protected');
    }else{ // user is not authenticated
      console.log('[' + new Date().toUTCString() + ']: ' + req.method + ' ' + req.originalUrl + '(Non-Authenticated User)');
      res.status(401).render('../views/userLogin',{title:"Welcome to login!"});
    }
  })

//If the user is authenticated, it will redirect to /protected.
//If the user is not authenticated, this route will render a view with a sign-up form. The form will contain two inputs, one for the username and one for password. 
//Post: You must make sure that usernameInput and passwordInput are supplied in the req.body
router
  .route('/register')
  .get(async (req, res) => {
    //code here for GET
    if(req.session.user){
      console.log('[' + new Date().toUTCString() + ']: ' + req.method + ' ' + req.originalUrl + '(Authenticated User)');
      res.redirect('/protected');
    }else{
      console.log('[' + new Date().toUTCString() + ']: ' + req.method + ' ' + req.originalUrl + '(Non-Authenticated User)');
      res.render('../views/userRegister',{title:"Welcome to register!"});
    }
  })
  .post(async (req, res) => {
    //code here for POST
    const userName = req.body.usernameInput;
    const passWord = req.body.passwordInput;
    if(!userName || !passWord){
      error = 'All fields need to have valid values';
      console.log('[' + new Date().toUTCString() + ']: ' + req.method + ' ' + req.originalUrl + '(Non-Authenticated User)');
      res.status(400).render('../views/userRegister',{error:error,  title:"Welcome to register!"});
      return;
    }

    try{
      checkStringName(userName);
      checkUserNameValid(userName);
      checkPasswordString(passWord);
      checkPassword(passWord);
    }catch(e){
      console.log('[' + new Date().toUTCString() + ']: ' + req.method + ' ' + req.originalUrl + '(Non-Authenticated User)');
      res.status(400).render('../views/userRegister',{error:e,  title:"Welcome to register!"});
      return;
    }

    try{
      const createUser = await usersData.createUser(userName,passWord);
      if(JSON.stringify(createUser) === JSON.stringify({userInserted: true})){
        console.log('[' + new Date().toUTCString() + ']: ' + req.method + ' ' + req.originalUrl + '(Authenticated User)');
        //req.session.user = {username:userName}; //if not command, will login automatically. Go to '/', then "/protected",render user information.
        return res.redirect('/');
      }else{
        console.log('[' + new Date().toUTCString() + ']: ' + req.method + ' ' + req.originalUrl + '(Non-Authenticated User)');
        res.status(500).json({message: "Internal Server Error"});
      }
    }catch(e){
      console.log('[' + new Date().toUTCString() + ']: ' + req.method + ' ' + req.originalUrl + '(Non-Authenticated User)');
      res.status(400).render('../views/userRegister',{error:e, title:"Welcome to register!"});
    }
  })
 

router
  .route('/login')
  .post(async (req, res) => {
    //code here for POST
    const userName = req.body.usernameInput;
    const passWord = req.body.passwordInput;
    if(!userName || !passWord){
      error = 'All fields need to have valid values';
      console.log('[' + new Date().toUTCString() + ']: ' + req.method + ' ' + req.originalUrl + '(Non-Authenticated User)');
      res.status(400).render('../views/userLogin',{error:error, title:"Welcome to login!"});
      return;
    }

    try{
      checkStringName(userName);
      checkUserNameValid(userName);
      checkPasswordString(passWord);
      checkPassword(passWord);
      //console.log("Success!")
    }catch(e){
      console.log('[' + new Date().toUTCString() + ']: ' + req.method + ' ' + req.originalUrl + '(Non-Authenticated User)');
      res.status(400).render('../views/userLogin',{error:e, title:"Welcome to login!"});
      return;
    }

    try{
      const checkUser = await usersData.checkUser(userName,passWord);
      //console.log('Yea');
      // if not matched, back to login with error message
      if(JSON.stringify(checkUser) === JSON.stringify({authenticatedUser: true})){
        console.log('[' + new Date().toUTCString() + ']: ' + req.method + ' ' + req.originalUrl + '(Authenticated User)');
        req.session.user = {username:userName};
        res.redirect('/protected');
      }
    }catch(e){
      console.log('[' + new Date().toUTCString() + ']: ' + req.method + ' ' + req.originalUrl + '(Non-Authenticated User)');
      //error = "Either the username or password is invalid."
      res.status(400).render('../views/userLogin',{error:e, title:"Welcome to login!"});
    }
  })

//This route will be protected your own authentication middleware to only allow valid, logged in users to see this page.
//If the user is logged in, you will make a simple view that displays the username (which you stored in the session when they logged in) 
//for the currently logged in user as well as the current date/time.
router
  .route('/protected')
  .get(async (req, res) => {
    //code here for GET
    if(req.session.user){
      console.log('[' + new Date().toUTCString() + ']: ' + req.method + ' ' + req.originalUrl + '(Authenticated User)');
      res.render('../views/private',{ username: req.session.user.username, currentTime: new Date().toUTCString(),title:"Successfully authenticated!"});
    }else{
      console.log('[' + new Date().toUTCString() + ']: ' + req.method + ' ' + req.originalUrl + ' (Non-Authenticated User)');
      error = "Error page saying that the user is not logged in";
      res.status(401).render('../views/forbiddenAccess',{error:error, title:"Non-Authenticated!"});
    }
  })

//This route will expire/delete the AuthCookie and inform the user that they have been logged out.
router
  .route('/logout')
  .get(async (req, res) => {
    //code here for GET
    req.session.destroy();
    console.log('[' + new Date().toUTCString() + ']: ' + req.method + ' ' + req.originalUrl + '(Authenticated User)');
    res.render('../views/logout',{title:"Logout!"});
  });

  module.exports = router;
