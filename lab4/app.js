/*

1. Create a Movie of your choice.
2. Log the newly created Movie. (Just that movie, not all movies)
3. Create another movie of your choice.
4. Query all movies, and log them all
5. Create the 3rd movie of your choice.
6. Log the newly created 3rd movie. (Just that movie, not all movies)
7. Rename the first movie
8. Log the first movie with the updated name. 
9. Remove the second movie you created.
10. Query all movies, and log them all
11. Try to create a movie with bad input parameters to make sure it throws errors.
12. Try to remove a movie that does not exist to make sure it throws errors.
13. Try to rename a movie that does not exist to make sure it throws errors.
14. Try to rename a movie passing in invalid data for the newName parameter to make sure it throws errors.
15. Try getting a movie by ID that does not exist to make sure it throws errors.

*/

const movies = require("./data/movies");
const connection = require('./config/mongoConnection');

const main = async () => {
  const db = await connection.dbConnection();
  await db.dropDatabase();
  
  // 1.Create a Movie of your choice.
  // 2.Log the newly created Movie. (Just that movie, not all movies)
  let TopGun;
  try{
    TopGun = await movies.createMovie("TopGun", "After thirty years, Maverick is still pushing the envelope as a top naval aviator. TOP GUN's elite graduates on a mission that demands the ultimate sacrifice from those chosen to fly it.", ["Action", "Drama"], "PG-13", "IMDbPro", "Joseph Kosinski", ["Tom Cruise", "Miles Teller", "Jennifer Connelly", "Val Kilmer"], "05/27/2022", "2h 10min");
    console.log(TopGun);
  }catch(e){
    console.log(e);
  }
  
  //3.Create another movie of your choice.
  let Shawshank;
  try{
    Shawshank = await movies.createMovie("The Shawshank Redemption", "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.", ["Crime", "Drama"], "PG", "IMDbPro", "Frank Darabont", ["Tim Robbins", "Morgan Freeman", "Bob Gunton", "William Sadler","Clancy Brown"], "10/14/1994", "2h 22min");
    // console.log(Shawshank);
  }catch(e){
    console.log(e);
  }

  //4.Query all movies, and log them all
  try{
    const movieslist1 = await movies.getAllMovies();
    console.log(movieslist1);
  }catch(e){
    console.log(e);
  }

  //5.Create the 3rd movie of your choice.
  //6.Log the newly created 3rd movie. (Just that movie, not all movies)
  let Godfather;
  try{
    Godfather = await movies.createMovie("The Godfather", "The aging patriarch of an organized crime dynasty in postwar New York City transfers control of his clandestine empire to his reluctant youngest son.", ["Crime", "Drama"], "NC-17", "IMDbPro", "Francis Coppola", ["Marlon Brando", "Al Pacino", "James Caan", "Diane Keaton","Robert Duvall"], "03/24/1972", "2h 55min");
    console.log(Godfather);
  }catch(e){
    console.log(e);
  }

  //7.Rename the first movie
  //8.Log the first movie with the updated name. 
  try{
    const updateTopGun = await movies.renameMovie(TopGun._id.toString(),"lucykk")
    console.log(updateTopGun);
  }catch(e){
    console.log(e);
  }

  //9.Remove the second movie you created.
  try{
    console.log(await movies.removeMovie(Shawshank._id.toString()))
  }catch(e){
    console.log(e)
  }

  //10.Query all movies, and log them all
  try{
    const movieslist2 = await movies.getAllMovies();
    console.log(movieslist2);
  }catch(e){
    console.log(e);
  }

  //11.Try to create a movie with bad input parameters to make sure it throws errors.
  let Breakfast;
  try{
    Breakfast = await movies.createMovie("The Breakfast Club","Five high school students meet in Saturday detention and discover how they have a lot more in common than they thought.",["Comedy", "Drama"],"pg-13","Universal Pictures","John Hughes",["Judd Nelson", "Molly Ringwald", "Ally Sheedy", "Anthony Hall", "Emilio Estevez"], "02/07/1985","1h 37min")
  }catch(e){
    console.log(e);
  }

  //12.Try to remove a movie that does not exist to make sure it throws errors.
  try{
    console.log(await movies.removeMovie('12345678f'))
  }catch(e){
    console.log(e)
  }

  //13.Try to rename a movie that does not exist to make sure it throws errors.
  try{
    const updateTopGun = await movies.renameMovie('632f5327ebff7c1e96f568f0',"Boo")
    console.log(updateTopGun);
  }catch(e){
    console.log(e);
  }

  //14.Try to rename a movie passing in invalid data for the newName parameter to make sure it throws errors.
  try{
    const updateTopGun = await movies.renameMovie(Godfather._id.toString(),123)
    console.log(updateTopGun);
  }catch(e){
    console.log(e);
  }

  //15.Try getting a movie by ID that does not exist to make sure it throws errors.
  try{
    const getMovie = await movies.getMovieById('633f54cbf58f4ff4b419d455')
    console.log(getMovie);
  }catch(e){
    console.log(e);
  }

  await connection.closeConnection();
  console.log('Done!');
};

main();