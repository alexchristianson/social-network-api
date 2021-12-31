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
  getThoughtsById(req, res) {
    Thoughts.findOne({ _id: req.params.ThoughtId })
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
  createThoughts(req, res) {
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
          return res.status(404).json({ message: 'Thoughts created but no user with this id!' });
        }
        res.json({ message: 'Thoughts successfully created!' });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
  // update a thought
  updateThoughts(req, res) {
    Thoughts.findOneAndUpdate({ _id: req.params.ThoughtId }, { $set: req.body }, { runValidators: true, new: true })
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
  deleteThoughts(req, res) {
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
        res.json({ message: 'Thoughts successfully deleted!' });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // add a reaction 
  addReaction(req, res) {
    Thoughts.findOneAndUpdate(
      { _id: req.params.ThoughtId },
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
      { _id: req.params.ThoughtsId },
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