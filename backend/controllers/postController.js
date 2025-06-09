const pool = require('../db')

exports.getAllPosts = async (req, res) => {
    try{
        const result = await pool.query('SELECT * from posts where disabled = false ORDER BY created_at DESC')
        res.json(result.rows); 
    }catch(err){
        console.log("Error => ",err)
        res.status(500).json({message : "Server Error"})
    }
}

exports.createPost = async (req, res) => {
    const {users_id, name, content} = req.body;

    if (!users_id || !name || !content) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const result = await pool.query(
      `INSERT INTO posts (users_id, posts_name, posts_content)
       VALUES ($1, $2, $3)
       RETURNING posts_id, users_id, posts_name, posts_content, created_at`,
      [users_id, name.trim(), content.trim()]
    );

    res.status(201).json(result.rows[0]);
}

exports.updatePost = async (req, res) => {
    const { id } = req.params;
    const { name, content } = req.body;
    const result = await pool.query(
    'UPDATE posts SET posts_name = $1, posts_content = $2 WHERE posts_id = $3 RETURNING *',
    [name.trim(), content.trim(), id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Post not found' });
    res.json(result.rows[0]);
}

exports.deletePost = async (req, res) => {
    try{
        const { id } = req.params;
        const result = await pool.query(
            `UPDATE posts SET disabled = true, updated_at = CURRENT_TIMESTAMP WHERE posts_id = $1 RETURNING *`,
            [id]
            );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Post not found' });
        res.json({ message: 'Post deleted' });
    }catch(err){
        console.error('Soft delete error:', err);
        res.status(500).json({ message: 'Server error' });
    }
    
}