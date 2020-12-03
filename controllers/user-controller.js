
const { User, Thought } = require('../models');

const userController = {


    //////////////////////////////////////////////////////////////////////////////////////
    // Get all the users.  This is the call-back function for the 
    // The '.find' is similar to the 'squelize' '.findAll' method.
    // Insomnia Route:  GET  http://localhost:3001/api/users

    getAllUsers(req, res) {

        User.find({})
            .populate({                 // necessary to display any associated 'thoughts'
                path: 'thoughts',       // attached to this user.
                select: '-__v'          // don't return the __v field on 'thoughts'
            })
            .select('-__v')             // don't return the __v field on users either
            .sort({ _id: -1 })          // sort in descending order, so newest is first
            .then(dbUserData => res.json(dbUserData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },

    /////////////////////////////////////////////////////////////////////////////////////
    // Get only one user, by ID.
    // Insomnia Route:  GET  http://localhost:3001/api/users/:userId
    getUserById({ params }, res) {                     // destructure the params out of the 'req'

        User.findOne({ _id: params.id })
            .populate({                    // necessary to display any associated 'thoughts'
                path: 'thoughts',          // attached to this user.
                select: '-__v'             // don't return the __v field on 'thoughts'
            })
            .select('-__v')                // don't return the __v field on users either
            .then(dbUserData => {
                // If no user is found, send 404
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user found with this id!' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },

    ///////////////////////////////////////////////////////////////////////////////////////////
    // Create/add a new user.
    // Insomnia Route:  POST  http://localhost:3001/api/users
    createUser({ body }, res) {                        // destructure the body out of the 'req'

        User.create(body)
            .then(dbUserData => res.json(dbUserData))
            .catch(err => res.status(400).json(err));
    },

    ///////////////////////////////////////////////////////////////////////////////////////////
    // Update a user by ID.
    // Insomnia Route:  PUT  http://localhost:3001/api/users/:userId
    updateUser({ params, body }, res) {                // destructure both the 'params' and the 'body'

        // "new:true" indicates return new version after modification
        User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user found with this id!' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.status(400).json(err));
    },

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Add a friend to a user
    // Insomnia Route:  POST  http://localhost:3001/api/users/:userId/friends/:friendId , where 'friendId' 
    //                                                                                is another user's ID.
    addFriendById({ params }, res) {

        //console.log('Adding a friend, params = ', params );
        User.findByIdAndUpdate(
              { _id: params.userId },
              { $push: { friends: params.friendId } },   // add the friend's ID to the user to update
              { new: true }                  // we get back the updated user document (with the new thought included)
            )
          .select("-__v")                    // don't return the __v field on users 
          .then(dbUserData => {
            if (!dbUserData) {
              res.status(404).json({ message: 'No user found with this id!' });
              return;
            }
            res.json(dbUserData);
          })
          .catch(err => res.json(err));
    },

    ///////////////////////////////////////////////////////////////////////////////////////////
    // Delete a user by ID.
    // Insomnia Route:  DELETE  http://localhost:3001/api/users/:userId
    deleteUser({ params }, res) {                        // destructure the params out of the 'req'

    console.log("Deleting a user, params = ", params );
    User.findOneAndDelete({ _id: params.id })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id!' });
          return;
        }

        // Need to remove this user from any 'friends' arrays.
        User.updateMany(
          { _id: { $in: dbUserData.friends } },  // IF the ID exists in the 'friends' array, 
          { $pull: { friends: params.id } }      //   remove it.
        )

        // Remove this user's associated thoughts 
        .then( () => {
          Thought.deleteMany( { username: dbUserData.username })
          .then( () => {
             res.json("User (and associated thoughts) successfully removed.");
          })
          .catch( (err) => res.status(400).json(err) );
        })
        .catch( (err) => res.status(400).json(err) );
      })
      .catch(err => res.status(400).json(err));
    },

    ///////////////////////////////////////////////////////////////////////////////////////////
    // Remove a friend from a user by ID.
    // Insomnia Route:  DELETE  http://localhost:3001/api/users/:userId/friends/:friendId , where 'friendId' 
    //                                                                                is another user's ID.
    removeFriendById({ params }, res) {

    User.findOneAndUpdate(
            { _id: params.userId },
            { $pull: { friends: params.friendId } },     // now delete the friend from the user
            { new: true }                                // return the updated user information
          )
        .select("-__v")                                  // don't return the __v field on users 
        .then(dbUserData => {
          if (!dbUserData) {
            res.status(404).json({ message: 'No user found with this id!' });
            return;
          }
          res.json(dbUserData);
        })
        .catch(err => res.json(err));
    }

}

module.exports = userController;