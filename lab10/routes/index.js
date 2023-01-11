//Here you will require route files and export the constructor method as shown in lecture code and worked in previous labs.
//The app.use() function adds a new middleware to the app. Essentially, whenever a request hits your backend, Express will execute the functions you passed to app.use() in order
const routesAPIRoutes = require('./routesAPI');

const constructorMethod = (app) => {
  app.use('/', routesAPIRoutes);

  app.use('*', (req, res) => {
    res.sendStatus(404).json({error: 'Not found'});
  });
};

module.exports = constructorMethod;