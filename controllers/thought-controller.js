
// Import the  models needed
const { Thought, User } = require('../models');

// Create the thoughtController object, with its methods

const thoughtController = {


    //////////////////////////////////////////////////////////////////////////////////////
    // Get all the thoughts.  This is the call-back function for the 
    // 'get/api/thoughts' route. The '.find' is similar to the 'squelize' '.findAll' method.

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
    getThoughtById({ params }, res) {                     // destructure the params out of the 'req'

        Thought.findOne({ _id: params.id })

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
    addThought({ params, body }, res) {

        console.log(body);
        Thought.create(body)
          .then(({ _id }) => {
            return User.findOneAndUpdate(
              { _id: params.userId },
              { $push: { thoughts: _id } },  // add the thought's ID to the user to update
              { new: true }                  // we get back the updated user document (with the new thought included)
            );
          })
          .then(dbThoughtData => {
            if (!dbThoughtData) {
              res.status(404).json({ message: 'No user found with this id!' });
              return;
            }
            res.json(dbThoughtData);
          })
          .catch(err => res.json(err));
    },


    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Update a thought by ID
    updateThoughtById({ params, body }, res) {

      console.log(body);
      Thought.findOneAndUpdate(
            { _id: params.userId },
            { $push: { thoughts: _id } },  // add the thought's ID to the user to update
            { new: true }                  // we get back the updated user document (with the new thought included)
         )       
        .then(dbThoughtData => {
          if (!dbThoughtData) {
            res.status(404).json({ message: 'No user found with this id!' });
            return;
          }
          res.json(dbThoughtData);
        })
        .catch(err => res.json(err));
    },
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Add a reaction to a thought
    addReaction( { params, body }, res ) {

        Thought.findOneAndUpdate(
          { _id: params.thoughtId }, 
          { $push: { reactions: body } },         // add the reaction's ID to the thought to update
          { new: true, runValidators: true }      // we get back the updated thought sub-document (with the new reaction  included)
        )
          .then(dbThoughtData => {
            if (!dbThoughtData) {
              res.status(404).json({ message: 'No user found with this id!' });
              return;
            }
            res.json(dbThoughtData);
          })
          .catch(err => res.json(err));
      },
  

  
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Remove thought
    removeThought({ params }, res) {

        Thought.findOneAndDelete({ _id: params.thoughtId })  // first delete the thought and return its data
        .then(deletedThought => {                          
          if (!deletedThought) {
            return res.status(404).json({ message: 'No thought with this id!' });
          }
          return User.findOneAndUpdate(
            { _id: params.userId },
            { $pull: { thoughts: params.thoughtId } },     // now delete the thought from the user
            { new: true }                                  // return the updated user information
          );
        })
        .then(dbThoughtData => {
          if (!dbThoughtData) {
            res.status(404).json({ message: 'No user found with this id!' });
            return;
          }
          res.json(dbThoughtData);
        })
        .catch(err => res.json(err));
    },

  
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // remove comment
  removeReaction({ params }, res) {

    Thought.findOneAndUpdate(
        { _id: params.thoughtId },     // remove the specific reaction from the reaction array when the reactionId matches
        { $pull: { reactions: { reactionId: params.reactionId } } },    //the value of params.reactionId
        { new: true }
    )
    .then(dbThoughtData => res.json(dbThoughtData))
    .catch(err => res.json(err));
  
  }
}   

module.exports = thoughtController;