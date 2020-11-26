


// Import the dependencies
const { Schema, model } = require( 'mongoose' );
const dateFormat = require('../utils/dateFormat');

// Define the 'User' schema

const UserSchema = new Schema ( {
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
  
    createdAt: {
        type: Date,
        default: Date.now,
        get: (createdAtVal) => dateFormat(createdAtVal)      // reformat date information (from \utils\dateFormat.js)
    },

    email: {
        type: String,
        required: true,
        unique: true,
        match: [/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/, 'Please enter a valid e-mail address']       
    },

    thoughts: [
        { type: Schema.Types.ObjectId,
          ref: 'Thought' }                // reference the 'Thought' model
    ],
    
    friends: [
        { type: Schema.Types.ObjectId,
          ref: 'User' }                   // this is 'self-referencing'
    ]
},
{
    toJSON: {                       // setup the schema to allow 'virtuals'
      virtuals: true,
      getters:  true
    },
    id: false                       // don't need this for virtuals
  }
)

// Add the 'virtual property' to retrieve the length of the user's "friends" array field on query.
UserSchema.virtual( 'friendCount').get(function() {
    return this.friends.length;
})


// Create the user model from the schema

const User = model( 'user', UserSchema );

module.exports = User;