const mongoose = require('mongoose');

/**
 * Job Schema
 * Stores job/internship listings
 */
const jobSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    roleTitle: {
      type: String,
      required: [true, 'Role title is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    requirements: {
      type: String,
      required: [true, 'Requirements are required'],
    },
    whoCanApply: {
      type: String,
      required: [true, 'Who can apply information is required'],
      trim: true,
    },
    applicationUrl: {
      type: String,
      required: [true, 'Application URL is required'],
      match: [/^https?:\/\/.+/, 'Please provide a valid URL'],
    },
    deadline: {
      type: Date,
      required: [true, 'Deadline is required'],
    },
    datePosted: {
      type: Date,
      default: Date.now,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

/**
 * Index for efficient searching
 */
jobSchema.index({ companyName: 'text', roleTitle: 'text' });

/**
 * Virtual: Calculate if job is new (posted within last 5 days)
 */
jobSchema.virtual('isNew').get(function () {
  const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);
  return this.datePosted > fiveDaysAgo;
});

/**
 * Virtual: Check if deadline has passed
 */
jobSchema.virtual('isExpired').get(function () {
  return this.deadline < new Date();
});

// Ensure virtuals are included in JSON output
jobSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Job', jobSchema);
