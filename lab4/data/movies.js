const mongoCollections = require('../config/mongoCollections');
const movies = mongoCollections.movies;
const {ObjectId} = require('mongodb');
const { checkName, isValidDate } = require('../helpers');

function checkIsString(str){
  // check that string exists and is of the proper typr(string) 
  if(str === undefined || typeof str !== 'string' || str.trim().length === 0){
    throw `${str || 'provided str'} is invalid`;
  }
}

function checkArray(array){
  if(!Array.isArray(array) || array.length === 0){
    throw `${array || 'provided array'} is not array`;
  }
  for(let i = 0; i < array.length; i++){
    if(typeof array[i] != 'string' || array[i].trim().length === 0){
      throw `No.${i + 1} item is not a string or is an empty string`
    }
  }
}


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
  
  // check title
  checkIsString(title);
  let titleinvalidFlag = false;
  let counter;
  title = title.trim();
  for(let i = 0; i < title.length; i++){
    var ch = title.charAt(i);
    if(!/[a-zA-Z]/g.test(ch) && typeof title[i] != 'string' && title[i] != " "){
      titleinvalidFlag = true;
      break;
    }else{
      counter += 1;
    }
  }
  if(titleinvalidFlag){
    throw 'title-No special characters or punctuation are allowed'
  }

  if(counter < 2){
    throw 'Title at least has two characters'
  }

  //check plot
  checkIsString(plot);
  plot = plot.trim();

  //check genres
  checkArray(genres);
  let genresInvalidFlag = false;
  let counter1;
  for(let x of genres){
    x = x.trim();
    for(let i = 0; i < x.length; i++){
      var ch1 = x.charAt(i);
      if(/[a-zA-Z]/g.test(ch1)){
        counter1 += 1;
      }else{
        genresInvalidFlag = true;
        break;
      }
    }
    if(genresInvalidFlag){
      throw 'genres-No special characters or punctuation are allowed'
    }

    if(counter1 < 5){
      throw 'genres must be least five characters long'
    }
  }

  //check rating
  checkIsString(rating);
  rating = rating.trim();
  if(rating != "G" && rating != "PG" && rating != "PG-13" && rating != "R" && rating != "NC-17"){
    throw 'Rating is not Valid values'
  }

  //check studio
  checkIsString(studio);
  studio = studio.trim();
  let studioInvalidFlag = false;
  let counter2;
  let spec; // to count one spection punctuation ' 
  for(let i = 0; i < studio.length; i++){
    var ch2 = studio.charAt(i);
    if(/[a-zA-Z]/g.test(ch2) || ch2 == " "){
      counter2 += 1;
    }else if(ch2 === "'"){
      counter2 += 1;
      spec += 1;
    }else{
      studioInvalidFlag = true;
      break;
    }
  }
  if(studioInvalidFlag){
    throw 'studio-No special characters or punctuation are allowed'
  }

  if(spec === studio.length){
    throw "Studio name cannot be all ' punctuation "
  }

  if(counter2 < 5){
    throw 'studio must be least five characters long'
  }

  //check direcctor
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



  //check run time
  checkIsString(runtime);
  var regex = /^[0-9]*[1-9](h) 0*[0-5]{0,1}[0-9](min)$/g;
  if(!regex.test(runtime)){
    throw 'MUST be in the following format "#h #min". '
  }

  // creat movie
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
    runtime: runtime
  };

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

const getMovieById = async (id) => {
  //check to make sure we have input at all
  if (!id) throw 'You must provide an id to search for';

  //check to make sure it's a string
  if (typeof id !== 'string') throw 'Id must be a string';

  //check to make sure it's not all spaces
  if (id.trim().length === 0) throw 'Id cannot be an empty string or just spaces';

  //Now we check if it's a valid ObjectId so we attempt to convert a value to a valid object ID,
  id = id.trim();
  if (!ObjectId.isValid(id)) throw 'invalid object ID';
  
  const moviesCollection = await movies();
  const movie = await moviesCollection.findOne({ _id: ObjectId(id)});
  if (movie === null) throw 'no movie with that id';

  //he output does not have ObjectId() around the ID field and no quotes around the key names,
  // your function needs to return it as shown.
  movie._id = movie._id.toString();
  return movie;

};

const removeMovie = async (id) => {
  //check ID as getMovieByID
  if (!id) throw 'You must provide an id to search for';
  if (typeof id !== 'string') throw 'Id must be a string';
  if (id.trim().length === 0) throw 'id cannot be an empty string or just spaces';
  id = id.trim();
  if (!ObjectId.isValid(id)) throw 'invalid object ID';

  //convert string ID to ObjectID while we need to do operation
  const moviesCollection = await movies();
  const movie = await getMovieById(id);
  const deletionInfo = await moviesCollection.deleteOne({_id: ObjectId(id)});

  if (deletionInfo.deletedCount === 0) {
    throw `Could not delete movie with id of ${id}`;
  }
  return movie.title + " has been successfully deleted!";

};

const renameMovie = async (id, newName) => {
  //check id 
  if (!id) throw 'You must provide an id to search for';
  if (typeof id !== 'string') throw 'Id must be a string';
  if (id.trim().length === 0) throw 'Id cannot be an empty string or just spaces';
  id = id.trim();
  if (!ObjectId.isValid(id)) throw 'invalid object ID';

  //check newName
  if (!newName) throw 'You must provide a name for your movie';
  if (typeof newName !== 'string') throw 'Name must be a string';
  if (newName.trim().length === 0)throw 'Name cannot be an empty string or string with just spaces';
  
  const moviesCollection = await movies();
  const updatedMovie = {
    title: newName
  };

  const updatedInfo = await moviesCollection.updateOne(
    {_id: ObjectId(id)},
    {$set: updatedMovie}
  );
  if (updatedInfo.modifiedCount === 0) {
    throw 'could not update movie successfully';
  }

  return await getMovieById(id);

};

module.exports = {
  createMovie,
  getAllMovies,
  getMovieById,
  removeMovie,
  renameMovie
};
