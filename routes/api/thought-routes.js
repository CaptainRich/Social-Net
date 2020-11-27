

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
router.route('/:userId/:thoughtId').delete(removeThought);

// Route to add a response to a Thought
router
  .route('/:userId/:thoughtId')
  .put(addResponse);
  

// Route to delete a response from a Thought
router
  .route('/:userId/:thoughtId:/responseId')
  .delete(removeResponse);



module.exports = router;