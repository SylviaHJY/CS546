//Require express and express router as shown in lecture code and worked in previous labs
const express = require('express');
const router = express.Router();
const data = require('../data');
const peopleData = data.people;
const path = require('path');

router.route("/").get(async (req, res) => {
  //code here for GET
  res.sendFile(path.resolve('static/homepage.html'));
});

router.route("/searchpeople").post(async (req, res) => {
  //code here for POST
  let name = req.body.searchPersonName;
  let errors = [];
  if(!name){
    errors.push("Person Name is not given")
  }
  if(typeof(name) !== 'string'){
    errors.push("People name should be string")
  }
  if(name.trim().length === 0){
    errors.push("People name need to have valid values")
  }
  if (errors.length > 0) {
    res.status(400).render("error", {
      errors: errors,
      title: "Error"
    });
    return;
  }

  try{
    const createList = await peopleData.searchPeopleByName(name);
    if(createList.length === 0){
      res.status(404).render("personNotFound",{
        title: "People Not Found",
        searchPersonName: name
      });
      return;
    }else{
      res.status(200).render("peopleFound",{
        title:"People Found",
        searchPersonName: name,
        peopleFound:createList
      })
    }
  }catch(e){
    errors.push(e);
    res.status(400).render("error", {
      errors: errors,
      title: "Error"
    });
    return;
  }
});

router.route("/persondetails/:id").get(async (req, res) => {
  //code here for GET
  let id = req.params.id;
  id = Number(id);
  let errors = [];
    if(!id){ // check if id is given
      errors.push("No valid id is given.");
    }
    if(isNaN(id)){ // check if id is not a number
      errors.push("Id should be a number.");
    }
    //check if id out of bound
    //const peopleInfo = await peopleData.getAllPeople();
    //|| id >= peopleInfo.length(it could be on 404 page);
    if(id <= 0){
      errors.push( "Id is out of bound.")
    }
    if (errors.length > 0) {
      res.status(400).render("error", {
        errors: errors,
        title: "Error"
      });
      return;
    }

    try{
      const peopleByID = await peopleData.searchPeopleByID(id);
      if(peopleByID.length === 0){
        return res.status(404).render("personNotFound",{
          title:"People Not Found",
          searchPersonName: `id: ${id}`
        })
      }else{
        res.status(200).render("personFoundByID",{title:"Person Found",peopleInfo: peopleByID[0]});
      }       
    }catch(e){
        errors.push(e);
        res.status(400).render("error", {
        errors: errors,
        title: "Error"
      });
      return;
      
    }
});

module.exports = router;