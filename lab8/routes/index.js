//Here you will require route files and export them as used in previous labs
const peopleRoutes = require('./people');


const constructorMethod = (app) => {
  app.use('/', peopleRoutes);
 

  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Not found' });
  });
};

module.exports = constructorMethod;