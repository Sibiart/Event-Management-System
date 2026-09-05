import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Database,
  RefreshCw,
  Download,
  Trash2,
  Lock,
  Check,
  XCircle,
  Shield,
  LogOut,
  Plus,
  Pencil,
  Save,
  X,
  Building2,
  Music4,
  BriefcaseBusiness,
} from 'lucide-react';
import { getBookings, updateBookingStatus } from '../utils/bookings';
import { addNotification } from '../utils/notifications';
import { getCatalog, getDefaultCatalog, setCatalog, type CatalogData, type DJ, type Vendor, type Venue } from '../utils/catalog';
import { login, logout, restoreSession } from '../utils/auth';
import { supabase } from '../utils/supabaseClient';

type AdminTab = 'bookings' | 'users' | 'notifications' | 'catalog';
type CatalogTab = 'venues' | 'djs' | 'vendors';

interface AdminData {
  users: any[];
  bookings: any[];
  notifications: any[];
  currentUser: any;
  catalog: CatalogData;
}

interface VenueFormState {
  id: string;
  name: string;
  capacity: string;
  costPerDay: string;
  description: string;
  amenities: string;
  image: string;
  location: string;
}

interface DJFormState {
  id: string;
  name: string;
  genre: string;
  costPerDay: string;
  description: string;
  experience: string;
  image: string;
  rating: string;
}

interface VendorFormState {
  id: string;
  name: string;
  type: 'catering' | 'decoration' | 'photography';
  costPerDay: string;
  description: string;
  services: string;
  image: string;
  rating: string;
}

const createId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;

const emptyVenueForm = (): VenueFormState => ({
  id: '',
  name: '',
  capacity: '',
  costPerDay: '',
  description: '',
  amenities: '',
  image: '',
  location: '',
});

const emptyDJForm = (): DJFormState => ({
  id: '',
  name: '',
  genre: '',
  costPerDay: '',
  description: '',
  experience: '',
  image: '',
  rating: '',
});

const emptyVendorForm = (): VendorFormState => ({
  id: '',
  name: '',
  type: 'catering',
  costPerDay: '',
  description: '',
  services: '',
  image: '',
  rating: '',
});

const parseList = (value: string) => value.split(',').map((item) => item.trim()).filter(Boolean);

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [data, setData] = useState<AdminData | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>('catalog');
  const [catalogTab, setCatalogTab] = useState<CatalogTab>('venues');
  const [catalog, setCatalogState] = useState<CatalogData>(getDefaultCatalog());
  const [venueForm, setVenueForm] = useState<VenueFormState>(emptyVenueForm());
  const [djForm, setDJForm] = useState<DJFormState>(emptyDJForm());
  const [vendorForm, setVendorForm] = useState<VendorFormState>(emptyVendorForm());
  const [editingVenueId, setEditingVenueId] = useState<string | null>(null);
  const [editingDJId, setEditingDJId] = useState<string | null>(null);
  const [editingVendorId, setEditingVendorId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    void restoreSession().then((user) => {
      if (user?.isAdmin) {
        setIsAuthenticated(true);
        void loadData();
      }
    }).catch((error) => setLoginError(error.message));
  }, []);

  const saveCatalogData = async (nextCatalog: CatalogData) => {
    try {
      await setCatalog(nextCatalog);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Unable to save catalog.');
      return;
    }
    setCatalogState(nextCatalog);
    setData((prev) => (prev ? { ...prev, catalog: nextCatalog } : prev));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await login(username, password);
      if (!user?.isAdmin) {
        await logout();
        setPassword('');
        setLoginError('Admin access is required');
        return;
      }
      setIsAuthenticated(true);
      setLoginError('');
      await loadData();
    } catch (error) {
      console.error('Admin login failed:', error);
      setLoginError('Invalid username or password');
    }
  };

  const handleLogout = async () => {
    await logout();
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
    setData(null);
    navigate('/');
  };

  const loadData = async () => {
    const [{ data: users, error: usersError }, bookings] = await Promise.all([
      supabase.from('users').select('*'),
      getBookings(),
    ]);
    if (usersError) throw usersError;
    const { data: notifications, error: notificationsError } = await supabase.from('notifications').select('*');
    if (notificationsError) throw notificationsError;
    const currentUser = await restoreSession();
    const nextCatalog = await getCatalog();

    setCatalogState(nextCatalog);
    setData({ users: users || [], bookings, notifications: notifications || [], currentUser, catalog: nextCatalog });
  };

  const downloadData = () => {
    if (!data) return;
    const dataStr = JSON.stringify({ ...data, catalog }, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `namma-event-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const clearAllData = async () => {
    if (window.confirm('Are you sure you want to clear ALL data? This action cannot be undone!')) {
      const { error: bookingsError } = await supabase.from('bookings').delete().neq('id', '');
      const { error: notificationsError } = await supabase.from('notifications').delete().neq('id', '');
      if (bookingsError || notificationsError) {
        alert(bookingsError?.message || notificationsError?.message || 'Unable to clear data.');
        return;
      }
      void loadData().catch((error) => alert(error.message));
      alert('All data has been cleared!');
    }
  };

  const handleApproveBooking = async (bookingId: string) => {
    const bookings = await getBookings();
    const booking = bookings.find((b) => b.id === bookingId);

    if (booking) {
      await updateBookingStatus(bookingId, 'confirmed');
      await addNotification({
        userId: booking.userId,
        type: 'success',
        title: 'Booking Confirmed! 🎉',
        message: `Your booking for "${booking.itemName}" on ${new Date(booking.date).toLocaleDateString()} has been confirmed by admin.`,
        bookingId: booking.id,
        read: false,
      });
      await loadData();
    }
  };

  const handleRejectBooking = async (bookingId: string) => {
    const bookings = await getBookings();
    const booking = bookings.find((b) => b.id === bookingId);

    if (booking) {
      await updateBookingStatus(bookingId, 'cancelled');
      await addNotification({
        userId: booking.userId,
        type: 'error',
        title: 'Booking Unavailable',
        message: `Unfortunately, "${booking.itemName}" you have booked for ${new Date(booking.date).toLocaleDateString()} is currently unavailable. We apologize for the inconvenience.`,
        bookingId: booking.id,
        read: false,
      });
      await loadData();
    }
  };

  const resetVenueForm = () => {
    setVenueForm(emptyVenueForm());
    setEditingVenueId(null);
  };

  const resetDJForm = () => {
    setDJForm(emptyDJForm());
    setEditingDJId(null);
  };

  const resetVendorForm = () => {
    setVendorForm(emptyVendorForm());
    setEditingVendorId(null);
  };

  const handleVenueSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const payload: Venue = {
      id: editingVenueId || createId('v'),
      name: venueForm.name.trim(),
      capacity: Number(venueForm.capacity) || 0,
      costPerDay: Number(venueForm.costPerDay) || 0,
      description: venueForm.description.trim(),
      amenities: parseList(venueForm.amenities),
      image: venueForm.image.trim() || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=900&q=80',
      location: venueForm.location.trim(),
    };

    if (!payload.name || !payload.location || payload.capacity <= 0 || payload.costPerDay <= 0) {
      alert('Please fill in the required venue fields.');
      return;
    }

    const nextCatalog = {
      ...catalog,
      venues: editingVenueId
        ? catalog.venues.map((item) => (item.id === editingVenueId ? payload : item))
        : [...catalog.venues, payload],
    };

    saveCatalogData(nextCatalog);
    resetVenueForm();
  };

  const handleDJSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const payload: DJ = {
      id: editingDJId || createId('dj'),
      name: djForm.name.trim(),
      genre: parseList(djForm.genre),
      costPerDay: Number(djForm.costPerDay) || 0,
      description: djForm.description.trim(),
      experience: djForm.experience.trim(),
      image: djForm.image.trim() || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=900&q=80',
      rating: Number(djForm.rating) || 0,
    };

    if (!payload.name || !payload.experience || payload.genre.length === 0 || payload.costPerDay <= 0) {
      alert('Please fill in the required DJ fields.');
      return;
    }

    const nextCatalog = {
      ...catalog,
      djs: editingDJId ? catalog.djs.map((item) => (item.id === editingDJId ? payload : item)) : [...catalog.djs, payload],
    };

    saveCatalogData(nextCatalog);
    resetDJForm();
  };

  const handleVendorSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const payload: Vendor = {
      id: editingVendorId || createId('vd'),
      name: vendorForm.name.trim(),
      type: vendorForm.type,
      costPerDay: Number(vendorForm.costPerDay) || 0,
      description: vendorForm.description.trim(),
      services: parseList(vendorForm.services),
      image: vendorForm.image.trim() || 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=900&q=80',
      rating: Number(vendorForm.rating) || 0,
    };

    if (!payload.name || payload.services.length === 0 || payload.costPerDay <= 0) {
      alert('Please fill in the required vendor fields.');
      return;
    }

    const nextCatalog = {
      ...catalog,
      vendors: editingVendorId ? catalog.vendors.map((item) => (item.id === editingVendorId ? payload : item)) : [...catalog.vendors, payload],
    };

    saveCatalogData(nextCatalog);
    resetVendorForm();
  };

  const handleDeleteVenue = (venueId: string) => {
    if (!window.confirm('Delete this venue?')) return;
    const nextCatalog = { ...catalog, venues: catalog.venues.filter((item) => item.id !== venueId) };
    saveCatalogData(nextCatalog);
  };

  const handleDeleteDJ = (djId: string) => {
    if (!window.confirm('Delete this DJ?')) return;
    const nextCatalog = { ...catalog, djs: catalog.djs.filter((item) => item.id !== djId) };
    saveCatalogData(nextCatalog);
  };

  const handleDeleteVendor = (vendorId: string) => {
    if (!window.confirm('Delete this vendor?')) return;
    const nextCatalog = { ...catalog, vendors: catalog.vendors.filter((item) => item.id !== vendorId) };
    saveCatalogData(nextCatalog);
  };

  const startEditingVenue = (venue: Venue) => {
    setCatalogTab('venues');
    setEditingVenueId(venue.id);
    setVenueForm({
      id: venue.id,
      name: venue.name,
      capacity: String(venue.capacity),
      costPerDay: String(venue.costPerDay),
      description: venue.description,
      amenities: venue.amenities.join(', '),
      image: venue.image,
      location: venue.location,
    });
  };

  const startEditingDJ = (dj: DJ) => {
    setCatalogTab('djs');
    setEditingDJId(dj.id);
    setDJForm({
      id: dj.id,
      name: dj.name,
      genre: dj.genre.join(', '),
      costPerDay: String(dj.costPerDay),
      description: dj.description,
      experience: dj.experience,
      image: dj.image,
      rating: String(dj.rating),
    });
  };

  const startEditingVendor = (vendor: Vendor) => {
    setCatalogTab('vendors');
    setEditingVendorId(vendor.id);
    setVendorForm({
      id: vendor.id,
      name: vendor.name,
      type: vendor.type,
      costPerDay: String(vendor.costPerDay),
      description: vendor.description,
      services: vendor.services.join(', '),
      image: vendor.image,
      rating: String(vendor.rating),
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-4">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Panel</h1>
            <p className="text-gray-600">Namma Event Database Management</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Supabase email</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter your Supabase email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter password"
                  required
                />
              </div>
            </div>

            {loginError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition"
            >
              Login to Admin Panel
            </button>
          </form>

          <div className="mt-6 text-center">
            <button onClick={() => navigate('/')} className="text-sm text-gray-600 hover:text-gray-800">
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg">
                <Database className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Admin Panel</h1>
                <p className="text-gray-600">Namma Event Database Management</p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={loadData}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <button
                onClick={downloadData}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
              <button
                onClick={clearAllData}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg mb-6">
          <div className="border-b border-gray-200">
            <div className="flex flex-wrap">
              <button
                onClick={() => setActiveTab('bookings')}
                className={`px-6 py-4 font-semibold border-b-2 transition ${
                  activeTab === 'bookings' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                Bookings ({data?.bookings.length || 0})
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`px-6 py-4 font-semibold border-b-2 transition ${
                  activeTab === 'users' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                Users ({data?.users.length || 0})
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`px-6 py-4 font-semibold border-b-2 transition ${
                  activeTab === 'notifications' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                Notifications ({data?.notifications.length || 0})
              </button>
              <button
                onClick={() => setActiveTab('catalog')}
                className={`px-6 py-4 font-semibold border-b-2 transition ${
                  activeTab === 'catalog' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                Catalog ({catalog.venues.length + catalog.djs.length + catalog.vendors.length})
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'bookings' && (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-3 text-left">ID</th>
                      <th className="border p-3 text-left">User ID</th>
                      <th className="border p-3 text-left">Type</th>
                      <th className="border p-3 text-left">Item</th>
                      <th className="border p-3 text-left">Date</th>
                      <th className="border p-3 text-left">Guests</th>
                      <th className="border p-3 text-left">Cost</th>
                      <th className="border p-3 text-left">Status</th>
                      <th className="border p-3 text-left">Created</th>
                      <th className="border p-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.bookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-gray-50">
                        <td className="border p-3 text-sm font-mono">{booking.id}</td>
                        <td className="border p-3 text-sm font-mono">{booking.userId}</td>
                        <td className="border p-3">
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">{booking.type}</span>
                        </td>
                        <td className="border p-3">{booking.itemName}</td>
                        <td className="border p-3">{new Date(booking.date).toLocaleDateString()}</td>
                        <td className="border p-3">{booking.guests || '-'}</td>
                        <td className="border p-3 font-semibold">₹{booking.cost.toLocaleString()}</td>
                        <td className="border p-3">
                          <span
                            className={`px-2 py-1 rounded text-sm ${
                              booking.status === 'confirmed'
                                ? 'bg-green-100 text-green-700'
                                : booking.status === 'cancelled'
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-yellow-100 text-yellow-700'
                            }`}
                          >
                            {booking.status}
                          </span>
                        </td>
                        <td className="border p-3 text-sm">{new Date(booking.createdAt).toLocaleString()}</td>
                        <td className="border p-3 text-sm">
                          {booking.status === 'pending' && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleApproveBooking(booking.id)}
                                className="p-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                                title="Approve"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleRejectBooking(booking.id)}
                                className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                                title="Reject"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                          {booking.status !== 'pending' && <span className="text-gray-400 text-xs">No actions</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {data?.bookings.length === 0 && <div className="text-center py-8 text-gray-500">No bookings found</div>}
              </div>
            )}

            {activeTab === 'users' && (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-3 text-left">ID</th>
                      <th className="border p-3 text-left">Name</th>
                      <th className="border p-3 text-left">Email</th>
                      <th className="border p-3 text-left">Phone</th>
                      <th className="border p-3 text-left">Created At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="border p-3 text-sm font-mono">{user.id}</td>
                        <td className="border p-3">{user.name}</td>
                        <td className="border p-3">{user.email}</td>
                        <td className="border p-3">{user.phone}</td>
                        <td className="border p-3 text-sm">{new Date(user.createdAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {data?.users.length === 0 && <div className="text-center py-8 text-gray-500">No users found</div>}
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-3 text-left">ID</th>
                      <th className="border p-3 text-left">User ID</th>
                      <th className="border p-3 text-left">Type</th>
                      <th className="border p-3 text-left">Title</th>
                      <th className="border p-3 text-left">Message</th>
                      <th className="border p-3 text-left">Read</th>
                      <th className="border p-3 text-left">Created At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.notifications.map((notification) => (
                      <tr key={notification.id} className="hover:bg-gray-50">
                        <td className="border p-3 text-sm font-mono">{notification.id}</td>
                        <td className="border p-3 text-sm font-mono">{notification.userId}</td>
                        <td className="border p-3">
                          <span
                            className={`px-2 py-1 rounded text-sm ${
                              notification.type === 'success'
                                ? 'bg-green-100 text-green-700'
                                : notification.type === 'error'
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {notification.type}
                          </span>
                        </td>
                        <td className="border p-3 font-semibold">{notification.title}</td>
                        <td className="border p-3 text-sm">{notification.message}</td>
                        <td className="border p-3">{notification.read ? <span className="text-green-600">✓ Read</span> : <span className="text-orange-600">● Unread</span>}</td>
                        <td className="border p-3 text-sm">{new Date(notification.createdAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {data?.notifications.length === 0 && <div className="text-center py-8 text-gray-500">No notifications found</div>}
              </div>
            )}

            {activeTab === 'catalog' && (
              <div className="space-y-6">
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setCatalogTab('venues')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg ${catalogTab === 'venues' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    <Building2 className="w-4 h-4" />
                    Venues
                  </button>
                  <button
                    onClick={() => setCatalogTab('djs')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg ${catalogTab === 'djs' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    <Music4 className="w-4 h-4" />
                    DJs
                  </button>
                  <button
                    onClick={() => setCatalogTab('vendors')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg ${catalogTab === 'vendors' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    <BriefcaseBusiness className="w-4 h-4" />
                    Vendors
                  </button>
                </div>

                {catalogTab === 'venues' && (
                  <div className="grid lg:grid-cols-[420px_1fr] gap-6">
                    <form onSubmit={handleVenueSubmit} className="bg-gray-50 rounded-xl border border-gray-200 p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-gray-800">{editingVenueId ? 'Edit venue' : 'Add venue'}</h3>
                        {editingVenueId && (
                          <button type="button" onClick={resetVenueForm} className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800">
                            <X className="w-4 h-4" />
                            Cancel
                          </button>
                        )}
                      </div>

                      <input value={venueForm.name} onChange={(e) => setVenueForm({ ...venueForm, name: e.target.value })} placeholder="Venue name" className="w-full border border-gray-300 rounded-lg px-3 py-2" required />
                      <div className="grid grid-cols-2 gap-3">
                        <input value={venueForm.capacity} type="number" onChange={(e) => setVenueForm({ ...venueForm, capacity: e.target.value })} placeholder="Capacity" className="w-full border border-gray-300 rounded-lg px-3 py-2" required />
                        <input value={venueForm.costPerDay} type="number" onChange={(e) => setVenueForm({ ...venueForm, costPerDay: e.target.value })} placeholder="Cost/day" className="w-full border border-gray-300 rounded-lg px-3 py-2" required />
                      </div>
                      <input value={venueForm.location} onChange={(e) => setVenueForm({ ...venueForm, location: e.target.value })} placeholder="Location" className="w-full border border-gray-300 rounded-lg px-3 py-2" required />
                      <textarea value={venueForm.description} onChange={(e) => setVenueForm({ ...venueForm, description: e.target.value })} placeholder="Description" rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2" required />
                      <input value={venueForm.amenities} onChange={(e) => setVenueForm({ ...venueForm, amenities: e.target.value })} placeholder="Amenities (comma separated)" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                      <input value={venueForm.image} onChange={(e) => setVenueForm({ ...venueForm, image: e.target.value })} placeholder="Image URL" className="w-full border border-gray-300 rounded-lg px-3 py-2" />

                      <button type="submit" className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
                        {editingVenueId ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        {editingVenueId ? 'Save venue' : 'Add venue'}
                      </button>
                    </form>

                    <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border p-3 text-left">Name</th>
                            <th className="border p-3 text-left">Location</th>
                            <th className="border p-3 text-left">Capacity</th>
                            <th className="border p-3 text-left">Cost</th>
                            <th className="border p-3 text-left">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {catalog.venues.map((venue) => (
                            <tr key={venue.id} className="hover:bg-gray-50">
                              <td className="border p-3 font-semibold">{venue.name}</td>
                              <td className="border p-3">{venue.location}</td>
                              <td className="border p-3">{venue.capacity}</td>
                              <td className="border p-3">₹{venue.costPerDay.toLocaleString()}</td>
                              <td className="border p-3">
                                <div className="flex gap-2">
                                  <button onClick={() => startEditingVenue(venue)} className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600" title="Edit">
                                    <Pencil className="w-4 h-4" />
                                  </button>
                                  <button onClick={() => handleDeleteVenue(venue.id)} className="p-2 bg-red-500 text-white rounded hover:bg-red-600" title="Delete">
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {catalogTab === 'djs' && (
                  <div className="grid lg:grid-cols-[420px_1fr] gap-6">
                    <form onSubmit={handleDJSubmit} className="bg-gray-50 rounded-xl border border-gray-200 p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-gray-800">{editingDJId ? 'Edit DJ' : 'Add DJ'}</h3>
                        {editingDJId && (
                          <button type="button" onClick={resetDJForm} className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800">
                            <X className="w-4 h-4" />
                            Cancel
                          </button>
                        )}
                      </div>

                      <input value={djForm.name} onChange={(e) => setDJForm({ ...djForm, name: e.target.value })} placeholder="DJ name" className="w-full border border-gray-300 rounded-lg px-3 py-2" required />
                      <div className="grid grid-cols-2 gap-3">
                        <input value={djForm.costPerDay} type="number" onChange={(e) => setDJForm({ ...djForm, costPerDay: e.target.value })} placeholder="Cost/day" className="w-full border border-gray-300 rounded-lg px-3 py-2" required />
                        <input value={djForm.rating} type="number" step="0.1" min="0" max="5" onChange={(e) => setDJForm({ ...djForm, rating: e.target.value })} placeholder="Rating" className="w-full border border-gray-300 rounded-lg px-3 py-2" required />
                      </div>
                      <input value={djForm.experience} onChange={(e) => setDJForm({ ...djForm, experience: e.target.value })} placeholder="Experience" className="w-full border border-gray-300 rounded-lg px-3 py-2" required />
                      <input value={djForm.genre} onChange={(e) => setDJForm({ ...djForm, genre: e.target.value })} placeholder="Genres (comma separated)" className="w-full border border-gray-300 rounded-lg px-3 py-2" required />
                      <textarea value={djForm.description} onChange={(e) => setDJForm({ ...djForm, description: e.target.value })} placeholder="Description" rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2" required />
                      <input value={djForm.image} onChange={(e) => setDJForm({ ...djForm, image: e.target.value })} placeholder="Image URL" className="w-full border border-gray-300 rounded-lg px-3 py-2" />

                      <button type="submit" className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
                        {editingDJId ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        {editingDJId ? 'Save DJ' : 'Add DJ'}
                      </button>
                    </form>

                    <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border p-3 text-left">Name</th>
                            <th className="border p-3 text-left">Genre</th>
                            <th className="border p-3 text-left">Experience</th>
                            <th className="border p-3 text-left">Cost</th>
                            <th className="border p-3 text-left">Rating</th>
                            <th className="border p-3 text-left">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {catalog.djs.map((dj) => (
                            <tr key={dj.id} className="hover:bg-gray-50">
                              <td className="border p-3 font-semibold">{dj.name}</td>
                              <td className="border p-3">{dj.genre.join(', ')}</td>
                              <td className="border p-3">{dj.experience}</td>
                              <td className="border p-3">₹{dj.costPerDay.toLocaleString()}</td>
                              <td className="border p-3">{dj.rating}</td>
                              <td className="border p-3">
                                <div className="flex gap-2">
                                  <button onClick={() => startEditingDJ(dj)} className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600" title="Edit">
                                    <Pencil className="w-4 h-4" />
                                  </button>
                                  <button onClick={() => handleDeleteDJ(dj.id)} className="p-2 bg-red-500 text-white rounded hover:bg-red-600" title="Delete">
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {catalogTab === 'vendors' && (
                  <div className="grid lg:grid-cols-[420px_1fr] gap-6">
                    <form onSubmit={handleVendorSubmit} className="bg-gray-50 rounded-xl border border-gray-200 p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-gray-800">{editingVendorId ? 'Edit vendor' : 'Add vendor'}</h3>
                        {editingVendorId && (
                          <button type="button" onClick={resetVendorForm} className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800">
                            <X className="w-4 h-4" />
                            Cancel
                          </button>
                        )}
                      </div>

                      <input value={vendorForm.name} onChange={(e) => setVendorForm({ ...vendorForm, name: e.target.value })} placeholder="Vendor name" className="w-full border border-gray-300 rounded-lg px-3 py-2" required />
                      <div className="grid grid-cols-2 gap-3">
                        <select value={vendorForm.type} onChange={(e) => setVendorForm({ ...vendorForm, type: e.target.value as 'catering' | 'decoration' | 'photography' })} className="w-full border border-gray-300 rounded-lg px-3 py-2">
                          <option value="catering">Catering</option>
                          <option value="decoration">Decoration</option>
                          <option value="photography">Photography</option>
                        </select>
                        <input value={vendorForm.costPerDay} type="number" onChange={(e) => setVendorForm({ ...vendorForm, costPerDay: e.target.value })} placeholder="Cost/day" className="w-full border border-gray-300 rounded-lg px-3 py-2" required />
                      </div>
                      <input value={vendorForm.services} onChange={(e) => setVendorForm({ ...vendorForm, services: e.target.value })} placeholder="Services (comma separated)" className="w-full border border-gray-300 rounded-lg px-3 py-2" required />
                      <textarea value={vendorForm.description} onChange={(e) => setVendorForm({ ...vendorForm, description: e.target.value })} placeholder="Description" rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2" required />
                      <div className="grid grid-cols-2 gap-3">
                        <input value={vendorForm.rating} type="number" step="0.1" min="0" max="5" onChange={(e) => setVendorForm({ ...vendorForm, rating: e.target.value })} placeholder="Rating" className="w-full border border-gray-300 rounded-lg px-3 py-2" required />
                        <input value={vendorForm.image} onChange={(e) => setVendorForm({ ...vendorForm, image: e.target.value })} placeholder="Image URL" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                      </div>

                      <button type="submit" className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
                        {editingVendorId ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        {editingVendorId ? 'Save vendor' : 'Add vendor'}
                      </button>
                    </form>

                    <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border p-3 text-left">Name</th>
                            <th className="border p-3 text-left">Type</th>
                            <th className="border p-3 text-left">Services</th>
                            <th className="border p-3 text-left">Cost</th>
                            <th className="border p-3 text-left">Rating</th>
                            <th className="border p-3 text-left">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {catalog.vendors.map((vendor) => (
                            <tr key={vendor.id} className="hover:bg-gray-50">
                              <td className="border p-3 font-semibold">{vendor.name}</td>
                              <td className="border p-3 capitalize">{vendor.type}</td>
                              <td className="border p-3">{vendor.services.join(', ')}</td>
                              <td className="border p-3">₹{vendor.costPerDay.toLocaleString()}</td>
                              <td className="border p-3">{vendor.rating}</td>
                              <td className="border p-3">
                                <div className="flex gap-2">
                                  <button onClick={() => startEditingVendor(vendor)} className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600" title="Edit">
                                    <Pencil className="w-4 h-4" />
                                  </button>
                                  <button onClick={() => handleDeleteVendor(vendor.id)} className="p-2 bg-red-500 text-white rounded hover:bg-red-600" title="Delete">
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
