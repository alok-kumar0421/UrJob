import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import API from '../utils/api';
import { showError, showSuccess } from '../utils/helpers';

/**
 * Admin Dashboard Component
 * Protected route for adding, editing, and deleting jobs
 */
export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    companyName: '',
    roleTitle: '',
    location: '',
    requirements: '',
    whoCanApply: '',
    applicationUrl: '',
    deadline: '',
  });

  /**
   * Fetch all jobs
   */
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await API.get('/jobs');
      setJobs(response.data.jobs);
    } catch (error) {
      showError('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle form input changes
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Handle form submission (create or update)
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        // Update existing job
        await API.put(`/jobs/${editingId}`, formData);
        showSuccess('Job updated successfully');
      } else {
        // Create new job
        await API.post('/jobs', formData);
        showSuccess('Job created successfully');
      }

      // Reset form and refresh jobs
      setFormData({
        companyName: '',
        roleTitle: '',
        location: '',
        requirements: '',
        whoCanApply: '',
        applicationUrl: '',
        deadline: '',
      });
      setEditingId(null);
      setShowForm(false);
      fetchJobs();
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to save job');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle delete job
   */
  const handleDelete = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) {
      return;
    }

    try {
      setLoading(true);
      await API.delete(`/jobs/${jobId}`);
      showSuccess('Job deleted successfully');
      fetchJobs();
    } catch (error) {
      showError('Failed to delete job');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle edit job
   */
  const handleEdit = (job) => {
    setFormData({
      companyName: job.companyName,
      roleTitle: job.roleTitle,
      location: job.location,
      requirements: job.requirements,
      whoCanApply: job.whoCanApply,
      applicationUrl: job.applicationUrl,
      deadline: job.deadline.split('T')[0], // Format date for input
    });
    setEditingId(job._id);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-600 mb-8">
          Welcome, <strong>{user?.email}</strong>
        </p>

        {/* Add Job Button */}
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            if (showForm) {
              setFormData({
                companyName: '',
                roleTitle: '',
                location: '',
                requirements: '',
                whoCanApply: '',
                applicationUrl: '',
                deadline: '',
              });
            }
          }}
          className="btn-primary mb-6"
        >
          {showForm && !editingId ? 'Cancel' : '+ Add New Job'}
        </button>

        {/* Job Form */}
        {showForm && (
          <div className="card mb-8">
            <h2 className="text-2xl font-bold mb-6">
              {editingId ? 'Edit Job' : 'Create New Job'}
            </h2>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Role Title</label>
                <input
                  type="text"
                  name="roleTitle"
                  value={formData.roleTitle}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Who Can Apply</label>
                <input
                  type="text"
                  name="whoCanApply"
                  value={formData.whoCanApply}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g., B.Tech, M.Tech students"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Application URL</label>
                <input
                  type="url"
                  name="applicationUrl"
                  value={formData.applicationUrl}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="https://example.com/apply"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Deadline</label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2">Requirements</label>
                <textarea
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  rows="4"
                  className="input-field"
                  placeholder="Enter job requirements..."
                  required
                />
              </div>

              <div className="md:col-span-2 flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary disabled:opacity-50"
                >
                  {loading ? 'Saving...' : editingId ? 'Update Job' : 'Create Job'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setFormData({
                      companyName: '',
                      roleTitle: '',
                      location: '',
                      requirements: '',
                      whoCanApply: '',
                      applicationUrl: '',
                      deadline: '',
                    });
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Jobs List */}
        <div>
          <h2 className="text-2xl font-bold mb-4">All Jobs ({jobs.length})</h2>

          {loading && !showForm ? (
            <div className="text-center py-10">Loading...</div>
          ) : jobs.length === 0 ? (
            <div className="card text-center py-10">
              <p className="text-gray-600">No jobs created yet. Create one to get started!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div key={job._id} className="card">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold">{job.roleTitle}</h3>
                      <p className="text-gray-600">{job.companyName}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(job)}
                        className="btn-secondary text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(job._id)}
                        className="btn-danger text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-semibold text-gray-700">Location</p>
                      <p>{job.location}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">Who Can Apply</p>
                      <p>{job.whoCanApply}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">Deadline</p>
                      <p>{new Date(job.deadline).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
