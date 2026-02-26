import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { showInfo } from '../utils/helpers';

/**
 * Job Card Component
 * Displays individual job listing
 */
export default function JobCard({ job }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  /**
   * Handle apply button click
   */
  const handleApply = () => {
    if (!isAuthenticated) {
      showInfo('Please login to apply for jobs');
      navigate('/login');
      return;
    }

    // Redirect to external application URL
    window.open(job.applicationUrl, '_blank');
  };

  /**
   * Check if job is posted within last 5 days
   */
  const isNew = () => {
    const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);
    return new Date(job.datePosted) > fiveDaysAgo;
  };

  return (
  <div className="relative group rounded-2xl p-[2px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-500 hover:shadow-[0_0_25px_rgba(168,85,247,0.6)]">

    <div className="bg-white rounded-2xl p-6 h-full">

      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl font-bold text-gray-900">
              {job.roleTitle}
            </h3>
            {isNew() && <span className="badge-new">NEW</span>}
          </div>
          <p className="text-lg text-blue-600 font-semibold underline">
            {job.companyName}
          </p>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-2 text-gray-700">
          <span className="font-semibold">📍 Location:</span>
          <span>{job.location}</span>
        </div>

        <div className="flex items-center gap-2 text-gray-700">
          <span className="font-semibold">👥 Can Apply:</span>
          <span>{job.whoCanApply}</span>
        </div>

        <div className="flex items-center gap-2 text-gray-700">
          <span className="font-semibold">📅 Deadline:</span>
          <span>{new Date(job.deadline).toLocaleDateString('en-GB')}</span>
        </div>

        <div className="mt-4">
          <p className="font-semibold text-gray-700 mb-2">
            Requirements:
          </p>
          <p className="text-gray-600 whitespace-pre-line text-sm">
            {job.requirements}
          </p>
        </div>
      </div>

      <button
        onClick={handleApply}
        className="btn-primary w-full"
      >
        Apply Here
      </button>

    </div>
  </div>
);
}
