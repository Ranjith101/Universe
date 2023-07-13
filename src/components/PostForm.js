import React, { useState } from 'react';
import axios from 'axios';
import '../styles/postform.css';

const PostForm = () => {
  const [postText, setPostText] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

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
    </div>
  );
};

export default PostForm;
