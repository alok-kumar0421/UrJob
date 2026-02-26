import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { showSuccess } from '../utils/helpers';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    showSuccess('Logged out successfully');
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/70 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        
        <Link
          to="/"
          className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
        >
          UrJob
        </Link>

        <div className="flex items-center gap-4">
          {isAuthenticated && user?.isAdmin && (
            <Link
              to="/admin"
              className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition"
            >
              Dashboard
            </Link>
          )}

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <span className="text-gray-700 text-sm font-medium">
                {user?.email}
              </span>
              <button
                onClick={handleLogout}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:scale-105 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <Link
                to="/login"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:scale-105 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-5 py-2 rounded-xl border border-gray-300 hover:bg-gray-100 transition"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}