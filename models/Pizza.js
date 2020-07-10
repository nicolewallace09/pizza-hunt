const { Schema, model } = require('mongoose');
const moment = require('moment');

const PizzaSchema = new Schema({
    pizzaName: {
        type: String,
        // can change the message to a custom message
        required: true,
        // works like JavaScript's trim to remove extra white space
        trim: true
    },
    createdBy: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date, 
        default: Date.now,
        // setting getter to format data on the page
        get: (createdAtVal) => moment(createdAtVal).format('MMM DD, YYYY [at] hh:mm a')
    },
    size: {
        type: String,
        required: true,
        // enumerable, a popular term in web development that refers to a set of data that can be iterated over (user cannot input any data note in that array)
        enum: ['Personal', 'Small', 'Medium', 'Large', 'Extra Large'],
        default: 'Large'
    }, 
    // [] array as datatype -- you can also specify arrays 
    toppings: [],
    // subdocument 
    comments: [
        {
            type: Schema.Types.ObjectId,
            // referring to the comment document model 
            ref: 'Comment'
        }
    ]
},
{
    toJSON: {
        virtuals: true,
        getters: true
    },
    // id is not needed for virtuals 
    id: false   
}
); 

// get total count of comments and replies on retrieval 
// reduce takes two parameters - accumulator(total) and currentValue(comment)
PizzaSchema.virtual('commentCount').get(function() {
    return this.comments.reduce((total, comment) => total + comment.replies.length + 1, 0);
  });

// create the Pizza model using the PizzaSchema
const Pizza = model('Pizza', PizzaSchema);

// export the Pizza model
module.exports = Pizza;

