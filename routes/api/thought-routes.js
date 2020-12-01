

// Import the dependencies

const router = require('express').Router();
const { 
        getAllThoughts,
        getThoughtById,
        addThought, 
        updateThoughtById,
        removeThought,
        addReaction,   
        removeReaction  } = require('../../controllers/thought-controller');

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




// Route to add a reaction to a Thought
// /api/Thoughts/:thoughtId/reaction
router
  .route('/:thoughtId/reactions')
  .put(addReaction);
  

// Route to delete a reaction from a Thought
router
  .route('/:thoughtId/reactions/:reactionId')
  .delete(removeReaction);



module.exports = router;