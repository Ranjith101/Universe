import React, { useState, useEffect } from 'react';
import { FaThumbsUp, FaTrashAlt, FaShareAlt } from 'react-icons/fa';
import axios from 'axios';

const PostCard = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [imageData, setImageData] = useState('');

  useEffect(() => {
    // Fetch the image data when the component mounts
    fetchImageData();
  }, []);

  const fetchImageData = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/posts/image/${post.image}`, {
        responseType: 'arraybuffer',
      });
      const base64Image = Buffer.from(response.data, 'binary').toString('base64');
      setImageData(`data:image/jpeg;base64,${base64Image}`);
    } catch (error) {
      console.error('Error fetching image data:', error);
    }
  };

  const handleLike = () => {
    setLiked(!liked);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3001/api/posts/${post._id}`);
      // Do something after successful deletion
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (comment.trim() !== '') {
      const newComment = {
        text: comment,
        date: new Date().toLocaleString(),
      };
      setComments([...comments, newComment]);
      setComment('');
    }
  };

  const handleShare = () => {
    const shareMessage = `Shared from uniVerse: ${post.title}`;
    const shareUrl = window.location.href;
  
    // Share via WhatsApp
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)} ${encodeURIComponent(shareUrl)}`;
    window.open(whatsappUrl);
  
    // Share via Facebook
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(facebookUrl);
  
    // Share via LinkedIn
    const linkedinUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareMessage)}`;
    window.open(linkedinUrl);
  };
 console.log(typeof imageData);
  return (
    <div className="post-card">
      <h3>{post.title}</h3>
      {imageData && <img src={imageData} alt="Post" />}
      <div className="post-actions">
        <button onClick={handleLike}>
          <FaThumbsUp color={liked ? 'blue' : 'gray'} />
        </button>
        <button onClick={handleDelete}>
          <FaTrashAlt color="red" />
        </button>
        <button onClick={handleShare}>
          <FaShareAlt color="green" />
        </button>
      </div>
      <div className="comments-section">
        <h4>Comments</h4>
        {comments.map((comment, index) => (
          <p key={index}>{comment.text} - {comment.date}</p>
        ))}
        <form onSubmit={handleCommentSubmit}>
          <input type="text" value={comment} onChange={handleCommentChange} placeholder="Add a comment" />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default PostCard;
