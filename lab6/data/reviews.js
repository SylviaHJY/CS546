const mongoCollections = require('../config/mongoCollections');
const movies = mongoCollections.movies;
const movies1 = require('./movies');
const {ObjectId} = require('mongodb');
const { checkIsString, getDecimalPart} = require('../helpers');

const createReview = async (
  movieId,
  reviewTitle,
  reviewerName,
  review,
  rating
) => {
  if(!movieId || !reviewTitle || !reviewerName || !review || !rating){
    throw 'All fields need to have valid values'
  }

  //check movieID
  checkIsString(movieId);
  movieId = movieId.trim();
  if (!ObjectId.isValid(movieId)) throw 'invalid object ID';
  const movie = await movies1.getMovieById(movieId);
  if (movie === null) throw 'no movie with that movieID';

  //check reviewTitle
  checkIsString(reviewTitle);
  reviewTitle = reviewTitle.trim();

  //check reviewerName
  checkIsString(reviewerName);
  reviewerName = reviewerName.trim();
  let reviewerNameValidFlag = false;
  for(let i = 0; i < reviewerName.length; i++){
    var ch = reviewerName.charAt(i);
    if(!/[a-zA-Z]/g.test(ch) && ch != " "){
      reviewerNameValidFlag = true;
    }
  }
  if(reviewerNameValidFlag){
    throw "reviewerName-No special characters or punctuation or numbers are allowed";
  }

  //check review
  checkIsString(review);
  review = review.trim();

  //check rating
  if(isNaN(rating) || rating < 1 || rating > 5 || getDecimalPart(rating).length > 1){
    throw "rating must be a number in range from 1.0-5.0 and has only one decimal place";
  }

  let today = new Date();
  let dd = String(today.getDate()).padStart(2, '0');
  let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  let yyyy = today.getFullYear();
  today = mm + '/' + dd + '/' + yyyy;


   //create reviews
  let newReview = {
    _id: ObjectId(),
    reviewTitle: reviewTitle,
    reviewDate: today,
    reviewerName: reviewerName,
    review: review,
    rating: rating
  }

  const moviesCollection = await movies();
  const updatedReview = await moviesCollection.updateOne(
    {_id: ObjectId(movieId)},
    {$addToSet:{reviews:newReview}}) ;// add newReview element to reviews array where movieID
  if (updatedReview.modifiedCount === 0) {
    throw 'could not update reviews successfully';
  }

  let allReviews = await getAllReviews(movieId);
  let sum = 0;
  let overall;
  for(let i = 0; i < allReviews.length; i++){
    sum = sum + allReviews[i].rating;
    sum.toFixed(12) // Add Decimals number 
  }
  if(allReviews.length === 0){
    overall = 0;
  }else{
    overall = Math.round((sum / allReviews.length) * 10) / 10;
  }
  

  let updatedOverall = {
    overallRating: overall
  };

  let updatedMovie = await moviesCollection.updateOne(
    {_id: ObjectId(movieId)},
    {$set:updatedOverall}
    ); //count overallRating element and add it to movies feature
  if (updatedMovie.modifiedCount === 0) {
    throw 'could not update overallRating  successfully';
  }

  let newlyReview = await getReview(newReview._id.toString());
  return newlyReview;
};

const getAllReviews = async (movieId) => {
  //check to make sure we have input at all
  if (!movieId) throw 'You must provide an id to search for';

  //check to make sure it's a string
  if (typeof movieId !== 'string') throw 'Id must be a string';

  //check to make sure it's not all spaces
  if (movieId.trim().length === 0) throw 'Id cannot be an empty string or just spaces';

  //Now we check if it's a valid ObjectId so we attempt to convert a value to a valid object ID,
  movieId = movieId.trim();
  if (!ObjectId.isValid(movieId)) throw 'invalid object ID';
  
  const movie = await movies1.getMovieById(movieId);
  if (movie === null) throw 'no movie with that movieID';

  let reviewList = [];
  for (let i = 0; i < movie.reviews.length; i++) {
    movie.reviews[i]._id = movie.reviews[i]._id.toString();
    reviewList.push(movie.reviews[i]);
  }
  return reviewList;

};

const getReview = async (reviewId) => {
  //check reviewID
  if (!reviewId) throw 'You must provide an id to search for';
  checkIsString(reviewId);
  //Now we check if it's a valid ObjectId so we attempt to convert a value to a valid object ID,
  reviewId = reviewId.trim();
  if (!ObjectId.isValid(reviewId)) throw 'invalid object ID';

  const moviesCollection = await movies();

  // Way1: Use projection and $elemMatch to return a single review
  const singleReview = await moviesCollection.findOne({ 'reviews._id': ObjectId(reviewId)},{projection:{_id:0,title:0,plot:0,genres:0,rating:0,studio:0,director:0,castMembers:0,dateReleased:0,runtime:0,reviews:{$elemMatch: { _id: ObjectId(reviewId)}},overallRating:0}});
  if(!singleReview) throw 'No review with that reviewID';
  let myReview = singleReview.reviews[0];
  singleReview.reviews[0]._id = singleReview.reviews[0]._id.toString();

  //Way2: iterate over the result to look for a matching reviewid
  // const reviewPost = await moviesCollection.findOne({ 'reviews._id': ObjectId(reviewId)});
  // if (!reviewPost) throw 'No review with that reviewID';
  // let myReview;
  // for(let i = 0; i < reviewPost.reviews.length; i++){
  //   if(reviewPost.reviews[i]._id.toString() === reviewId){
  //     myReview = reviewPost.reviews[i];
  //     myReview._id = myReview._id.toString();
  //   }
  // }

  return myReview;
};

const removeReview = async (reviewId) => {
  //check ID as getMovieByID
  if (!reviewId) throw 'You must provide an id to search for';
  if (typeof reviewId !== 'string') throw 'Id must be a string';
  if (reviewId.trim().length === 0) throw 'id cannot be an empty string or just spaces';
  reviewId = reviewId.trim();
  if (!ObjectId.isValid(reviewId)) throw 'invalid object ID';

  //find the movie contain the review with provided reviewID
  const moviesCollection = await movies();
  const movieBeforeDelete = await moviesCollection.findOne({ 'reviews._id': ObjectId(reviewId)});

  // const newMovieAfterDelete = moviesCollection.updateOne({ 'reviews._id': ObjectId(reviewId)}, {$pull: {reviews:{_id:ObjectId(reviewId)}}});
  // if (newMovieAfterDelete.deletedCount === 0)
  //     throw `Error: Could not delete review with id of ${reviewId}`;
  let newReviewList = await getAllReviews(movieBeforeDelete._id.toString());

  if(newReviewList.length === 1){
    const change1 = await moviesCollection.updateOne({ 'reviews._id': ObjectId(reviewId)},{$pop: {reviews: 1}});
    let updateIfo = {
      reviews:[],
      overallRating:0
    }
    if (change1.deletedCount === 0)
      throw `Error: change1-Could not delete review with id of ${reviewId}`;

    await moviesCollection.updateOne(
      {_id: movieBeforeDelete._id},
      {$set:updateIfo}
      ); 
      // if (change2.modifiedCount === 0) {
      //   throw 'change2-Could not update overallRating after review has been deleted successfully';
      // }
      const resultMovie = await movies1.getMovieById(movieBeforeDelete._id.toString());
      return resultMovie;
  }else{
    const newMovieAfterDelete = await moviesCollection.updateOne({ 'reviews._id': ObjectId(reviewId)}, {$pull: {reviews:{_id:ObjectId(reviewId)}}});
    if (newMovieAfterDelete.deletedCount === 0)
      throw `Error: Could not delete review with id of ${reviewId}`;
    
    let newList = await getAllReviews(movieBeforeDelete._id.toString());
    let sum1 = 0;
    let overall1;
    for(let i = 0; i < newList.length; i++){
      sum1 = sum1 + newList[i].rating;
      sum1.toFixed(12) // Add Decimals number 
    }
   
    overall1 = Math.round((sum1 / newList.length) * 10) / 10;
    
    let updatedOverall1 = {
      overallRating:overall1
    };

    await moviesCollection.updateOne(
      {_id: movieBeforeDelete._id},
      {$set:updatedOverall1}
      ); //count overallRating element and add it to movies feature
    // if (reviewUpdateMovie.modifiedCount === 0) {
    //   throw 'Could not update overallRating after review has been deleted successfully';
    // }
    const resultMovie1 = await movies1.getMovieById(movieBeforeDelete._id.toString());
    let resultMovie1Reviews = resultMovie1.reviews;
    for(let i = 0; i < resultMovie1Reviews.length; i++){
      resultMovie1Reviews[i]._id = resultMovie1Reviews[i]._id.toString();
    }
    return resultMovie1;
  }

};

module.exports = {
  createReview,
  getAllReviews,
  getReview,
  removeReview
};
