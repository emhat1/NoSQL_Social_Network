const { User, Thought } = require('../models');

module.exports = {
    getThoughts(req, res) {
        console.log("Retrieving thoughts")
        Thought.find({})
            .select('-__v')
            .sort({ _id: -1 })
            .then((thoughts) => res.json(thoughts))
            .catch((err) => res.status(500).json(err));
    },

    getSingleThought(req, res) {
        console.log("Retrieving a single thought")
        Thought.findOne({ _id: req.params.thoughtId })
            .select('-__v')
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: 'There is no thought with that ID' })
                    : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },

    createThought(req, res) {
        console.log("Creating a thought")
        Thought.create(req.body)
            .then((thought) => {
                return User.findOneAndUpdate(
                    { _id: req.body.userId },
                    { $push: { thoughts: thought } },
                    { new: true, runValidators: true }
                )
            })
            .then((thought) =>
                !thought
                    ? res.status(404).json({
                        message: 'There is no thought with that ID'
                    })
                    : res.json({ message: 'Your thought has been published' }))
            .catch((err) => {
                console.log(err);
                return res.status(500).json(err);
            });
    },

    deleteThought(req, res) {
        console.log("Deleting a thought")
        Thought.findOneAndDelete({ _id: req.params.thoughtId })
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: 'There is no thought with that ID' })
                    : User.deleteMany({ _id: { $in: thought.users } })
            )
            .then(() => res.json({ message: 'The thought has been deleted' }))
            .catch((err) => res.status(500).json(err));
    },

    updateThought(req, res) {
        console.log("Updating your thought")
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $set: req.body },
            { runValidators: true, new: true }
        )
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: 'There is no thought with that ID' })
                    : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },

    addComment(req, res) {
        console.log('You are commenting on a thought');
        console.log(req.body);
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $addToSet: { comments: req.body } },
            { runValidators: true, new: true }
        )
            .then((thought) =>
                !thought
                    ? res
                        .status(404)
                        .json({ message: 'There is no user with that ID' })
                    : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },

    removeComment(req, res) {
        console.log("Deleting your comment")
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { comments: { commentId: req.params.commentId } } },
            { runValidators: true, new: true }
        )
            .then((thought) =>
                !thought
                    ? res
                        .status(404)
                        .json({ message: 'There is no thought with that ID' })
                    : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },
};