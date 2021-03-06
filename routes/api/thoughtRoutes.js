const router = require('express').Router();
const {
    getThoughts,
    getSingleThought,
    createThought,
    updateThought,
    deleteThought,
    addComment,
    removeComment,
} = require('../../controllers/thoughtController');

router
    .route('/')
    .get(getThoughts)
    .post(createThought);

router
    .route('/:thoughtId')
    .get(getSingleThought)
    .put(updateThought)
    .post(addComment)
    .delete(deleteThought);

router
    .route('/:thoughtId/:commentId')
    .delete(removeComment);
module.exports = router;