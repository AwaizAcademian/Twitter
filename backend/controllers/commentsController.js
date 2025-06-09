const pool = require('../db');

exports.getCommentsByPost = async (req, res) => {
  const { postId } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT c.*, u.users_username AS username
      FROM comments c
      JOIN users u ON c.user_id = u.users_id
      WHERE c.post_id = $1 AND c.disabled = false
      ORDER BY c.created_at ASC;
      `,
      [postId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching comments:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};


exports.createComment = async (req, res) => {
  try{
    const { postId } = req.params;
  console.log(postId);
  const { users_id, comments_comment } = req.body;
  console.log(users_id, comments_comment);
  const post = await pool.query('SELECT * FROM posts WHERE posts_id = $1', [postId]);
  if (post.rows.length === 0) return res.status(404).json({ error: 'Post not found' });

  const result = await pool.query(
    'INSERT INTO comments (post_id, user_id, comments_comment) VALUES ($1, $2, $3) RETURNING *',
    [postId, users_id, comments_comment.trim()]
  );
  res.status(201).json(result.rows[0]);
  }catch(err){
    console.log(err)
  }
};

exports.updateComment = async (req, res) => {
  const { commentsid } = req.params;
  const { comments_comment } = req.body;
  const result = await pool.query(
    'UPDATE comments SET comments_comment = $1, updated_at = CURRENT_TIMESTAMP WHERE comments_id = $2 RETURNING *',
    [comments_comment.trim(), commentsid]
  );
  if (result.rows.length === 0) return res.status(404).json({ error: 'Comment not found' });
  res.json(result.rows[0]);
};

exports.deleteComment = async (req, res) => {
  const { commentsid } = req.params;
  const result = await pool.query(
            `UPDATE comments SET disabled = true, updated_at = CURRENT_TIMESTAMP WHERE comments_id = $1 RETURNING *`,
            [commentsid]
            );
  if (result.rows.length === 0) return res.status(404).json({ error: 'Comment not found' });
  res.json({ message: 'Comment deleted' });
};
