const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  personId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Person",
    required: true,
  },
  votedAt: { type: Date, default: Date.now },
});

// Ensure a user can vote only once per person
voteSchema.index({ userEmail: 1, personId: 1 }, { unique: true });

module.exports = mongoose.model("Vote", voteSchema);
