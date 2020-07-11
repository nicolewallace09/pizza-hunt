const router = require('express').Router();

const { addComment, 
        removeComment, 
        addReply, 
        removeReply } = require('../../controllers/comment-controller');

// /api/comments/<pizzaId>
router.route('/:pizzaId').post(addComment);

// /api/comments/<pizzaId>/<commentId>
router
    .route('/:pizzaId/:commentId')
    // put not post because we are not creating a new reply resource but updating an existing comment resource 
    .put(addReply)
    .delete(removeComment);

// includes both parent id and child in the URL
// "Go to this pizza, then look at this particular comment, then delete this one reply."
router.route('/:pizzaId/:commentId/:replyId').delete(removeReply);

module.exports = router;