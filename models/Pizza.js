const { Schema, model } = require('mongoose');
const moment = require('moment');

const PizzaSchema = new Schema({
    pizzaName: {
        type: String
    },
    createdBy: {
        type: String
    },
    createdAt: {
        type: Date, 
        default: Date.now,
        // setting getter to format data on the page
        get: (createdAtVal) => moment(createdAtVal).format('MMM DD, YYYY [at] hh:mm a')
    },
    size: {
        type: String,
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
PizzaSchema.virtual('commentCount').get(function() {
    return this.comments.length; 
});

// create the Pizza model using the PizzaSchema
const Pizza = model('Pizza', PizzaSchema);

// export the Pizza model
module.exports = Pizza;

