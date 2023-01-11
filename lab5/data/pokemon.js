//Your data modules to make the Axios calls and get the data
const axios = require('axios');
async function getPokemon(){
  const { data } = await axios.get('https://pokeapi.co/api/v2/pokemon')
  return data // this will be the array of pokemon objects
}

const pokemon = async () => {
  const pokemonIfo = await getPokemon();
  return pokemonIfo;
 };

const pokemonById = async (id) => {
  Number(id);
  if(isNaN(id) || (id % 1) !== 0 || id < 0){
    throw 'message: Invalid URL Parameter';
  }
  const { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
  if(!data) throw 'message: Pokémon Not Found!';
  return data;
};

module.exports = {
  pokemon,
  pokemonById
};