const { body, validationResult } = require('express-validator');

exports.validateComment = [
  body('comments_comment').trim().isLength({ min: 2, max: 200 }).withMessage('Invalid comment'),
  body('comments_comment').customSanitizer(v => v.replace(/<\/?[^>]+(>|$)/g, '')),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg });
    next();
  },
];