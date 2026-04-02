import { Request, Response, NextFunction } from 'express';
import { validationResult, body } from 'express-validator';

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const registerValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
  body('name').optional().isString().trim(),
  validateRequest,
];

export const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
  validateRequest,
];

export const taskValidation = [
  body('title').notEmpty().withMessage('Title is required').trim(),
  body('description').optional().isString().trim(),
  body('completed').optional().isBoolean(),
  validateRequest,
];
