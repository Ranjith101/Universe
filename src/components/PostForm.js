import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/PostForm.module.css';
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
    formData.append('title', postText);
    if (selectedImage) {
      const imageBlob = new Blob([selectedImage], { type: selectedImage.type });
      formData.append('image', imageBlob, selectedImage.name);
    }

    try {
      const response = await axios.post('http://localhost:3001/api/posts', formData, {
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
  const handlePostDelete = (postId) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
  };
  return (
    <div className={styles.container}>
      <h2>Create a Post</h2>
      <form onSubmit={handlePostSubmit} className={styles.postForm}>
        <div className={styles.formGroup}>
          <textarea
            className={styles.textarea}
            name="text"
            placeholder="Write your post..."
            value={postText}
            onChange={handlePostTextChange}
            rows={4}
          />
        </div>
        <div className={styles.formGroup}>
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>
        <div className={styles.formGroup}>
          <button type="submit" className={styles.submitButton}>
            Post
          </button>
        </div>
      </form>

      <div className={styles.postCards}>
        {posts.map((post) => (
          <PostCard key={post._id} post={post} onDelete={handlePostDelete} />
        ))}
      </div>
    </div>
  );
};

export default PostForm;
