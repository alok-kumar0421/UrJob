const express = require('express');
const { body } = require('express-validator');
const { register, login, getMe, logout } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

/**
 * Validation rules for auth
 */
const validateEmail = body('email')
  .isEmail()
  .normalizeEmail()
  .withMessage('Please provide a valid email');

const validatePassword = body('password')
  .isLength({ min: 6 })
  .withMessage('Password must be at least 6 characters');

/**
 * Routes
 */
router.post('/register', validateEmail, validatePassword, register);
router.post('/login', validateEmail, validatePassword, login);
router.get('/me', authMiddleware, getMe);
router.post('/logout', logout);

module.exports = router;
