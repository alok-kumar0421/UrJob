import { toast } from 'react-toastify';

/**
 * Show success toast notification
 */
export const showSuccess = (message) => {
  toast.success(message, {
    position: 'top-right',
    autoClose: 3000,
  });
};

/**
 * Show error toast notification
 */
export const showError = (message) => {
  toast.error(message, {
    position: 'top-right',
    autoClose: 3000,
  });
};

/**
 * Show info toast notification
 */
export const showInfo = (message) => {
  toast.info(message, {
    position: 'top-right',
    autoClose: 3000,
  });
};

/**
 * Format date to readable format
 */
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Calculate days since posting
 */
export const daysSincePosted = (datePosted) => {
  const days = Math.floor((Date.now() - new Date(datePosted)) / (1000 * 60 * 60 * 24));
  return days;
};

/**
 * Check if job is new (posted within last 5 days)
 */
export const isJobNew = (datePosted) => {
  return daysSincePosted(datePosted) <= 5;
};

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

/**
 * Truncate text to specified length
 */
export const truncateText = (text, length = 100) => {
  return text.length > length ? text.substring(0, length) + '...' : text;
};
