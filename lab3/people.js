const axios = require('axios');
async function getPeople(){
  const { data } = await axios.get('https://gist.githubusercontent.com/graffixnyc/448017f5cb43e0d590adb744e676f4b5/raw/495e09557914db5d2f40141aaef60113eb19bb41/people.json')
  return data // this will be the array of people objects
}

//check the city and state parameters exists and are of proper type (strings)
function checkString(str1,str2){
  if(typeof str1 === undefined || typeof str2 === undefined ||
    typeof str1 !== "string" || typeof str2 !== "string"){
    throw "Invalid Input"
  }
}

function checkStringSpaces(str1,str2){
  if(str1.trim().length === 0 || str2.trim().length === 0){
    throw "Input with just spaces is invalid"
  }
}

//declare a function to sort the names in array alphabetically by last name

// first we need to create a compare function 
// to change how sorting works. 
// Get two names to compare (a and b)
function compare (a,b) {
 
  //split the names as strings into arrays
  var aName = a.split(" ");
  var bName = b.split(" ");
 
  // get the last names by selecting
  // the last element in the name arrays
  // using array.length - 1 since full names
  // may also have a middle name or initial
  var aLastName = aName[aName.length - 1];
  var bLastName = bName[bName.length - 1];
 
  // compare the names and return either
  // a negative number, positive number
  // or zero.
  if (aLastName < bLastName) return -1;
  if (aLastName > bLastName) return 1;
  return 0;
}


const getPersonById = async (id) => {
  const peopleIfo = await getPeople();
  //check the id  parameter exists and is of proper type (string)
  if(typeof id === undefined || typeof id !== "string"){
    throw `${id || 'provided id'} is invalid`
  }
  //check the id exists and is in the proper type 
  if(id.length === 0){
    throw `${id || 'provided id'} is invalid`
  }

  //check the id  parameter is just empty spaces
  if(id.trim().length === 0){
    throw "Id with just empty spaces is invalid"
  }

  //the id is not found in the array of people, throw a 'person not found' error.
  //declare an empty array to store peopleIfo IDs
  let IDs = [];
  for(let i = 0; i < peopleIfo.length; i++){
    IDs.push(peopleIfo[i]["id"])
  }

  for(let i = 0; i < IDs.length; i++){
   if(IDs.includes(id) === false){
    throw "People not found"
   }else if(id === IDs[i]){
    return peopleIfo[i]
   }
  }
};

const sameJobTitle = async (jobTitle) => {
  const peopleIfo = await getPeople();
  //check the jobTitle parameter exists and is of proper type (string)
  if(typeof jobTitle === undefined || typeof jobTitle !== "string"){
    throw `${jobTitle || 'provided jobTitle'} is invalid`
  }

  // check jobTitle is just empty spaces
  if(jobTitle.trim().length === 0){
    throw "jobTitle with just empty spaces is invalid"
  }

  jobTitle = jobTitle.trim();
  // declare an empty map to count repeat jobTitle
  let map = {};
  //let jobTitle as map's key, jobTitle repeat time as map's value
  for(let i = 0; i < peopleIfo.length; i++){
    // if the keys already exists, means that jobTitle repeats
    if(peopleIfo[i]["job_title"] in map){
      map[peopleIfo[i]["job_title"]] += 1;
    }else{
      // the first time find the key
      //make a new key and set its value to 1
      map[peopleIfo[i]["job_title"]] = 1;
    }
  }

  //declare an empty array to store results
  let result = [];

  // store map's key so we could find repeat moree than two times jobTitle
  let mapKeys = Object.keys(map);
  
  //parameter must be case in-sensitive 
  let mapKeys1 = [];
  for(let i = 0; i < mapKeys.length; i++){
    mapKeys1[i] = mapKeys[i].toLowerCase()
  }

  let jobTitle1 = jobTitle.toLowerCase()
  for(let i = 0; i < mapKeys1.length; i++){
    // if job title not exist
    if(mapKeys1.includes(jobTitle1) === false){
      throw "JobTitle not found"
    }

    if(jobTitle.toLowerCase() === mapKeys1[i]){
      if(map[mapKeys[i]] >= 2){
        for(let i = 0; i < peopleIfo.length; i++){
          if(peopleIfo[i]["job_title"].toLowerCase() === jobTitle.toLowerCase()){
            result.push(peopleIfo[i]);
          }
        }
        return result;
      
        // if there are not two people with that job title
      }else if (map[mapKeys[i]] === 1){
        throw "There are not two people with that job title"
      }
    }
  }
};

const getPostalCodes = async (city, state) => {
  const peopleIfo = await getPeople();
  //check the city and state parameters 
  checkString(city,state);
  checkStringSpaces(city,state)

  city = city.trim();
  state = state.trim();

  //declare an empty array to store result
  let array =[];
  for(let i = 0; i < peopleIfo.length; i++){
    if(peopleIfo[i]["city"].toLowerCase() === city.toLowerCase()
     ){
      if(peopleIfo[i]["state"].toLowerCase() === state.toLowerCase()){
      array.push(parseInt(peopleIfo[i]["postal_code"]));
      }
    }
  }if(array.length === 0){
    throw "There are no postal_codes for the given city and state combination";
  }else{
     //By default, the sort() function sorts values as strings
     //the default behavior of sort() is to order the array alphabetically
    //You can fix this by providing a compare function
    return array.sort(function(a, b){return a - b})
  }

};

const sameCityAndState = async (city, state) => {
  const peopleIfo = await getPeople();
  //check the city and state parameters 
  checkString(city,state);
  checkStringSpaces(city,state)

  city = city.trim();
  state = state.trim();

  //declare an empty array to store results
  let array = []
  for(let i = 0; i < peopleIfo.length; i++){
    if(peopleIfo[i]["city"].toLowerCase() === city.toLowerCase()
     ){
      if(peopleIfo[i]["state"].toLowerCase() === state.toLowerCase()){
      let str = peopleIfo[i]["first_name"] + " " + peopleIfo[i]["last_name"];
      array.push(str);
      }
    }
  }if(array.length === 0 || array.length === 1){
    throw "There are not two people who live in the same city and state";
  }else{
    //call compare function to sort the names in array alphabetically by last name
    return array.sort(compare);
  }

};

module.exports = {
  getPersonById,
  sameJobTitle,
  getPostalCodes,
  sameCityAndState
};
