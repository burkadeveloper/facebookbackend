const express = require("express");
const router = express.Router();
const Person = require("../models/Person");
const Vote = require("../models/Vote");

// GET /api/person - returns the person data (for demo, return first person)
router.get("/person", async (req, res) => {
  try {
    let person = await Person.findOne();
    if (!person) {
      // Create a default person if none exists
      person = new Person({
        name: "Emma Watson",
        sex: "Female",
        age: 34,
        photoUrl: "https://randomuser.me/api/portraits/women/68.jpg",
        voteCount: 0,
      });
      await person.save();
    }
    res.json(person);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/vote - increments vote count and records the user's vote
router.post("/vote", async (req, res) => {
  const { userEmail, personId } = req.body;
  if (!userEmail || !personId) {
    return res
      .status(400)
      .json({ error: "userEmail and personId are required" });
  }

  try {
    // Check if user already voted for this person
    const existingVote = await Vote.findOne({ userEmail, personId });
    if (existingVote) {
      return res
        .status(400)
        .json({ error: "You have already voted for this person" });
    }

    // Increment vote count
    const person = await Person.findById(personId);
    if (!person) return res.status(404).json({ error: "Person not found" });

    person.voteCount += 1;
    await person.save();

    // Record the vote
    const vote = new Vote({ userEmail, personId });
    await vote.save();

    res.json({ message: "Vote recorded", voteCount: person.voteCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// PUT /api/person/photo - update photoUrl manually
router.put("/person/photo", async (req, res) => {
  try {
    const { photoUrl } = req.body;
    if (!photoUrl)
      return res.status(400).json({ error: "photoUrl is required" });

    // Get the first person (assuming only one profile)
    let person = await Person.findOne();
    if (!person) {
      person = new Person({
        name: "Emma Watson",
        sex: "Female",
        age: 34,
        photoUrl,
        voteCount: 0,
      });
    } else {
      person.photoUrl = photoUrl;
    }
    await person.save();
    res.json({ message: "Photo updated successfully", photoUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
