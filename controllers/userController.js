const { User, Thought } = require('../models');

module.exports = {

    getUsers(req, res) {
        console.log("Retrieving all users")
        User.find({})
            .populate({
                path: 'thoughts',
                select: '-__v'
            })
            .populate({
                path: 'friends',
                select: '-__v'
            })
            .then((users) => res.json(users))
            .catch((err) => {
                console.log(err);
                return res.status(500).json(err);
            });
    },
    getSingleUser(req, res) {
        console.log("Retrieving a single user")
        User.findOne({ _id: req.params.userId })
            .select('-__v')
            .lean()
            .then(async (user) =>
                !user
                    ? res.status(404).json({ message: 'There is no user with that ID' })
                    : res.json({
                        user,
                    })
            )
            .catch((err) => {
                console.log(err);
                return res.status(500).json(err);
            });
    },
    createUser(req, res) {
        console.log("Creating a user")
        User.create(req.body)
            .then((user) => res.json(user))
            .catch((err) => res.status(500).json(err));
    },
    updateUser(req, res) {
        console.log("Updating a user")
        User.findOneAndUpdate({ _id: req.params.userId }, req.body, { new: true, runValidators: true })
            .then(user => {
                if (!user) {
                    res.status(404).json({ message: 'There is no user with that ID' });
                    return;
                }
                res.json(user);
            })
            .catch(err => res.status(400).json(err));
    },
    deleteUser(req, res) {
        console.log("Deleting a user")
        User.findOneAndRemove({ _id: req.params.userId })
            .then((user) =>
                !user
                    ? res.status(404).json({ message: 'This user does not exist' })
                    : Thought.findOneAndUpdate(
                        { users: req.params.userId },
                        { $pull: { users: req.params.userId } },
                        { new: true }
                    )
            )
            .then((thought) =>
                !thought
                    ? res.status(404).json({
                        message: 'The user has no thoughts, and has been deleted',
                    })
                    : res.json({ message: 'The user has been successfully deleted' })
            )
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },
    addFriend(req, res) {
        console.log("Adding a friend")
        User.findOneAndUpdate(
            { _id: req.params.id },
            { $push: { friends: req.params.friendId } },
            { new: true }
        )
            .then(user => {
                if (!user) {
                    res.status(404).json({ message: 'There is no user with that ID' });
                    return;
                }
                res.json(user);
            })
            .catch(err => res.json(err));
    },

    removeFriend(req, res) {
        console.log("Removing a friend")
        User.findOneAndUpdate(
            { _id: req.params.id },
            { $pull: { friends: req.params.friendId } },
            { new: true }
        )
            .then(user => res.json(user))
            .catch(err => res.json(err));
    }
}