

// Import the dependencies

const router = require('express').Router();
const { 
        getAllThoughts,
        getThoughtById,
        addThought, 
        updateThoughtById,
        removeThought,
        addResponse,   
        removeResponse   } = require('../../controllers/thought-controller');

// Route to get all thoughts
router.route('/').get(getAllThoughts);


// Routes to get a thought by ID, update a thought by ID , and
// delete a thought by ID.
router.route('/:thoughtId')
.get(getThoughtById)
.put(updateThoughtById)
.delete(removeThought);

// Route to add a Thought to a user
// /api/Thoughts/<userId>
router.route('/:userId').post(addThought);




// Route to add a response to a Thought
// /api/Thoughts/:thoughtId/responses
router
  .route('/:thoughtId/responses')
  .post(addResponse);
  

// Route to delete a response from a Thought
router
  .route('/:thoughtId:/responses')
  .delete(removeResponse);



module.exports = router;