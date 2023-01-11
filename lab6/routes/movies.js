//require express and express router as shown in lecture code
const express = require('express');
const router = express.Router();
const data = require('../data');
const { checkIsString ,checkTitle, checkID,checkArray, checkGenres,checkRating,checkName,checkStudio,isValidDate} = require('../helpers');
const moviesData = data.movies;


router
  .route('/')
  .get(async (req, res) => {
    //code here for GET
    //Responds with an array of all movies in the format of {"_id": "movie_id", "title": "movie_name"} 
    try{
      const allMovies = await moviesData.getAllMovies();
      let moviesList = [];
      for (i = 0; i < allMovies.length; i++) {
        moviesList.push({ _id: allMovies[i]._id, title: allMovies[i].title });
      }
      res.json(moviesList);
    }catch(e){
      res.status(500).json({message: 'movies not found'});
    }
  })
  .post(async (req, res) => {
    //code here for POST
    const moviePost = req.body;
    if (!moviePost.title || !moviePost.plot || !moviePost.genres|| !moviePost.rating || !moviePost.studio || !moviePost.director || !moviePost.castMembers
      || !moviePost.dateReleased || !moviePost.runtime) {
      res.status(400).json({ message: 'All fields need to have valid values' });
      return;
    }

    try{
      //check title
      checkIsString(moviePost.title);
      checkTitle(moviePost.title);

      //check plot
      checkIsString(moviePost.plot);
      moviePost.plot = moviePost.plot.trim();

      //check genres
      checkArray(moviePost.genres);
      checkGenres(moviePost.genres);

      //check rating
      checkIsString(moviePost.rating);
      checkRating(moviePost.rating);

      //check studio
      checkIsString(moviePost.studio);
      checkStudio(moviePost.studio);

      //check director
      checkIsString(moviePost.director);
      moviePost.director = moviePost.director.trim();
      checkName(moviePost.director);

      //check castMembers
      checkArray(moviePost.castMembers);
      for(let i = 0; i < moviePost.castMembers.length; i++){
        moviePost.castMembers[i] = moviePost.castMembers[i].trim();
        checkName(moviePost.castMembers[i]);
      }

      //check dateReleased
      checkIsString(moviePost.dateReleased);
      let result = moviePost.dateReleased.split("/");
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
      checkIsString(moviePost.runtime);
      var regex = /^[0-9]*[1-9](h )0*[0-5]{0,1}[0-9](min)$/g;
      if(!regex.test(moviePost.runtime)){
        throw 'MUST be in the following format "#h #min". '
      }; 
    }catch(e){
      return res.status(400).json({error: e});
    }

    try{
      //retrieve data from moviePost
      const {title,plot,genres,rating,studio,director,castMembers,dateReleased,runtime} = moviePost;
      //create new Movie
      const createMovie = await moviesData.createMovie(title,plot,genres,rating,studio,director,castMembers,dateReleased,runtime);
      //If the JSON is valid and the movie can be created successfully, you will return the newly created movie with a 200 status code. 
      res.status(200).json(createMovie);
    }catch(e){
      //If the JSON provided does not match the above schema or fails the conditions listed above, you will issue a 400 status code and end the request.
      res.status(400).json({ error: e });
    }
  });

router
  .route('/:movieId')
  .get(async (req, res) => {
    //code here for GET
    try{
      req.params.movieId = checkID(req.params.movieId);
    }catch(e){
      return res.status(400).json({error: e});
    }

    try{
    const movieByID = await moviesData.getMovieById(req.params.movieId);
    res.status(200).json(movieByID); 
    }catch(e){
      res.status(404).json({ error: 'movie by id not found' });
    }
  })
  .delete(async (req, res) => {
    //code here for DELETE
    try{
      req.params.movieId = checkID(req.params.movieId);
    }catch(e){
      return res.status(400).json({error: e});
    }

    try{
      await moviesData.getMovieById(req.params.movieId); 
    }catch(e){
      return res.status(404).json({error: 'Movie not found'});
    }

    try {
      await moviesData.removeMovie(req.params.movieId);
      res.status(200).json({"movieId": req.params.movieId, "deleted": true});
    } catch (e) {
      res.status(500).json({error: e});
    }
  })
  .put(async (req, res) => {
    //code here for PUT
    const info = req.body;
    if (!info.title || !info.plot || !info.genres|| !info.rating || !info.studio || !info.director || !info.castMembers || !info.dateReleased || !info.runtime) {
      res.status(400).json({ message: 'All fields need to have valid values' });
      return;
    }

  try{
    req.params.movieId = checkID(req.params.movieId);
  }catch(e){
    return res.status(400).json({error: e});
  }

  try{
    //check title
    checkIsString(info.title);
    checkTitle(info.title);

    //check plot
    checkIsString(info.plot);
    info.plot = info.plot.trim();

    //check genres
    checkArray(info.genres);
    checkGenres(info.genres);

    //check rating
    checkIsString(info.rating);
    checkRating(info.rating);

    //check studio
    checkIsString(info.studio);
    checkStudio(info.studio);

    //check director
    checkIsString(info.director);
    info.director = info.director.trim();
    checkName(info.director);

    //check castMembers
    checkArray(info.castMembers);
    for(let i = 0; i < info.castMembers.length; i++){
      info.castMembers[i] = info.castMembers[i].trim();
      checkName(info.castMembers[i]);
    }

    //check dateReleased
    checkIsString(info.dateReleased);
    let result = info.dateReleased.split("/");
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
    checkIsString(info.runtime);
    var regex = /^[0-9]*[1-9](h )0*[0-5]{0,1}[0-9](min)$/g;
    if(!regex.test(info.runtime)){
      throw 'MUST be in the following format "#h #min". '
    }; 
  }catch(e){
    return res.status(400).json({error: e});
  }

  try {
   await moviesData.getMovieById(req.params.movieId);
  } catch (e) {
    return res.status(404).json({error: 'Movie not found'});
  }

  try {
    const updatedPost = await moviesData.updateMovie(req.params.movieId, info.title,info.plot,info.genres,info.rating,info.studio,info.director,info.castMembers,info.dateReleased,info.runtime);
    res.status(200).json(updatedPost); 
  } catch (e) {
    res.status(500).json({error: e});
  }

  });

module.exports = router;
