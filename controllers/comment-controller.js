// importing both comment and pizza models
const { Comment, Pizza } = require('../models');
// const { db } = require('../models/Pizza');

const commentController = {
    // add comment to pizza
    addComment({ params, body }, res) {
        console.log(body);
        Comment.create(body)
            .then(({ _id }) => {
                return Pizza.findOneAndUpdate(
                    { _id: params.pizzaId }, 
                    // mongoDB adding to the array
                    { $push: { comments: _id }}, 
                    // receiving the updated pizza with new comment included 
                    { new: true }
                );
            })  
            .then(dbPizzaData => {
                if(!dbPizzaData) {
                    res.status(404).json({ message: 'No pizza found with this id! '})
                    return;
                }
                res.json(dbPizzaData);
            })
            .catch(err => res.json(err)); 
    },

    // adding replies to comments -- updating an existing comment (PUT)
    addReply({ params, body }, res) {
        Comment.findOneAndUpdate(
          { _id: params.commentId },
          { $push: { replies: body } },
          { new: true, runValidators: true }
        )
          .then(dbPizzaData => {
            if (!dbPizzaData) {
              res.status(404).json({ message: 'No pizza found with this id!' });
              return;
            }
            res.json(dbPizzaData);
          })
          .catch(err => res.json(err));
      },

    // remove comment
    removeComment({ params }, res) {
        // deletes comment and returns the data 
        Comment.findOneAndDelete({ _id: params.commentId })
            .then(deletedComment => {
                if (!deletedComment) {
                    return res.status(404).json({ message: 'No comment with this id!' }); 
                }
                return Pizza.findOneAndUpdate(
                    { _id: params.pizzaId }, 
                    // mongoDB removing from array 
                    { $pull : { comments: params.commentId }}, 
                    // returning data without the _id of the comment in the comment array
                    { new: true }
                ); 
            })
            .then(dbPizzaData => {
                if (!dbPizzaData) {
                    res.status(404).json({ message: 'No pizza found with this id!' }); 
                    return; 
                }
                res.json(dbPizzaData);
            })
            .catch(err => res.json(err)); 
    },

    // remove reply -- updating a reply on a comment (PUT)
    removeReply({ params }, res) {
        Comment.findOneAndUpdate(
          { _id: params.commentId },
          // removes the specific reply from the replies array where the replyId matches the value of params.replyId passed in from the route
          { $pull: { replies: { replyId: params.replyId } } },
          { new: true }
        )
          .then(dbPizzaData => res.json(dbPizzaData))
          .catch(err => res.json(err));
    }
};

module.exports = commentController; 