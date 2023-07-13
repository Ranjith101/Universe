import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/postform.css';
import PostCard from './PostCard';

const PostForm = () => {
  const [postText, setPostText] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Fetch existing posts
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/posts');
      setPosts(response.data);
      console.log(response.data)
    } catch (error) {
      console.error(error);
    }
  };

  const handlePostTextChange = (e) => {
    setPostText(e.target.value);
  };

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('text', postText);
    if (selectedImage) {
      formData.append('image', selectedImage);
    }

    try {
      await axios.post('http://localhost:3001/api/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // Reset form
      setPostText('');
      setSelectedImage(null);
      // Fetch updated posts
      fetchPosts();
      // Show success message
      alert('Post created successfully');
    } catch (error) {
      console.error(error);
      // Handle error
      alert('Failed to create post');
    }
  };

  return (
    <div className="container">
      <h2>Create a Post</h2>
      <form onSubmit={handlePostSubmit} className="post-form">
        <div className="mb-3">
          <textarea
            className="form-control"
            name="text"
            placeholder="Write your post..."
            value={postText}
            onChange={handlePostTextChange}
            rows={4}
          />
        </div>
        <div className="mb-3">
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>
        <div className="mb-3">
          <button type="submit" className="btn btn-primary">
            Post
          </button>
        </div>
      </form>

      {posts.map((post) => (
      <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
};

export default PostForm;
