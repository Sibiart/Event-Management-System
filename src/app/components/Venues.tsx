import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getCurrentUser } from "../utils/auth";
import { getCatalog, getDefaultCatalog } from "../utils/catalog";
import { addBooking, getVenueBookingsForDate } from "../utils/bookings";
import { MapPin, Users, IndianRupee, Calendar, CheckCircle, XCircle } from "lucide-react";

export default function Venues() {
  const [selectedVenue, setSelectedVenue] = useState<string | null>(null);
  const [bookingDate, setBookingDate] = useState("");
  const [guestCount, setGuestCount] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [venueCatalog, setVenueCatalog] = useState(() => getDefaultCatalog().venues);

  useEffect(() => {
    void getCatalog().then(({ venues }) => setVenueCatalog(venues)).catch((error) => console.error('Unable to load venues:', error.message));
  }, []);

  const handleBooking = (venueId: string) => {
    if (!user) {
      navigate('/auth');
      return;
    }
    setSelectedVenue(venueId);
  };

  const confirmBooking = async () => {
    if (!user || !selectedVenue || !bookingDate || !guestCount) return;

    const venue = venueCatalog.find(v => v.id === selectedVenue);
    if (!venue) return;

    const guests = parseInt(guestCount);
    if (guests > venue.capacity) {
      alert(`Guest count exceeds venue capacity of ${venue.capacity}`);
      return;
    }

    // Check if venue is already booked for this date
    const existingBookings = await getVenueBookingsForDate(selectedVenue, bookingDate);
    if (existingBookings.length > 0) {
      alert("This venue is already booked for the selected date");
      return;
    }

    const booking = {
      id: crypto.randomUUID(),
      userId: user.id,
      type: 'venue' as const,
      itemId: venue.id,
      itemName: venue.name,
      date: bookingDate,
      guests: guests,
      cost: venue.costPerDay,
      details: {
        capacity: venue.capacity,
        location: venue.location,
        amenities: venue.amenities,
      },
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
    };

    try {
      await addBooking(booking);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Unable to create booking.');
      return;
    }
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setSelectedVenue(null);
      setBookingDate("");
      setGuestCount("");
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">Premium Venues</h2>
        <p className="text-gray-600 text-lg">Choose the perfect venue for your special occasion</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {venueCatalog.map((venue) => (
          <div key={venue.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition">
            <div className="relative h-64">
              <img
                src={venue.image}
                alt={venue.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                <div className="flex items-center gap-1">
                  <IndianRupee className="w-4 h-4" />
                  {(venue.costPerDay / 1000).toFixed(0)}k/day
                </div>
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{venue.name}</h3>
              
              <div className="flex items-center gap-2 text-gray-600 mb-3">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{venue.location}</span>
              </div>

              <p className="text-gray-600 mb-4">{venue.description}</p>

              <div className="flex items-center gap-2 mb-4 bg-blue-50 p-3 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-gray-700">Capacity: {venue.capacity} guests</span>
              </div>

              <div className="mb-4">
                <p className="font-semibold text-gray-700 mb-2">Amenities:</p>
                <div className="flex flex-wrap gap-2">
                  {venue.amenities.slice(0, 3).map((amenity, idx) => (
                    <span key={idx} className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                      {amenity}
                    </span>
                  ))}
                  {venue.amenities.length > 3 && (
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                      +{venue.amenities.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => handleBooking(venue.id)}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition"
              >
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {selectedVenue && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              Book {venues.find(v => v.id === selectedVenue)?.name}
            </h3>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Event Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">Number of Guests</label>
              <div className="relative">
                <Users className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  value={guestCount}
                  onChange={(e) => setGuestCount(e.target.value)}
                  max={venues.find(v => v.id === selectedVenue)?.capacity}
                  placeholder="Enter guest count"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Maximum capacity: {venues.find(v => v.id === selectedVenue)?.capacity} guests
              </p>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg mb-6">
              <p className="text-gray-700 font-semibold mb-2">Total Cost:</p>
              <p className="text-3xl font-bold text-purple-600">
                ₹{venues.find(v => v.id === selectedVenue)?.costPerDay.toLocaleString()}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setSelectedVenue(null);
                  setBookingDate("");
                  setGuestCount("");
                }}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmBooking}
                disabled={!bookingDate || !guestCount}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition disabled:opacity-50"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 text-center max-w-sm">
            <CheckCircle className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Booking Submitted!</h3>
            <p className="text-gray-600">Your booking is pending admin approval.</p>
          </div>
        </div>
      )}
    </div>
  );
}