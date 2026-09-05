import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getCurrentUser } from "../utils/auth";
import { getUserBookings, deleteBooking, Booking } from "../utils/bookings";
import { Building2, Users, Music, Mic2, Calendar, IndianRupee, Trash2, MapPin } from "lucide-react";

export default function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const user = getCurrentUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    // Load bookings directly in useEffect
    void getUserBookings(user.id)
      .then(setBookings)
      .catch((error) => alert(error instanceof Error ? error.message : 'Unable to load bookings.'));
  }, [user?.id, navigate]); // Only depend on user.id, not the whole user object

  const handleDelete = async (bookingId: string) => {
    if (confirm("Are you sure you want to cancel this booking?")) {
      try {
        await deleteBooking(bookingId);
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Unable to cancel booking.');
        return;
      }
      // Reload bookings after delete
      if (user) {
        void getUserBookings(user.id).then(setBookings);
      }
    }
  };

  const getBookingIcon = (type: string) => {
    switch (type) {
      case 'venue': return <Building2 className="w-6 h-6" />;
      case 'vendor': return <Users className="w-6 h-6" />;
      case 'dj': return <Music className="w-6 h-6" />;
      case 'artist': return <Mic2 className="w-6 h-6" />;
      default: return null;
    }
  };

  const getBookingColor = (type: string) => {
    switch (type) {
      case 'venue': return 'from-blue-500 to-blue-600';
      case 'vendor': return 'from-green-500 to-green-600';
      case 'dj': return 'from-purple-500 to-purple-600';
      case 'artist': return 'from-pink-500 to-pink-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const totalCost = bookings.reduce((sum, booking) => sum + booking.cost, 0);

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-gray-800 mb-2">My Bookings</h2>
        <p className="text-gray-600">Manage all your event bookings in one place</p>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
          <Building2 className="w-8 h-8 mb-2" />
          <p className="text-3xl font-bold">{bookings.filter(b => b.type === 'venue').length}</p>
          <p className="text-blue-100">Venues</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
          <Users className="w-8 h-8 mb-2" />
          <p className="text-3xl font-bold">{bookings.filter(b => b.type === 'vendor').length}</p>
          <p className="text-green-100">Vendors</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
          <Music className="w-8 h-8 mb-2" />
          <p className="text-3xl font-bold">{bookings.filter(b => b.type === 'dj').length}</p>
          <p className="text-purple-100">DJs</p>
        </div>
        <div className="bg-gradient-to-br from-pink-500 to-pink-600 text-white p-6 rounded-xl shadow-lg">
          <Mic2 className="w-8 h-8 mb-2" />
          <p className="text-3xl font-bold">{bookings.filter(b => b.type === 'artist').length}</p>
          <p className="text-pink-100">Artists</p>
        </div>
      </div>

      {/* Total Cost */}
      {bookings.length > 0 && (
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-xl shadow-lg mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg mb-1">Total Investment</p>
              <p className="text-4xl font-bold">₹{totalCost.toLocaleString()}</p>
            </div>
            <IndianRupee className="w-16 h-16 opacity-50" />
          </div>
        </div>
      )}

      {/* Bookings List */}
      {bookings.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <Calendar className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-800 mb-2">No Bookings Yet</h3>
          <p className="text-gray-600 mb-6">Start planning your perfect event by booking our services</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => navigate('/venues')}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition"
            >
              Browse Venues
            </button>
            <button
              onClick={() => navigate('/vendors')}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition"
            >
              Browse Vendors
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
              <div className="flex flex-col md:flex-row">
                {/* Left Section - Type Badge */}
                <div className={`bg-gradient-to-br ${getBookingColor(booking.type)} text-white p-6 flex flex-col items-center justify-center md:w-48`}>
                  {getBookingIcon(booking.type)}
                  <p className="font-bold text-lg mt-2 capitalize">{booking.type}</p>
                </div>

                {/* Middle Section - Details */}
                <div className="flex-1 p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">{booking.itemName}</h3>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="text-xs text-gray-500">Event Date</p>
                        <p className="font-semibold">{new Date(booking.date).toLocaleDateString('en-IN', { 
                          day: 'numeric', 
                          month: 'long', 
                          year: 'numeric' 
                        })}</p>
                      </div>
                    </div>

                    {booking.guests && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Users className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-xs text-gray-500">Guests</p>
                          <p className="font-semibold">{booking.guests} people</p>
                        </div>
                      </div>
                    )}

                    {booking.details?.location && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-5 h-5 text-red-600" />
                        <div>
                          <p className="text-xs text-gray-500">Location</p>
                          <p className="font-semibold">{booking.details.location}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-gray-600">
                      <IndianRupee className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="text-xs text-gray-500">Cost</p>
                        <p className="font-semibold">₹{booking.cost.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Additional Details */}
                  {booking.details?.amenities && (
                    <div className="mb-2">
                      <p className="text-sm text-gray-500 mb-1">Amenities:</p>
                      <div className="flex flex-wrap gap-1">
                        {booking.details.amenities.slice(0, 5).map((amenity: string, idx: number) => (
                          <span key={idx} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {booking.details?.genre && (
                    <div className="mb-2">
                      <p className="text-sm text-gray-500 mb-1">Genres:</p>
                      <div className="flex flex-wrap gap-1">
                        {booking.details.genre.map((genre: string, idx: number) => (
                          <span key={idx} className="bg-purple-100 text-purple-600 px-2 py-1 rounded text-xs">
                            {genre}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {booking.details?.services && (
                    <div className="mb-2">
                      <p className="text-sm text-gray-500 mb-1">Services:</p>
                      <div className="flex flex-wrap gap-1">
                        {booking.details.services.slice(0, 4).map((service: string, idx: number) => (
                          <span key={idx} className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs">
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <p className="text-xs text-gray-400 mt-3">
                    Booked on {new Date(booking.createdAt).toLocaleDateString('en-IN')}
                  </p>
                </div>

                {/* Right Section - Actions */}
                <div className="p-6 flex items-center justify-center border-t md:border-t-0 md:border-l border-gray-200">
                  <button
                    onClick={() => handleDelete(booking.id)}
                    className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition"
                  >
                    <Trash2 className="w-5 h-5" />
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}