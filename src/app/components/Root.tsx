import { Outlet, Link, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { getCurrentUser, logout, restoreSession, subscribeToAuthChanges, User } from "../utils/auth";
import { Calendar, Users, Music, Mic2, Building2, BookOpen, LogOut, LogIn, Menu, X } from "lucide-react";
import { Notifications } from "./Notifications";

export default function Root() {
  const [user, setUser] = useState<User | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    void restoreSession()
      .then(setUser)
      .catch((error) => console.error('Unable to load the current user:', error.message));
    const { data: authSubscription } = subscribeToAuthChanges(setUser);
    return () => authSubscription.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Unable to sign out:', error);
    }
    setUser(null);
    navigate('/');
    setMobileMenuOpen(false);
  };

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2" onClick={handleNavClick}>
              <Calendar className="w-8 h-8" />
              <div>
                <h1 className="text-2xl font-bold">Namma Event</h1>
                <p className="text-sm text-purple-100">Your Perfect Event Partner</p>
              </div>
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/venues" className="flex items-center gap-1 hover:text-purple-200 transition">
                <Building2 className="w-4 h-4" />
                Venues
              </Link>
              <Link to="/vendors" className="flex items-center gap-1 hover:text-purple-200 transition">
                <Users className="w-4 h-4" />
                Vendors
              </Link>
              <Link to="/djs" className="flex items-center gap-1 hover:text-purple-200 transition">
                <Music className="w-4 h-4" />
                DJs
              </Link>
              <Link to="/artists" className="flex items-center gap-1 hover:text-purple-200 transition">
                <Mic2 className="w-4 h-4" />
                Artists
              </Link>
              {user && (
                <Link to="/my-bookings" className="flex items-center gap-1 hover:text-purple-200 transition">
                  <BookOpen className="w-4 h-4" />
                  My Bookings
                </Link>
              )}
              {user && <Notifications />}
              {user ? (
                <div className="flex items-center gap-4 border-l border-purple-400 pl-6">
                  <span className="text-sm">Hi, {user.name}</span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1 bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 transition"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/auth"
                  className="flex items-center gap-1 bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 transition"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In / Sign Up
                </Link>
              )}
            </nav>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden mt-4 pt-4 border-t border-purple-400 space-y-3">
              <Link
                to="/venues"
                onClick={handleNavClick}
                className="flex items-center gap-2 py-2 hover:text-purple-200 transition"
              >
                <Building2 className="w-4 h-4" />
                Venues
              </Link>
              <Link
                to="/vendors"
                onClick={handleNavClick}
                className="flex items-center gap-2 py-2 hover:text-purple-200 transition"
              >
                <Users className="w-4 h-4" />
                Vendors
              </Link>
              <Link
                to="/djs"
                onClick={handleNavClick}
                className="flex items-center gap-2 py-2 hover:text-purple-200 transition"
              >
                <Music className="w-4 h-4" />
                DJs
              </Link>
              <Link
                to="/artists"
                onClick={handleNavClick}
                className="flex items-center gap-2 py-2 hover:text-purple-200 transition"
              >
                <Mic2 className="w-4 h-4" />
                Artists
              </Link>
              {user && (
                <Link
                  to="/my-bookings"
                  onClick={handleNavClick}
                  className="flex items-center gap-2 py-2 hover:text-purple-200 transition"
                >
                  <BookOpen className="w-4 h-4" />
                  My Bookings
                </Link>
              )}
              <div className="pt-3 border-t border-purple-400">
                {user ? (
                  <>
                    <p className="text-sm mb-3">Hi, {user.name}</p>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 transition w-full"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    to="/auth"
                    onClick={handleNavClick}
                    className="flex items-center gap-2 bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 transition"
                  >
                    <LogIn className="w-4 h-4" />
                    Sign In / Sign Up
                  </Link>
                )}
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-lg font-semibold mb-2">Namma Event</p>
          <p className="text-gray-400 text-sm mb-4">Making Your Events Memorable Since 2026</p>
          <p className="text-gray-500 text-xs">&copy; 2026 Namma Event. All rights reserved.</p>
          <div className="mt-4">
            <Link to="/admin" className="text-gray-500 hover:text-gray-300 text-xs transition">
              Admin Access
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}