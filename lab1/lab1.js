function questionOne(arr) {
  // TODO: Implement question 1 here
  for(i = 0; i < arr.length; i++){
    // check if number is equal to 0
    if(arr[i] === 0){
      arr[i] = false;
    } 
    // check if number is equal to 1
    else if(arr[i] === 1){
      arr[i] = false;
    }
    // check if number is equal to 2
    else if(arr[i] === 2){
       arr[i] = true;
    }
    // check if number is less than 0 
    else if(arr[i] < 0){
      arr[i] = false;
    }
    // check if number is greater than 2
    else if(arr[i] > 2){
      for(var x = 2;x < arr[i]; x++){
        if(arr[i] % x == 0){
          arr[i] = false;
          break;
        }
      }
      if(Number.isInteger(arr[i])){
        arr[i] = true;
      }
    }
    // if it is not a num
    else{
      arr[i] = false;
    }   
  }
  return arr;
}

function questionTwo(startingNumber, commonRatio, numberOfTerms) {
  // TODO: Implement question 2 here
  var sum = startingNumber;
  var num = startingNumber;
  if(startingNumber === 0){
    return 0;
  }
  if(commonRatio === 0){
    return 0;
  }
  // check if it's a positive whole number greater than 0
  if(numberOfTerms <= 0 || numberOfTerms % 1 != 0){
    return NaN;
  }
  else{
    for(i = 2; i <= numberOfTerms; i++){
      num *= commonRatio;
      sum += num;
    }
    return sum;
  }
}


function questionThree(str) {
  // TODO: Implement question 3 here
  var count = 0;
  for(var i = 0; i < str.length; i++){
    // check if it's a letter
    if(/^[a-zA-Z]+$/.test(str[i])){
      if((str[i].toLowerCase() !== "a" && str[i].toLowerCase() !== "e" && 
      str[i].toLowerCase() !== "i" && str[i].toLowerCase() !== "o" 
      && str[i].toLowerCase() !== "u" && str[i] !== " ")){
        count++;
      }
    }
  }
  return count;
}

function questionFour(fullString, substring) {
  // TODO: Implement question 4 here
  if (substring.length == 0) {
    throw 'Invalid substring.'
  } 
  let count = 0;
  let i = 0;
  let j = 0;
  var curr = -1;
  var isScan = false;
  while(i < fullString.length){
    if(fullString[i] == substring[j]){
      if(!isScan){
        curr = i + 1;
        isScan = true;
      }
      i++;
      j++;
      if( j == substring.length){
        count += 1;
        j = 0;
        curr = -1;
        isScan = false;
      }
    }else{
      if(curr == -1){
        i++;
        j = 0;
      }else{
        i = curr;
        curr = -1;
        j = 0;
        isScan = false;
      }      
    }
  }
  return count;   
}

//TODO:  Change the values for firstName, lastName and studentId
module.exports = {
  firstName: 'Jiayin',
  lastName: 'Huang',
  studentId: '10477088',
  questionOne,
  questionTwo,
  questionThree,
  questionFour,
};
