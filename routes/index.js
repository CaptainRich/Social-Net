

const router = require('express').Router();

// Import all of the API routes from /api/index.js.
// (No need for index.js though since it's implied)

const apiRoutes  = require('./api');


// Add a prefix of `/api` to all of the api routes imported from the `api` directory
router.use('/api', apiRoutes);


router.use((req, res) => {
  res.status(404).send('<h1>Sorry, 404 Error!</h1>');
});

module.exports = router;