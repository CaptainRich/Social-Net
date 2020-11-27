
const { User } = require(' ../models');

const userController = {


    //////////////////////////////////////////////////////////////////////////////////////
    // Get all the users.  This is the call-back function for the 
    // 'get/api/users' route. The '.find' is similar to the 'squelize' '.findAll' method.

    getAllUsers(req, res) {

        User.find({})
            .populate({                 // necessary to display any associated 'thoughts'
                path: 'thoughts',          // attached to this user.
                select: '-__v'             // don't return the __v field on 'thoughts'
            })
            .select('-__v')              // don't return the __v field on users either
            .sort({ _id: -1 })         // sort in descending order, so newest is first
            .then(dbUserData => res.json(dbUserData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },

    /////////////////////////////////////////////////////////////////////////////////////
    // Get only one user, by ID.
    getUserById({ params }, res) {                     // destructure the params out of the 'req'

        User.findOne({ _id: params.id })
            .populate({                 // necessary to display any associated 'thoughts'
                path: 'thoughts',          // attached to this user.
                select: '-__v'             // don't return the __v field on 'thoughts'
            })
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
    createUser({ body }, res) {                        // destructure the body out of the 'req'

        User.create(body)
            .then(dbUserData => res.json(dbUserData))
            .catch(err => res.status(400).json(err));
    },

    ///////////////////////////////////////////////////////////////////////////////////////////
    // Update a user by ID.
    updateUser({ params, body }, res) {

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

    ///////////////////////////////////////////////////////////////////////////////////////////
    // Delete a user by ID.
    deleteUser({ params }, res) {                               // destructure the params out of the 'req'

    User.findOneAndDelete({ _id: params.id })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id!' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.status(400).json(err));
    }

}

module.exports = userController;