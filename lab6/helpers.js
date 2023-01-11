//You can add and export any helper functions you want here. If you aren't using any, then you can just leave this file as is.
const {ObjectId} = require('mongodb');
function checkIsString(str){
  // check that string exists and is of the proper typr(string) 
  if(str === undefined || typeof str !== 'string' || str.trim().length === 0){
    throw `${str || 'provided str'} is invalid`;
  }
}

function checkArray(array){
  if(!Array.isArray(array) || array.length === 0){
    throw `${array || 'provided array'} is not array`;
  }
  for(let i = 0; i < array.length; i++){
    if(typeof array[i] != 'string' || array[i].trim().length === 0){
      throw `No.${i + 1} item is not a string or is an empty string`
    }
  }
}

function checkID(id){
  if(!id) throw "You must provide an id";
  if (typeof id !== 'string') throw 'ID must be a string';
  id = id.trim();
  if (id.length === 0)
    throw 'ID cannot be an empty string or just spaces';
  if (!ObjectId.isValid(id)) throw `Error: ${movieId} invalid object ID`;
  return id;
}

function checkTitle(title){
  let titleinvalidFlag = false;
  let counter;
  title = title.trim();
  for(let i = 0; i < title.length; i++){
    var ch = title.charAt(i);
    if(!/[a-zA-Z]/g.test(ch) && typeof title[i] != 'string' && title[i] != " "){
      titleinvalidFlag = true;
      break;
    }else{
      counter += 1;
    }
  }
  if(titleinvalidFlag){
    throw 'title-No special characters or punctuation are allowed'
  }

  if(counter < 2){
    throw 'Title at least has two characters'
  }
}

function checkGenres(genres){
  let genresInvalidFlag = false;
  let counter1;
  for(let x of genres){
    x = x.trim();
    for(let i = 0; i < x.length; i++){
      var ch1 = x.charAt(i);
      if(/[a-zA-Z]/g.test(ch1) || ch1 === " "){
        counter1 += 1;
      }else{
        genresInvalidFlag = true;
        break;
      }
    }
    if(genresInvalidFlag){
      throw 'genres-No special characters or punctuation are allowed'
    }

    if(counter1 < 5){
      throw 'genres must be least five characters long'
    }
  }
}

function checkRating(rating){
  rating = rating.trim();
  if(rating != "G" && rating != "PG" && rating != "PG-13" && rating != "R" && rating != "NC-17"){
    throw 'Rating is not Valid values'
  }
}

function checkStudio(studio){
  studio = studio.trim();
  let studioInvalidFlag = false;
  let counter2;
  let spec; // to count one spection punctuation ' 
  for(let i = 0; i < studio.length; i++){
    var ch2 = studio.charAt(i);
    if(/[a-zA-Z]/g.test(ch2) || ch2 == " "){
      counter2 += 1;
    }else if(ch2 === "'"){
      counter2 += 1;
      spec += 1;
    }else{
      studioInvalidFlag = true;
      break;
    }
  }
  if(studioInvalidFlag){
    throw 'studio-No special characters or punctuation are allowed'
  }

  if(spec === studio.length){
    throw "Studio name cannot be all ' punctuation "
  }

  if(counter2 < 5){
    throw 'studio must be least five characters long'
  }
}

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

function getDecimalPart(num) {
  if (Number.isInteger(num)) {
    return '0';
  }
  const decimalStr = num.toString().split('.')[1];
  return decimalStr;
}

module.exports = {
  checkIsString,
  checkID,
  checkArray,
  checkTitle,
  checkGenres,
  checkRating,
  checkStudio,
  checkName,
  isValidDate,
  getDecimalPart
}