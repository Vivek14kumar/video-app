const express = require("express");
const router = express.Router();
const { getDB } = require("../db.cjs");

// GET all categories
router.get("/get-categories", async (req, res) => {
  try {
    const data = await getDB().collection("tblcategories").find().toArray();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

// GET all admins
router.get("/get-admin", async (req, res) => {
  try {
    const data = await getDB().collection("tbladmin").find().toArray();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch admins" });
  }
});

// GET all users
router.get("/get-users", async (req, res) => {
  try {
    const data = await getDB().collection("tblusers").find().toArray();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Register new user
router.post("/register-user", async (req, res) => {
  try {
    await getDB().collection("tblusers").insertOne(req.body);
    res.json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: "Registration failed" });
  }
});

// GET all videos
router.get("/get-videos", async (req, res) => {
  try {
    const data = await getDB().collection("tblvideos").find().toArray();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch videos" });
  }
});

// GET single video by ID
router.get("/get-video/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data = await getDB().collection("tblvideos").findOne({ video_id: id });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch video" });
  }
});

// Add new video
router.post("/add-video", async (req, res) => {
  try {
    req.body.video_id = parseInt(req.body.video_id);
    req.body.likes = parseInt(req.body.likes);
    req.body.views = parseInt(req.body.views);
    req.body.category_id = parseInt(req.body.category_id);

    await getDB().collection("tblvideos").insertOne(req.body);
    res.json({ message: "Video added successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to add video" });
  }
});

// Edit video
router.put("/edit-video/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updateData = {
      video_id: parseInt(req.body.video_id),
      title: req.body.title,
      description: req.body.description,
      comment: req.body.comment,
      likes: parseInt(req.body.likes),
      views: parseInt(req.body.views),
      url: req.body.url,
      category_id: parseInt(req.body.category_id)
    };

    await getDB().collection("tblvideos").updateOne({ video_id: id }, { $set: updateData });
    res.json({ message: "Video updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update video" });
  }
});

// Delete video
router.delete("/delete-video/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await getDB().collection("tblvideos").deleteOne({ video_id: id });
    res.json({ message: "Video deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete video" });
  }
});

// Like video
router.post("/like/:videoId", async (req, res) => {
  try {
    const videoId = parseInt(req.params.videoId);
    const result = await getDB().collection("tblvideos").updateOne(
      { video_id: videoId },
      { $inc: { likes: 1 } }
    );

    if (result.modifiedCount === 1) {
      res.json({ success: true, message: "Like updated!" });
    } else {
      res.status(404).json({ success: false, message: "Video not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to like video" });
  }
});

module.exports = router;
