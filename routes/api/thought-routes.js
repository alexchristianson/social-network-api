const router = require('express').Router();
const {
    getAllThoughts,
    getThoughtsById,
    createThoughts,
    updateThoughts,
    deleteThoughts,
    addReaction,
    removeReaction
} = require('../../controllers/thoughts-controller');

router.route('/').get(getAllThoughts).post(createThoughts);

router.route('/:thoughtId').get(getThoughtsById).put(updateThoughts).delete(deleteThoughts);

router.route('/:thoughtId/Reactions/:ReactionId').post(addReaction).delete(removeReaction);

module.exports = router;