/*
Using JavaScript in your browser only, you will listen for the form's submit event; when the form is submitted, you will:
-Get the value of the input text element.  
-You should be expecting a variable number of arrays typed into the input separated by commas:  For example: [3,0,1,2,4], [1,2,8,15], [6,3,10,25,29]
-All array elements should be whole numbers (negative and 0 are allowed), no decimals. 
-Each array should have at least one element that is a whole number (negative and 0 are allowed), no decimals. 
-You can ignore any extra commas for example, inputting: [3,0,1,2,4], [1,2,8,15], [6,3,10,25,29], 
-There should be at least one array inputted. 
-You will then return a single array that has all the values from the arrays inputted sorted from lowest to highest number.  For example:  If our input was: [3,0,1,2,4], [1,2,8,15], [6,3,10,25,29] You would return:  [0,1,1,2,2,3,3,4,6,8,10,15,25,29]
-Add a list item to the #results list of result of the sort you have just completed. You will alternate the class for each list item using the classes is-green and is-red (described below), starting with is-green first.
-If the user does not have a value for the input when they submit, you should not continue processing and instead should inform them of an error somehow.
*/

function sortArray(){
  const myForm = document.getElementById('myForm');
  
  if(myForm){
    const errorDiv = document.getElementById('error');
    const resultList = document.getElementById('results');
    const InputArrays = document.getElementById('InputArrays');
    myForm.addEventListener('submit',function(event){
      event.preventDefault();
      try{
        const InputArraysValue = document.getElementById('InputArrays').value;
        arrayResult = processArray(InputArraysValue);
        //InputArrays.classList.remove('inputClass');
        errorDiv.hidden = true;
        let li = document.createElement("li");
        if(arrayResult.length !== 0){
          li.innerHTML = '[' + arrayResult.toString() + ']';
          resultList.appendChild(li);
          myForm.reset();
          InputArrays.focus();
        }
        const resultListValue = document.getElementById('results').getElementsByTagName("li");
        //This is a NodeList not an array, but it does have a .length and you can iterate over it like an array.
        for(let i = 0; i < resultListValue.length; i++){
          if(i % 2 === 0){
            resultListValue[i].classList.add("is-green");
          }else{
            resultListValue[i].classList.add("is-red");
          }
        }

      }catch(e){
        errorDiv.hidden = false;
        errorDiv.innerHTML = e;
        InputArrays.focus();
      }
    })
  }
  

  function processArray(str){
    let count1 = 0;
    let count2 = 0;
    for(let i = 0; i < str.length; i++){
      if(str.charAt(0) !== '['){
        throw 'First-Not valid arrays input';
      }

      if(str.charAt(str.length -1) === ","){
        if(str.charAt(str.length - 2) !== ']'){
          throw 'Last-Not valid arrays input';
        }
      }

      if(!isNaN(str.charAt(str.length -1))){
        throw 'Last-Not valid arrays input';
      }

      if(str.charAt(i) === '[' && str.charAt(i + 1) === ']'){
        throw 'Each array should have at least one element that is a whole number';
      }

      if(isNaN(str.charAt(1))){
        throw 'The first element is not a number.';
      }
      
      if(str.charAt(i) === ',' && str.charAt(i + 1) === ','){
       throw 'No extra commas between numbers or each arrays are allowed.';
      }
      
      if(str.charAt(i) !== ',' && isNaN(str.charAt(i)) && str.charAt(i) !== '[' && str.charAt(i) !== ']' && str.charAt(i) !== " "){
        throw 'No special characters or decimal numbers are allowed.';
      }
      
      if(str.charAt(i) === '[' && isNaN(str.charAt(i + 1)) || str.charAt(i) === ']' && isNaN(str.charAt(i - 1))){
        throw "There should be only number right before '[' or behind ']";
      }

      if(str.charAt(i) === '['){
        count1++;
      }

      if(str.charAt(i) === ']' ){
        count2++;
      }
    }
    if(count1 !== count2){
      throw " Missing'[' or ']'.";
    }

    let reg = /\s/g;
    str = str.replace(reg,"");
    //let reg1 = /\[/g;
    //let reg2 = /\]/g;
    str = str.replaceAll("[",",");
    str = str.replaceAll("]",",");
    str = str.split(',');
    let result = [];
    for(let i = 0; i < str.length; i++){
      if(!isNaN(str[i]) && str[i] !== ''){
        let item = parseInt(str[i])
        result.push(item)
      }
    }
    result.sort(function(a, b){return a - b});
    return result;
  }
};
