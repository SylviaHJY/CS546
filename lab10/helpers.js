//You can add and export any helper functions you want here. If you aren't using any, then you can just leave this file as is.
function checkStringName(name){
  if(typeof name != "string"){
    throw 'User name should be valid string.'
  }

  if(name.trim().length === 0){
    throw 'User name should not be empty spaces.'
  }

  for(let i =0; i < name.length; i++){
    if(name.charAt(i) === " "){
      throw 'UserName-No empty spaces, no spaces in the username and only alphanumeric characters are allowed.'
    }
  }
}

function checkUserNameValid(name){
  let nameValidFlag = false;
  let counter = 0;
  for(let i = 0; i < name.length; i++){
    var ch = name.charAt(i);
    if(!/[a-zA-Z]/g.test(ch) && isNaN(ch)){
      nameValidFlag = true;
      break;
    }else{
      counter += 1;
    }
  }
  if(counter < 4){
    throw 'User name should be at least 4 characters long.'
  }
  if(nameValidFlag){
    throw 'UserName-No empty spaces, no spaces in the username and only alphanumeric characters are allowed.'
  }
}

function checkPasswordString(password){
  if(typeof password != "string"){
    throw 'password should be valid string.'
  }
  if(password.trim().length === 0){
    throw 'password should not be all empty spaces.'
  }
}
function checkPassword(password){
  //The constraints for password will be: There needs to be at least one uppercase character, 
  //there has to be at least one number and there has to be at least one special character,
  //at least 6 characters long
  //var regex = /^[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]{6,}$/g;
  for(let i = 0; i < password.length; i ++){
    if(password.charAt(i) === " "){
      throw 'No spaces between password.'
    }
  }
  let strongPassword = new RegExp('(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,})')
  if(!strongPassword.test(password)){
    throw 'Not valid password-At least one upper case character,at least one number,at least one special character,at least 6 character.'
  }
}

module.exports = {
  checkStringName,
  checkUserNameValid,
  checkPasswordString,
  checkPassword
}