import { useState, useEffect } from 'react';
import API from '../utils/api';
import { showError } from '../utils/helpers';
import JobCard from '../components/JobCard';

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    filterJobs();
  }, [searchTerm, locationFilter, jobs]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await API.get('/jobs');
      const jobsData = response.data.jobs || [];
      setJobs(jobsData);

      const uniqueLocations = [...new Set(jobsData.map((job) => job.location))];
      setLocations(uniqueLocations.sort());
    } catch (error) {
      showError('Failed to fetch jobs');
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const filterJobs = () => {
    let filtered = jobs;

    if (searchTerm) {
      filtered = filtered.filter(
        (job) =>
          job.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.roleTitle.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (locationFilter) {
      filtered = filtered.filter((job) => job.location === locationFilter);
    }

    setFilteredJobs(filtered);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-400 via-indigo-600 to-purple-600 text-white py-24">
        <div className="max-w-5xl mx-auto text-center px-6">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
            Discover Your Next <span className="text-yellow-300">Opportunity</span>
          </h1>
          <p className="text-lg md:text-xl opacity-90">
            Explore the latest internships and job openings from top companies.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <div className="grid md:grid-cols-2 gap-6">

            <input
              type="text"
              placeholder="Search company or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition"
            />

            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition"
            >
              <option value="">All Locations</option>
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>

          </div>
        </div>

        {/* Jobs Count */}
        <h2 className="text-3xl font-bold mb-10">
          Active Jobs <span className="text-blue-600">({filteredJobs.length})</span>
        </h2>

        {/* Loading */}
        {loading ? (
          <div className="text-center py-12 text-gray-600 text-lg">
            Loading jobs...
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl shadow text-center text-gray-600">
            {jobs.length === 0
              ? 'No jobs available yet.'
              : 'No jobs match your search.'}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredJobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}