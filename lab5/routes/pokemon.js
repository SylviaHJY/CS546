//You will code the route in this file
//Lecture Code Refernece -> https://github.com/stevens-cs546-cs554/CS-546/tree/master/lecture_05/code/routes
const express = require('express');
const router = express.Router();
const data = require('../data');
const pokemonData = data.pokemon;

router
  .route('/')
//Request Method
  .get(async (req,res) => {
    try{
      const pokemonList = await pokemonData.pokemon();
      res.json(pokemonList);
    }catch(e){
      res.status(500).send(e);
    }
  })

router
  .route('/:id')
//Request Method
  .get(async (req,res) =>{
    try{
      const id = req.params.id;
      Number(id);
      // check id is valid - throw 400 error bc not proper
      if (isNaN(id) || id % 1 !== 0 || id < 0) {
        res.status(400).json({ message: 'Invalid URL Parameter'});
        return;
      }
      const pokemonPost = await pokemonData.pokemonById(req.params.id);
      res.json(pokemonPost);
    }catch(e){
      if(e.name === "AxiosError" && e.message === "Request failed with status code 404"){
        res.status(404).json({ message: 'Pokémon Not Found!'});
      }else{
        res.status(404).json(e);
      }
    }
  })

module.exports = router;