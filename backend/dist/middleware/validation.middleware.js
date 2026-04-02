"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskValidation = exports.loginValidation = exports.registerValidation = exports.validateRequest = void 0;
const express_validator_1 = require("express-validator");
const validateRequest = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};
exports.validateRequest = validateRequest;
exports.registerValidation = [
    (0, express_validator_1.body)('email').isEmail().withMessage('Please provide a valid email'),
    (0, express_validator_1.body)('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long'),
    (0, express_validator_1.body)('name').optional().isString().trim(),
    exports.validateRequest,
];
exports.loginValidation = [
    (0, express_validator_1.body)('email').isEmail().withMessage('Please provide a valid email'),
    (0, express_validator_1.body)('password').notEmpty().withMessage('Password is required'),
    exports.validateRequest,
];
exports.taskValidation = [
    (0, express_validator_1.body)('title').notEmpty().withMessage('Title is required').trim(),
    (0, express_validator_1.body)('description').optional().isString().trim(),
    (0, express_validator_1.body)('completed').optional().isBoolean(),
    exports.validateRequest,
];
