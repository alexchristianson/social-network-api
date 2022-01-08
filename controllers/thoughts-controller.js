const { Thoughts, Users } = require('../models');

const thoughtsController = {
  // get all thoughts
  getAllThoughts(req, res) {
    Thoughts.find()
      .sort({ createdAt: -1 })
      .then((dbThoughtsData) => {
        res.json(dbThoughtsData);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
  // get one thought by id
  getThoughtById(req, res) {
    Thoughts.findOne({ _id: req.params.thoughtId })
      .then((dbThoughtsData) => {
        if (!dbThoughtsData) {
          return res.status(404).json({ message: 'No Thoughts with this id!' });
        }
        res.json(dbThoughtsData);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
  // create new thought
  createThought(req, res) {
    Thoughts.create(req.body)
      .then((dbThoughtsData) => {
        return Users.findOneAndUpdate(
          { _id: req.body.userId },
          { $push: { Thoughts: dbThoughtsData._id } },
          { new: true }
        );
      })
      .then((dbUserData) => {
        if (!dbUserData) {
          return res.status(404).json({ message: 'Thought created but no user with this id!' });
        }
        res.json({ message: 'Thought successfully created!' });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
  // update a thought
  updateThought(req, res) {
    Thoughts.findOneAndUpdate({ _id: req.params.thoughtId }, { $set: req.body }, { runValidators: true, new: true })
      .then((dbThoughtsData) => {
        if (!dbThoughtsData) {
          return res.status(404).json({ message: 'No Thoughts with this id!' });
        }
        res.json(dbThoughtsData);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // delete thought
  deleteThought(req, res) {
    Thoughts.findOneAndRemove({ _id: req.params.thoughtId })
      .then((dbThoughtsData) => {
        if (!dbThoughtsData) {
          return res.status(404).json({ message: 'No Thoughts with this id!' });
        }
        // remove thoughtId from user's `Thoughts` field
        return Users.findOneAndUpdate(
          { Thought: req.params.thoughtId },
          { $pull: { Thoughts: req.params.thoughtId } },
          { new: true }
        );
      })
      .then((dbUserData) => {
        if (!dbUserData) {
          return res.status(404).json({ message: 'No user with this id!' });
        }
        res.json({ message: 'Thought successfully deleted!' });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // add a reaction 
  addReaction(req, res) {
    Thoughts.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body } },
      { runValidators: true, new: true }
    )
      .then((dbThoughtsData) => {
        if (!dbThoughtsData) {
          return res.status(404).json({ message: 'No Thoughts with this id!' });
        }
        res.json(dbThoughtsData);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // remove reaction 
  removeReaction(req, res) {
    Thoughts.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { runValidators: true, new: true }
    )
      .then((dbThoughtsData) => {
        if (!dbThoughtsData) {
          return res.status(404).json({ message: 'No Thoughts with this id!' });
        }
        res.json(dbThoughtsData);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
};

module.exports = thoughtsController;