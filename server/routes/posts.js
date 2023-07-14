// routes/posts.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const upload = multer({ dest: './uploads/' });

// Import the Post model
const Post = require('../models/Post');

// Create a new post
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, content } = req.body;
    const image = req.file ? req.file.filename : null;

    const newPost = new Post({ title, content, image });
    await newPost.save();

    res.json({ message: 'Post created successfully' });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Failed to create post' });
  }
});

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (error) {
    console.error('Error retrieving posts:', error);
    res.status(500).json({ message: 'Failed to retrieve posts' });
  }
});

// Get image by filename
router.get('/image/:filename', (req, res) => {
  const filename = req.params.filename;
  const imagePath = path.join(__dirname, '../uploads/', filename);
  res.sendFile(imagePath);
});

module.exports = router;
