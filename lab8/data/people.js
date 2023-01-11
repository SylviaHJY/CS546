//Axios call to get all data
const axios = require('axios');
const getAllPeople = async () => {
  const { data } = await axios.get('https://gist.githubusercontent.com/robherley/5112d73f5c69a632ef3ae9b7b3073f78/raw/24a7e1453e65a26a8aa12cd0fb266ed9679816aa/people.json')
  return data;
};

//Function to list of up to 20 people matching the searchPersonName (sorted by id)
const searchPeopleByName = async (searchPersonName) => {
  const peopleInfo = await getAllPeople();
  //check the searchPersonName parameter exists and is of proper type (string)
  if(typeof searchPersonName === undefined || typeof searchPersonName !== "string"){
    throw "provided searchPersonName is invalid"
  }

  // check jobTitle is just empty spaces
  if(searchPersonName.trim().length === 0){
    throw "searchPersonName with just empty spaces is invalid"
  }

  searchPersonName = searchPersonName.trim();
  let nameArray = searchPersonName.split(" ");
  let fName;
  let lName;
  if(nameArray.length > 1){
    fName = nameArray[0];
    lName = nameArray[1];
  }else{
    fName = nameArray[0]
  }
  //declare an array to store results
  let array = [];
  for(let i = 0; i < peopleInfo.length; i++){
   if(nameArray.length > 1){
    if(peopleInfo[i]["firstName"].toLowerCase() === fName.toLowerCase()
    && peopleInfo[i]["lastName"].toLowerCase() === lName.toLowerCase()){
      array.push(peopleInfo[i])
    }
   }else{
    if(peopleInfo[i]["firstName"].toLowerCase().includes(fName.toLowerCase())
    || peopleInfo[i]["lastName"].toLowerCase().includes(fName.toLowerCase())){
      array.push(peopleInfo[i])
    }
   }
  }if(array.length === 0){
    //throw `We're sorry, but no results were found for ${searchPersonName}`
    return array;
  }else{
    return array.sort((p1, p2) => (p1.id > p2.id) ? 1 : (p1.id > p2.id) ? -1 : 0).slice(0,20);
  }
};

//Function to list person matching the id
const searchPeopleByID = async (id) => {
  const peopleInfo = await getAllPeople();
  id= Number(id);
  //check the id  parameter exists and is of proper type (number)
  if(typeof id === undefined || !Number.isInteger(id)){
    throw `${id || 'provided id'} is invalid`
  }

  //check if id out of bound
  //|| id >= peopleInfo.length (but it could be 404 page)
  if(id <= 0 ){
    throw "Id is out of bound."
  }

  //the id is not found in the array of people, throw a 'person not found' error.
  //declare an empty array to store peopleIfo IDs
  //let IDs = [];
  //for(let i = 0; i < peopleInfo.length; i++){
  //  IDs.push(peopleInfo[i]["id"])
  //}

  // for(let i = 0; i < IDs.length; i++){
  //  if(IDs.includes(id) === false){
  //   throw "People not found"

  //  }else if(id === IDs[i]){
  //   return peopleInfo[i]
  //  }
  // }
  const result = peopleInfo.filter(r => r.id === id); 
  return result; //return an array
};

module.exports = {
  searchPeopleByName, 
  searchPeopleByID };
