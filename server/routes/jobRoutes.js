const express = require('express');
const { body } = require('express-validator');
const {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
} = require('../controllers/jobController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

/**
 * Validation rules for job creation/update
 */
const validateJob = [
  body('companyName').trim().notEmpty().withMessage('Company name is required'),
  body('roleTitle').trim().notEmpty().withMessage('Role title is required'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('requirements').notEmpty().withMessage('Requirements are required'),
  body('whoCanApply').trim().notEmpty().withMessage('Who can apply information is required'),
  body('applicationUrl')
    .isURL()
    .withMessage('Please provide a valid application URL'),
  body('deadline')
    .isISO8601()
    .withMessage('Please provide a valid deadline date'),
];

/**
 * Public routes
 */
router.get('/', getAllJobs);
router.get('/:id', getJobById);

/**
 * Admin routes (protected)
 */
router.post('/', authMiddleware, adminMiddleware, validateJob, createJob);
router.put('/:id', authMiddleware, adminMiddleware, validateJob, updateJob);
router.delete('/:id', authMiddleware, adminMiddleware, deleteJob);

module.exports = router;
