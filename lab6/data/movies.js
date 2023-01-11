const mongoCollections = require('../config/mongoCollections');
const movies = mongoCollections.movies;
const {ObjectId} = require('mongodb');
const { checkIsString, checkTitle, checkArray, checkGenres, checkStudio, checkName, isValidDate, checkRating } = require('../helpers');


const createMovie = async (
  title,
  plot,
  genres,
  rating,
  studio,
  director,
  castMembers,
  dateReleased,
  runtime
) => {
  // check all the fields are valid
  if(!title || !plot || !genres || !rating || !studio || !director 
    || !castMembers || !dateReleased || !runtime){
     throw 'All fields need to have valid values'
    }
  
  //check title
  checkIsString(title);
  checkTitle(title);

  //check plot
  checkIsString(plot);
  plot = plot.trim();

  //check genres
  checkArray(genres);
  checkGenres(genres);

  //check rating
  checkIsString(rating);
  checkRating(rating);

  //check studio
  checkIsString(studio);
  checkStudio(studio);

  //check director
  checkIsString(director);
  director = director.trim();
  checkName(director);

  //check castMembers
  checkArray(castMembers);
  for(let i = 0; i < castMembers.length; i++){
    castMembers[i] = castMembers[i].trim();
    checkName(castMembers[i]);
  }

  //check dateReleased
  checkIsString(dateReleased);
  let result = dateReleased.split("/");
  if(result[0].length != 2 || result[1].length !=2 || result[2].length !=4){
    throw 'The format of the date must be in mm/dd/yyyy format'
  }
  let month = result[0];
  let day = result[1];
  let year = result[2];

  //check month, day, year isNaN
  if(isNaN(month) || isNaN(day) || isNaN(year)){
    throw "Date must be number only"
  }

  // parse str date
  month = parseInt(month);
  day = parseInt(day);
  year = parseInt(year);

  //check is month, day, year range correct
  isValidDate(month,day,year);
  
  //check runtime
  checkIsString(runtime);
  var regex = /^[0-9]*[1-9](h )0*[0-5]{0,1}[0-9](min)$/g;
  if(!regex.test(runtime)){
    throw 'MUST be in the following format "#h #min". '
  }

  //create movie
  const moviesCollection = await movies();
  let newMovie = {
    title: title,
    plot: plot,
    genres: genres,
    rating: rating,
    studio: studio,
    director: director,
    castMembers: castMembers,
    dateReleased: dateReleased,
    runtime: runtime,
    reviews: [],
    overallRating: 0
  }

  const insertInfo = await moviesCollection.insertOne(newMovie);
  if (!insertInfo.acknowledged || !insertInfo.insertedId)
      throw 'Could not add movie';

  const newId = insertInfo.insertedId.toString();
  const movie = await getMovieById(newId);
  // movie._id = movie._id.toString();
  return movie;   
};

const getAllMovies = async () => {
  const moviesCollection = await movies();

  const movieList = await moviesCollection.find({}).toArray();

  for(let i = 0; i < movieList.length; i++){
    movieList[i]._id = movieList[i]._id.toString();
  }

  if (!movieList){
    movieList = [];
  };

  return movieList;
};

const getMovieById = async (movieId) => {
  //check to make sure we have input at all
  if (!movieId) throw 'You must provide an id to search for';

  //check to make sure it's a string
  if (typeof movieId !== 'string') throw 'Id must be a string';

  //check to make sure it's not all spaces
  if (movieId.trim().length === 0) throw 'Id cannot be an empty string or just spaces';

  //Now we check if it's a valid ObjectId so we attempt to convert a value to a valid object ID,
  movieId = movieId.trim();
  if (!ObjectId.isValid(movieId)) throw 'invalid object ID';
  
  const moviesCollection = await movies();
  const movie = await moviesCollection.findOne({ _id: ObjectId(movieId)});
  if (movie === null) throw 'no movie with that id';

  //The output does not have ObjectId() around the ID field and no quotes around the key names,
  // your function needs to return it as shown.
  movie._id = movie._id.toString();
  return movie;
};

const removeMovie = async (movieId) => {
  //check ID as getMovieByID
  if (!movieId) throw 'You must provide an id to search for';
  if (typeof movieId !== 'string') throw 'Id must be a string';
  if (movieId.trim().length === 0) throw 'id cannot be an empty string or just spaces';
  movieId = movieId.trim();
  if (!ObjectId.isValid(movieId)) throw 'invalid object ID';

  //convert string ID to ObjectID while we need to do operation
  const moviesCollection = await movies();
  const movie = await getMovieById(movieId);
  const deletionInfo = await moviesCollection.deleteOne({_id: ObjectId(movieId)});

  if (deletionInfo.deletedCount === 0) {
    throw `Could not delete movie with id of ${movieId}`;
  }
  return movie.title + " has been successfully deleted!";
};

const updateMovie = async (
  movieId,
  title,
  plot,
  genres,
  rating,
  studio,
  director,
  castMembers,
  dateReleased,
  runtime
) => {
  const moviesCollection = await movies();
  const updatedMovieData = {};
  // check all the fields are valid
  if(!movieId || !title || !plot || !genres || !rating || !studio || !director || !castMembers || !dateReleased || !runtime){
     throw 'All fields need to have valid values'
  }
  const oldMovie = await getMovieById(movieId);
  
  //check movieID
  checkIsString(movieId);
  movieId = movieId.trim();
  if (!ObjectId.isValid(movieId)) throw 'invalid object ID';

  //check if title and checkStrings
  if(title){
    checkIsString(title);
    checkTitle(title);
    updatedMovieData.title = title;
  }

  //check if plot and checkStrings
  if(plot){
    checkIsString(plot);
    plot = plot.trim();
    updatedMovieData.plot = plot;
  }

  //check if genres and checkArrays
  if(genres){
    checkArray(genres);
    checkGenres(genres);
    updatedMovieData.genres = genres;
  }

  //check if rating and checkStrings
  if(rating){
    checkIsString(rating);
    checkRating(rating);
    updatedMovieData.rating = rating;
  }

  //check if studio and checkStrings
  if(studio){
    checkIsString(studio);
    checkStudio(studio);
    updatedMovieData.studio = studio;
  }

  //check if director and checkStrings
  if(director){
    checkIsString(director);
    director = director.trim();
    checkName(director);
    updatedMovieData.director = director;
  }

  //check if castMembers and checkArray
  if(castMembers){
    checkArray(castMembers);
    for(let i = 0; i < castMembers.length; i++){
      castMembers[i] = castMembers[i].trim();
      checkName(castMembers[i]);
    }
    updatedMovieData.castMembers = castMembers;
  }

  //check if dateReleased and checkDate
  if(dateReleased){
    checkIsString(dateReleased);
    let result = dateReleased.split("/");
    if(result[0].length != 2 || result[1].length !=2 || result[2].length !=4){
      throw 'The format of the date must be in mm/dd/yyyy format'
    }
    let month = result[0];
    let day = result[1];
    let year = result[2];
  
    //check month, day, year isNaN
    if(isNaN(month) || isNaN(day) || isNaN(year)){
      throw "Date must be number only"
    }
  
    // parse str date
    month = parseInt(month);
    day = parseInt(day);
    year = parseInt(year);
  
    //check is month, day, year range correct
    isValidDate(month,day,year);
    updatedMovieData.dateReleased = dateReleased;
  }

  //check if run time and checkFormat
  if(runtime){
    checkIsString(runtime);
    var regex = /^[0-9]*[1-9](h )0*[0-5]{0,1}[0-9](min)$/g;
    if(!regex.test(runtime)){
      throw 'MUST be in the following format "#h #min". '
    }
    updatedMovieData.runtime = runtime;
  }
  updatedMovieData.reviews = oldMovie.reviews;
  updatedMovieData.overallRating = oldMovie.overallRating;
  //update MovieData
  const updateData = await moviesCollection.updateOne(
    {_id: ObjectId(movieId)},
    {$set: updatedMovieData}
  );
  if (updateData.modifiedCount === 0) {
    throw 'could not update reviews successfully';
  }

  return await getMovieById(movieId);
};

// const renameMovie = async (id, newName) => {
//   //Not used for this lab
// };

module.exports = {
  createMovie,
  getAllMovies,
  getMovieById,
  removeMovie,
  updateMovie
};
