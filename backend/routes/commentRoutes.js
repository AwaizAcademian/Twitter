const express = require('express');
const router = express.Router({mergeParams : true});
const auth = require('../middlewares/authMiddleware');
const controller = require('../controllers/commentsController');
const { validateComment } = require('../validators/commentValidator');

router.get('/comments', controller.getCommentsByPost);
router.post('/comments', auth, validateComment, controller.createComment);
router.put('/comments/:commentsid', auth, validateComment, controller.updateComment);
router.delete('/comments/:commentsid', auth, controller.deleteComment);

module.exports = router;
