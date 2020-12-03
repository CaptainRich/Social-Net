
// Import the  models needed
const { Thought, User } = require('../models');

// Create the thoughtController object, with its methods

const thoughtController = {


    //////////////////////////////////////////////////////////////////////////////////////
    // Get all the thoughts.  This is the call-back function for the 
    // The '.find' is similar to the 'squelize' '.findAll' method.
    // Insomnia Route:  GET  http://localhost:3001/api/thoughts

    getAllThoughts(req, res) {

      Thought.find({})

          .select('-__v')             // don't return the __v field on users either
          .sort({ _id: -1 })          // sort in descending order, so newest is first
          .then(dbThoughtData => res.json(dbThoughtData))
          .catch(err => {
              console.log(err);
              res.status(400).json(err);
          });
    },

    /////////////////////////////////////////////////////////////////////////////////////
    // Get only one thought, by ID.
    // Insomnia Route:  GET  http://localhost:3001/api/thoughts/:thoughtId
    getThoughtById({ params }, res) {                     // destructure the params out of the 'req'

        Thought.findOne({ _id: params.thoughtId })

            .select('-__v')                // don't return the __v field on users either
            .then(dbThoughtData => {
                // If no user is found, send 404
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'No thought found with this id!' });
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },


    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Add a thought to a user
    // Insomnia Route:  POST  http://localhost:3001/api/thoughts/:userId
    addThought({ params, body }, res) {

        console.log("Adding a thought, params = ", params );
        Thought.create(body)
          .then(({ _id }) => {
            return User.findOneAndUpdate(
              { _id: params.userId },
              { $push: { thoughts: _id } },  // add the thought's ID to the user to update
              { new: true }                  // we get back the updated user document (with the new thought included)
            );
          })
          .then(dbUserData => {
            if (!dbUserData) {
              res.status(404).json({ message: 'No user found with this id!' });
              return;
            }
            res.json(dbUserData);
          })
          .catch(err => res.json(err));
    },


    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Update a thought by thought ID
    // Insomnia Route:  PUT  http://localhost:3001/api/thoughts/:thoughtId
    updateThoughtById({ params, body }, res) {

      console.log("Updating a thought, body = ", body);
      console.log("Params = ", params );
      Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            body,
            { new: true, runValidators: true }
         )       
        .then(dbThoughtData => {
          if (!dbThoughtData) {
            res.status(404).json({ message: 'No thought found with this id!' });
            return;
          }
          res.json(dbThoughtData);
        })
        .catch(err => res.json(err));
    },
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Add a reaction to a thought
    // Insomnia Route:  PUT  http://localhost:3001/api/thoughts/:thoughtId/reactions
    addReaction( { params, body }, res ) {

        console.log("Adding a Reaction, params = ", params );
        console.log( "body = ", body );
        Thought.findOneAndUpdate(
          { _id: params.thoughtId },              // Note that $addToSet is the same as $push, except  it won't duplicate an entry.
          { $addToSet: { reactions: body } },     // add the reaction to the thought to update
          { new: true }  // we get back the updated thought sub-document (with the new reaction  included)
        )
           .then(dbThoughtData => {
            console.log( "dbThoughtData = ", dbThoughtData );
            if (!dbThoughtData) {
              res.status(404).json({ message: 'No thought found with this id!' });
              return;
            }
            res.json(dbThoughtData);
          })
          .catch(err => res.status(500).json(err));
      },
  

  
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Remove a thought
    // Insomnia Route:  DELETE  http://localhost:3001/api/thoughts/:thoughtId
    removeThought({ params }, res) {

        console.log( "Deleting a thought, params= ", params );
        Thought.findOneAndDelete({ _id: params.thoughtId })  // first delete the thought and return its data
        .then(deletedThought => {                          
          if (!deletedThought) {
            return res.status(404).json({ message: 'No thought with this id!' });
          }
          return User.findOneAndUpdate(
            { _id: params.username },
            { $pull: { thoughts: params.thoughtId } },     // now delete the thought from the user
            { new: true }                                  // return the updated user information
          );
        })
        .then(dbThoughtData => {
          res.json(dbThoughtData)
        })
        .catch(err => res.json(err));
    },

  
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Remove reaction
  // Insomnia Route:  DELETE  http://localhost:3001/api/thoughts/:thoughtId/reactions/:reactionId
  removeReaction({ params }, res) {

    console.log("Deleting a Reaction, params = ", params );
    Thought.findOneAndUpdate(
        { _id: params.thoughtId },     // remove the specific reaction from the reaction array when the reactionId matches
        { $pull: { reactions: { _id: params.reactionId } } },    //the value of params.reactionId
        { new: true }
    )
    .then((dbThoughtData) => {
      if (!dbThoughtData) {
        res.status(404).json({ message: "No thought found with this id!" });
        return;
      }
      res.json(dbThoughtData);
    })
    .catch(err => res.status(500).json(err));
  
  }
}   

module.exports = thoughtController;