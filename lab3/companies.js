const axios = require('axios');
async function getCompany(){
  const { data } = await axios.get('https://gist.githubusercontent.com/graffixnyc/90b56a2abf10cfd88b2310b4a0ae3381/raw/f43962e103672e15f8ec2d5e19106e9d134e33c6/companies.json')
  return data // this will be the array of people objects
}

async function getPeople(){
  const { data } = await axios.get('https://gist.githubusercontent.com/graffixnyc/448017f5cb43e0d590adb744e676f4b5/raw/495e09557914db5d2f40141aaef60113eb19bb41/people.json')
  return data // this will be the array of people objects
}

// check str parameter exists and is of the proper type (string)
function checkString(str){
  if(typeof str === undefined || typeof str !== "string"){
    throw `${str || 'provided str'} is invalid`
  }
}

//check the companyName parameter is not just empty spaces
function checkStringSpaces(str){
  if(str.trim().length === 0){
    throw "Parameter with just empty spaces is invalid"
  }
}

//declare a fuction to sort the names in array alphabetically by last name

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

const listEmployees = async (companyName) => {
  //check companyName
  checkString(companyName);
  checkStringSpaces(companyName);
  const companyIfo = await getCompany();
  const peopleIfo = await getPeople();

  companyName = companyName.trim();
  //declare an empty array to store information from companies.json and people.json
  let result = [];
  //declare an empty array to store employees name
  let array = [];
  // declare an empty object to store employees object
  let obj ={};
  let companyId;
  for(let i = 0; i < companyIfo.length; i++){
    if(companyName.toLowerCase() === companyIfo[i]["name"].toLowerCase()){
      result.push(companyIfo[i]);
      companyId = companyIfo[i]["id"];
    }
  }if(result.length === 0){
    throw `No company name with ${companyName}`
  }

  for(let i = 0; i < peopleIfo.length; i++){
    if(companyId === peopleIfo[i]["company_id"]){
      let str = peopleIfo[i]["first_name"] + " " + peopleIfo[i]["last_name"];
      array.push(str)
    }
  }
  array.sort(compare);
  
  obj.employess = array;
  result.push(obj);
  // convert result array to object
  let finalObj = {};
  // loop elements of the array 
  for(let i = 0; i < result.length; i++ ) {
    Object.assign(finalObj, result[i]);
  }
  return finalObj;

};

const sameIndustry = async (industry) => {
  // check industry parameter 
  checkString(industry);
  checkStringSpaces(industry);
  const companyIfo = await getCompany();

  industry = industry.trim();
  // declare an empty array to store results
  let result = [];
  for(let i = 0; i < companyIfo.length; i++){
    if(industry.toLowerCase() === companyIfo[i]["industry"].toLowerCase()){
      result.push(companyIfo[i]);
    }
  }if(result.length === 0){
    throw "No companies in that industry"
  }else{
    return result
  }

};

const getCompanyById = async (id) => {
  // check id parameter
  checkString(id);
  checkStringSpaces(id);
  const companyIfo = await getCompany();

  let i = 0;
  for(; i < companyIfo.length; i++){
    if(id === companyIfo[i]["id"]){
      return companyIfo[i]
    }
  }if(i === companyIfo.length){
    throw "Company not found"
  }
};

module.exports = {
  listEmployees,
  sameIndustry,
  getCompanyById
};
