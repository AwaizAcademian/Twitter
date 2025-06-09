import React, { useState, useContext } from 'react';
import API from '../api/api';
import { AuthContext } from '../auth/AuthContext';
import './CreatePost.css';

const CreatePost = ({ onPostCreated }) => {
  const { user } = useContext(AuthContext);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePost = async () => {
    if (!title.trim() || !content.trim()) return;

    setLoading(true);
    try {
      await API.post('/posts', {
        users_id: user.userId,
        name: title.trim(),
        content: content.trim(),
      });
      setTitle('');
      setContent('');
      onPostCreated();
    } catch (err) {
      alert('Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post">
      <input
        type="text"
        placeholder="Post title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        maxLength={100}
        className="title-input"
        required
      />
      <textarea
        rows={3}
        placeholder="What's on your mind?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        maxLength={280}
      />
      <div className="post-footer">
        <span>{280 - content.length} characters left</span>
        <button onClick={handlePost} disabled={loading}>
          {loading ? 'Posting...' : 'Post'}
        </button>
      </div>
    </div>
  );
};

export default CreatePost;
