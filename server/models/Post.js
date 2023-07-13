// models/Post.js
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  image: String,
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
