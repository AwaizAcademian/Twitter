const { body, validationResult } = require('express-validator');

exports.validatePost = [
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Invalid name'),
  body('content').trim().isLength({ min: 5, max: 280 }).withMessage('Invalid content'),
  body('name').customSanitizer(v => v.replace(/<\/?[^>]+(>|$)/g, '')),
  body('content').customSanitizer(v => v.replace(/<\/?[^>]+(>|$)/g, '')),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg });
    next();
  },
];