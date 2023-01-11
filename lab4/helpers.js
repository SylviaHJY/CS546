//You can add and export any helper functions you want here. If you aren't using any, then you can just leave this file as is.
function checkName(str){
   //declare an index to store space index
   let index = 0;
   for(let i = 0; i < str.length; i++){
     if(str.charAt(i) == " "){
       index = i;
       break;
     }  
   }
   if(index === 0){
     throw 'Name must have the following format "first name space last name"'
   }

  //first name and last name must be at least 3 characters 
  //each and only letters a-z or A-Z. No numbers or special characters or punctuation.
  let counter3;
  let directorInvalidFlag = false;
  //check first name
  for(let i = 0; i < index; i++){
    var ch3 = str.charAt(i);
    if(/[a-zA-Z]/g.test(ch3)){
      counter3 += 1;
    }else{
      directorInvalidFlag = true;
      break;
    }
  }
  if(directorInvalidFlag){
    throw 'firstName-No special characters or punctuation are allowed'
  }
  if(counter3 < 3){
    throw 'firstName must be least three characters long'
  }

  // remember to reset flag to traverse the rest string of director
  directorInvalidFlag = false;
  let counter4 = 0;
  //check last name
  for(let i = index + 1; i < str.length; i++){
    if(i === " "){
      throw 'There could not be multiple spaces between first name and last name'
    }else{
      var ch4 = str.charAt(i);
      if(/[a-zA-Z]/g.test(ch4)){
        counter4 += 1;
      }else{
        directorInvalidFlag = true;
        break;
      }
    }
  }
  if(directorInvalidFlag){
    throw 'lastName-No special characters or punctuation are allowed'
  }

  if(counter4 < 3){
    throw 'lastName must be least three characters long'
  }
}

// check isValidDate
function isValidDate(month,day,year) {
  // Assumes s is "mm/dd/yyyy"
  if(month > 12 || month < 1){
    throw "Month-Invalid"
  }

  if(day > 31 || day < 1){
    throw "Day-Invalid"
  }

  if((month == 4 || month == 6 || month == 9 || month == 11) && (day > 30)){
    throw "Days in this month should not greater than 30"
  }

  if(month == 2 && day > 28){
    throw " Day in this month should not greater than 28"
  }

  let currYear = new Date().getFullYear() + 2
  if(year < 1900 || year > currYear){
    throw "Only years 1900-2024 are valid values"
  }

}


module.exports = {
  checkName,
  isValidDate
}