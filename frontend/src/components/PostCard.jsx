import React, { useContext, useState } from 'react';
import { FaCommentDots } from 'react-icons/fa';
import { AuthContext } from '../auth/AuthContext';
import API from '../api/api';
import './PostCard.css';

const PostCard = ({ post }) => {
  const { user } = useContext(AuthContext);
  console.log("User => ",user);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [content, setContent] = useState(post.posts_content);
  const [newComment, setNewComment] = useState('');
  const [showInput, setShowInput] = useState(false);

  const isOwner = user.userId === post.users_id;

  
const handleAddComment = async () => {
  if (!newComment.trim()) return;

  try {
            console.log(user.userId)
            console.log(newComment.trim())
            await API.post(`/posts/${post.posts_id}/comments`, {
            users_id: user.userId,
            comments_comment: newComment.trim(),
            });
            setNewComment('');
            fetchComments();
            setShowInput(false);
        } catch (err) {
            alert('Failed to add comment');
        }
    };

  const fetchComments = async () => {
    try {
      const res = await API.get(`/posts/${post.posts_id}/comments`);
      setComments(res.data);

      console.log("Comments => ",comments, res.data);
      console.log("User => ",user);
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };

  const handleToggleComments = async () => {
    if (!showComments) await fetchComments();
    setShowComments(!showComments);
  };

  const handleUpdate = async () => {
    try {
      await API.put(`/posts/${post.posts_id}`, { name : post.posts_name, content : content });
      setEditMode(false);
      window.location.reload();
    } catch (err) {
      alert('Error updating post');
    }
  };

  const handleDelete = async () => {
    try {
      await API.delete(`/posts/${post.posts_id}`);
      window.location.reload();
    } catch (err) {
      alert('Error deleting post');
    }
  };

  const toggleEditMode = (commentId, status) => {
    setComments((prev) =>
      prev.map((comment) =>
        comment.comments_id === commentId
          ? {
              ...comment,
              editing: status,
              editedText: comment.comments_comment,
            }
          : comment
      )
    );
  };

  const handleSaveComment = async (commentId, updatedText) => {
    try {
      await API.put(`posts/${post.posts_id}/comments/${commentId}`, {
        comments_comment: updatedText.trim(),
      });
      fetchComments();
    } catch (err) {
      alert('Error updating comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await API.delete(`posts/${post.posts_id}/comments/${commentId}`);
      fetchComments();
    } catch (err) {
      alert('Error deleting comment');
    }
  };




  return (
    <div className="post-card">
      <div className="post-header">
        <h4>{post.posts_name}</h4>
        <span>{new Date(post.created_at).toLocaleString()}</span>
      </div>

      {editMode ? (
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
        />
      ) : (
        <p>{post.posts_content}</p>
      )}

      <div className="post-actions">
        <button onClick={handleToggleComments}>
          {showComments ? 'Hide' : 'View'} Comments
        </button>
        {isOwner && (
          <>
            {editMode ? (
              <button onClick={handleUpdate}>Save</button>
            ) : (
              <button onClick={() => setEditMode(true)}>Edit</button>
            )}
            <button onClick={handleDelete} className="delete-btn">Delete</button>
          </>
        )}
      </div>

      {showComments && (
        <div className="comment-section">
            {comments.length === 0 ? (
                <p>No comments yet.</p>
            ) : (
                comments.map((c) => (
                  <div key={c.comments_id} className="comment">
                    <strong>{c.username}</strong>:{" "}
                    {c.user_id === user.userId ? (
                      <>
                        {c.editing ? (
                          <>
                            <input
                              type="text"
                              value={c.editedText}
                              onChange={(e) =>
                                setComments((prev) =>
                                  prev.map((comment) =>
                                    comment.comments_id === c.comments_id
                                      ? { ...comment, editedText: e.target.value }
                                      : comment
                                  )
                                )
                              }
                            />
                            <button onClick={() => handleSaveComment(c.comments_id, c.editedText)}>Save</button>
                            <button onClick={() => toggleEditMode(c.comments_id, false)}>Cancel</button>
                          </>
                        ) : (
                          <>
                            {c.comments_comment}
                            <button onClick={() => toggleEditMode(c.comments_id, true)}>Edit</button>
                            <button onClick={() => handleDeleteComment(c.comments_id)}>Delete</button>
                          </>
                        )}
                      </>
                    ) : (
                      c.comments_comment
                    )}
                  </div>
                ))
            )}

            <div className="comment-input-toggle">
                <button onClick={() => setShowInput(!showInput)} title="Add Comment">
                    <FaCommentDots />
                </button>
            </div>
            {showInput && (
                <div className="quick-comment">
                <input
                    type="text"
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddComment();
                    }}
                />
                <button onClick={handleAddComment}>Send</button>
                </div>
            )}
        </div>
      )}
    </div>
  );
};

export default PostCard;