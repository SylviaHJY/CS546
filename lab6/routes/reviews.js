//require express and express router as shown in lecture code
const express = require('express');
const router = express.Router();
const data = require('../data');
const { checkIsString,getDecimalPart,checkID } = require('../helpers');
const reviewsData = data.reviews;
const moviesData = data.movies;

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
      const resultReviews = await reviewsData.getAllReviews(req.params.movieId);
      res.status(200).json(resultReviews);
    }catch(e){
      res.status(404).json({ error: 'movie by id not found' });
    }
  })
  .post(async (req, res) => {
    //code here for POST
    //POST /reviews/{movieId} - review sub-document with the supplied data in the request body, and returns all the movie data
    const info = req.body;
    if (!info.reviewTitle || !info.reviewerName || !info.review || !info.rating) {
      res.status(400).json({ message: 'All fields need to have valid values' });
      return;
    }

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

    try{
      //check reviewTitle
      checkIsString(info.reviewTitle);
      info.reviewTitle = info.reviewTitle.trim();

      //check reviewerName
      checkIsString(info.reviewerName);
      info.reviewerName = info.reviewerName.trim();
      let reviewerNameValidFlag = false;
      for(let i = 0; i < info.reviewerName.length; i++){
        var ch = info.reviewerName.charAt(i);
        if(!/[a-zA-Z]/g.test(ch) && ch != " "){
          reviewerNameValidFlag = true;
        }
      }
      if(reviewerNameValidFlag){
        throw "reviewerName-No special characters or punctuation or numbers are allowed";
      }

      //check review
      checkIsString(info.review);
      info.review = info.review.trim();

      //check rating
      if(isNaN(info.rating) || info.rating < 1 || info.rating > 5 || getDecimalPart(info.rating).length > 1){
        throw "rating must be a number in range from 1.0-5.0 and has only one decimal place";
      }
    }catch(e){
      return res.status(400).json({error: e});
    }

    try{
      //retrieve data from info (req.body)
      const {reviewTitle,reviewerName,review,rating} = info;
      await reviewsData.createReview(req.params.movieId,reviewTitle,reviewerName,review,rating);
      const findMovie = await moviesData.getMovieById(req.params.movieId);
      res.status(200).json(findMovie);
    }catch(e){
      res.status(400).json({ error: e });
    }
  });

router
  .route('/review/:reviewId')
  .get(async (req, res) => {
    //code here for GET
    try{
      req.params.reviewId = checkID(req.params.reviewId);
    }catch(e){
      return res.status(400).json({error: e});
    }

    try{
      const findReview = await reviewsData.getReview(req.params.reviewId);
      res.status(200).json(findReview);
    }catch(e){
      res.status(404).json({ error: 'review by reviewId not found'});
    }
  })
  .delete(async (req, res) => {
    //code here for DELETE
    try{
      req.params.reviewId = checkID(req.params.reviewId);
    }catch(e){
      return res.status(400).json({error: e});
    }

    try {
      await reviewsData.getReview(req.params.reviewId);
    } catch (e) {
        res.status(404).json({ error: 'review by id not found' });
        return;
    }

    try{
      const movieAfterReviewDelete = await reviewsData.removeReview(req.params.reviewId);
      res.status(200).json(movieAfterReviewDelete);
    }catch(e){
      res.status(500).json({error: e});
    }
  });

  module.exports = router;
