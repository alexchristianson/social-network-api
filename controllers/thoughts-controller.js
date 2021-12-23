const { Thoughts, Users } = require('../models');

const ThoughtsController = {
  // get all Thoughts
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
  // delete Thoughts
  deleteThoughts(req, res) {
    Thoughts.findOneAndRemove({ _id: req.params.ThoughtId })
      .then((dbThoughtsData) => {
        if (!dbThoughtsData) {
          return res.status(404).json({ message: 'No Thoughts with this id!' });
        }
        // remove Thoughts id from user's `Thoughts` field
        return Users.findOneAndUpdate(
          { Thought: req.params.ThoughtId },
          { $pull: { Thoughts: req.params.ThoughtId } },
          { new: true }
        );
      })
      .then((dbUserData) => {
        if (!dbUserData) {
          return res.status(404).json({ message: 'Thoughts created but no user with this id!' });
        }
        res.json({ message: 'Thoughts successfully deleted!' });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
  // add a reaction to a Thoughts
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
  // remove reaction from a Thoughts
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

module.exports = ThoughtsController;