const Job = require('../models/Job');
const { validationResult } = require('express-validator');

/**
 * Get all active jobs with optional search and filter
 * GET /api/jobs
 * Query params: search, location
 */
const getAllJobs = async (req, res, next) => {
  try {
    const { search, location } = req.query;

    let filter = { isActive: true };

    // Search by company name or role title
    if (search) {
      filter.$or = [
        { companyName: { $regex: search, $options: 'i' } },
        { roleTitle: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by location
    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    const jobs = await Job.find(filter)
      .sort({ datePosted: -1 })
      .populate('createdBy', 'email');

    res.json({
      success: true,
      totalJobs: jobs.length,
      jobs,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single job by ID
 * GET /api/jobs/:id
 */
const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id).populate('createdBy', 'email');

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json({
      success: true,
      job,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create new job (Admin only)
 * POST /api/jobs
 */
const createJob = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { companyName, roleTitle, location, requirements, whoCanApply, applicationUrl, deadline } =
      req.body;

    const job = new Job({
      companyName,
      roleTitle,
      location,
      requirements,
      whoCanApply,
      applicationUrl,
      deadline: new Date(deadline),
      createdBy: req.user.userId,
    });

    await job.save();
    await job.populate('createdBy', 'email');

    res.status(201).json({
      success: true,
      message: 'Job created successfully',
      job,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update job (Admin only)
 * PUT /api/jobs/:id
 */
const updateJob = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Verify user is the one who created the job or is checking permissions
    const { companyName, roleTitle, location, requirements, whoCanApply, applicationUrl, deadline } =
      req.body;

    job = await Job.findByIdAndUpdate(
      req.params.id,
      {
        companyName,
        roleTitle,
        location,
        requirements,
        whoCanApply,
        applicationUrl,
        deadline: new Date(deadline),
      },
      { new: true, runValidators: true }
    ).populate('createdBy', 'email');

    res.json({
      success: true,
      message: 'Job updated successfully',
      job,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete job (Admin only)
 * DELETE /api/jobs/:id
 */
const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findByIdAndRemove(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json({
      success: true,
      message: 'Job deleted successfully',
    });
  } catch (error) {
    // Handle deprecated findByIdAndRemove
    try {
      const job = await Job.findByIdAndDelete(req.params.id);
      if (!job) {
        return res.status(404).json({ message: 'Job not found' });
      }
      res.json({
        success: true,
        message: 'Job deleted successfully',
      });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = { getAllJobs, getJobById, createJob, updateJob, deleteJob };
