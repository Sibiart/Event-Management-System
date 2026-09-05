import { useState } from "react";
import { useNavigate } from "react-router";
import { artists } from "../data/artists";
import { getCurrentUser } from "../utils/auth";
import { addBooking } from "../utils/bookings";
import { IndianRupee, Calendar, CheckCircle, Star, Mic2 } from "lucide-react";

export default function Artists() {
  const [selectedArtist, setSelectedArtist] = useState<string | null>(null);
  const [bookingDate, setBookingDate] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleBooking = (artistId: string) => {
    if (!user) {
      navigate('/auth');
      return;
    }
    setSelectedArtist(artistId);
  };

  const confirmBooking = async () => {
    if (!user || !selectedArtist || !bookingDate) return;

    const artist = artists.find(a => a.id === selectedArtist);
    if (!artist) return;

    const booking = {
      id: crypto.randomUUID(),
      userId: user.id,
      type: 'artist' as const,
      itemId: artist.id,
      itemName: artist.name,
      date: bookingDate,
      cost: artist.costPerDay,
      details: {
        instrument: artist.instrument,
        experience: artist.experience,
        rating: artist.rating,
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
      setSelectedArtist(null);
      setBookingDate("");
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">Live Artists & Musicians</h2>
        <p className="text-gray-600 text-lg">Add a touch of elegance with live performances</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {artists.map((artist) => (
          <div key={artist.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition">
            <div className="relative h-72">
              <img
                src={artist.image}
                alt={artist.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              
              <div className="absolute top-4 right-4 bg-pink-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                <div className="flex items-center gap-1">
                  <IndianRupee className="w-3 h-3" />
                  {(artist.costPerDay / 1000).toFixed(0)}k
                </div>
              </div>

              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-xl font-bold text-white mb-1">{artist.name}</h3>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-white text-sm font-semibold">{artist.rating}</span>
                </div>
              </div>
            </div>

            <div className="p-4">
              <p className="text-gray-600 text-sm mb-3">{artist.description}</p>

              <div className="mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <Mic2 className="w-4 h-4 text-pink-600" />
                  <p className="font-semibold text-gray-700 text-sm">Specialization:</p>
                </div>
                <div className="flex flex-wrap gap-1">
                  {artist.instrument.map((inst, idx) => (
                    <span key={idx} className="bg-pink-100 text-pink-700 px-2 py-1 rounded text-xs">
                      {inst}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-xs text-gray-500 mb-3">
                Experience: {artist.experience}
              </div>

              <button
                onClick={() => handleBooking(artist.id)}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition text-sm"
              >
                Book Artist
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {selectedArtist && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              Book {artists.find(a => a.id === selectedArtist)?.name}
            </h3>

            <div className="mb-6">
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

            <div className="bg-pink-50 p-4 rounded-lg mb-6">
              <p className="text-gray-700 font-semibold mb-2">Performance Fee:</p>
              <p className="text-3xl font-bold text-pink-600">
                ₹{artists.find(a => a.id === selectedArtist)?.costPerDay.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 mt-1">For full event performance</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setSelectedArtist(null);
                  setBookingDate("");
                }}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmBooking}
                disabled={!bookingDate}
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