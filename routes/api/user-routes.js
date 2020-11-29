// Import statements
const router = require('express').Router();

const {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    addFriendById,
    deleteUser,
    removeFriendById
  } = require('../../controllers/user-controller');


////////////////////////////////////////////////////////////////////////////////
// Set up GET all and POST at /api/users
router
  .route('/')
  .get( getAllUsers )
  .post( createUser );

// Route to add a friend to a user
  router.route('/:userId/friends/:friendId').post(addFriendById);

  // Route to delete a friend from a user
  router.route('/:userId/friends/:friendId').delete(removeFriendById);

// Set up GET one, PUT, and DELETE at /api/users/:id
router
  .route('/:id')
  .get( getUserById )
  .put( updateUser )
  .delete( deleteUser );

module.exports = router;