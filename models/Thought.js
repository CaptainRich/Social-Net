




// Import the dependencies
const { Schema, model, Types } = require( 'mongoose' );
const dateFormat = require('../utils/dateFormat');


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Define the 'reaction' schema. Reactions will be sub-documents to 'thoughts'.
const ReactionSchema = new Schema(
  {
    // Set custom id to avoid confusion with parent thought _id
    reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId()
    },
    reactionBody: {
      type: String,
      required: true,
      maxlength: 280
    },
    username: {
      type: String,
      required: true,
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: createdAtVal => dateFormat(createdAtVal)      // reformat date information (from \utils\dateFormat.js)
    }
  },
  {
    toJSON: {
      getters: true
    }
  } 
);
    


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Define the 'Thought' schema

const ThoughtSchema = new Schema ( {
    thoughtText: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 280
    },
    
    createdAt: {
        type: Date,
        default: Date.now,
        get: (createdAtVal) => dateFormat(createdAtVal)      // reformat data information (from \utils\dateFormat.js)
      },
  
      username: {
        type: String,
        required: true,
        trim: true
    },
    
  reactions: [ReactionSchema]

},
{
  toJSON: {                       // setup the schema to allow 'virtuals'
    virtuals: true,
    getters: true
  },
  id: false                       // don't need this for 'virtuals'
}
)
    
    // Add the 'virtual property' to retrieve the length of the user's "friends" array field on query.
    ThoughtSchema.virtual( 'reactionCount').get(function() {
        return this.reactions.length;
    })


// Create the thought model from the schema
    
const Thought = model( 'Thought', ThoughtSchema );
    
module.exports = Thought; 