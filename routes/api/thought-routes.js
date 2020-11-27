

// Import the dependencies

const router = require('express').Router();
const { addThought, 
        removeThought,
        addResponse,   
        removeResponse   } = require('../../controllers/thought-controller');

// Route to add a Thought to a user
// /api/Thoughts/<userId>
router.route('/:userId').post(addThought);


// Route to delete a Thought from a user
// /api/Thoughts/<userId>/<ThoughtId>
router.route('/:userId/:ThoughtId').delete(removeThought);

// Route to add a reaction to a Thought
router
  .route('/:userId/:ThoughtId')
  .put(addResponse);
  

// Route to delete a reaction from a Thought
router
  .route('/:userId/:ThoughtId:/reactionId')
  .delete(removeResponse);



module.exports = router;