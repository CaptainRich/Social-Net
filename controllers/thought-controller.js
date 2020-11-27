
// Import the  models needed
const { Thought, User } = require('../models');

// Create the thoughtController object, with its methods

const thoughtController = {


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
          .then(dbUserData => {
            if (!dbUserData) {
              res.status(404).json({ message: 'No user found with this id!' });
              return;
            }
            res.json(dbUserData);
          })
          .catch(err => res.json(err));
    },

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Add a response to a thought
    addResponse( { params, body }, res ) {

        Thought.findOneAndUpdate(
          { _id: params.thoughtId }, 
          { $push: { responses: body } },         // add the response's ID to the thought to update
          { new: true, runValidators: true }      // we get back the updated thought sub-document (with the new response  included)
        )
          .then(dbUserData => {
            if (!dbUserData) {
              res.status(404).json({ message: 'No user found with this id!' });
              return;
            }
            res.json(dbUserData);
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
        .then(dbUserData => {
          if (!dbUserData) {
            res.status(404).json({ message: 'No user found with this id!' });
            return;
          }
          res.json(dbUserData);
        })
        .catch(err => res.json(err));
    },

  
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // remove comment
  removeResponse({ params }, res) {

    Thought.findOneAndUpdate(
        { _id: params.thoughtId },     // remove the specific response from the responses array when the responseID matches
        { $pull: { responses: { responseId: params.responseId } } },    //the value of params.responseId
        { new: true }
    )
    .then(dbUserData => res.json(dbUserData))
    .catch(err => res.json(err));
  
  }
}   

module.exports = thoughtController;