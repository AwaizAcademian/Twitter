const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const controller = require('../controllers/postController');
const { validatePost } = require('../validators/postValidator');

router.get('/', controller.getAllPosts);
router.post('/', auth, validatePost, controller.createPost);
router.put('/:id', auth, validatePost, controller.updatePost);
router.delete('/:id', auth, controller.deletePost);

module.exports = router;