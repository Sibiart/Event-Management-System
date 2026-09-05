import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getCurrentUser } from "../utils/auth";
import { getCatalog, getDefaultCatalog } from "../utils/catalog";
import { addBooking } from "../utils/bookings";
import { IndianRupee, Calendar, CheckCircle, Star, Music } from "lucide-react";

export default function DJs() {
  const [selectedDJ, setSelectedDJ] = useState<string | null>(null);
  const [bookingDate, setBookingDate] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [djCatalog, setDJCatalog] = useState(() => getDefaultCatalog().djs);

  useEffect(() => {
    void getCatalog().then(({ djs }) => setDJCatalog(djs)).catch((error) => console.error('Unable to load DJs:', error.message));
  }, []);

  const handleBooking = (djId: string) => {
    if (!user) {
      navigate('/auth');
      return;
    }
    setSelectedDJ(djId);
  };

  const confirmBooking = async () => {
    if (!user || !selectedDJ || !bookingDate) return;

    const dj = djCatalog.find(d => d.id === selectedDJ);
    if (!dj) return;

    const booking = {
      id: crypto.randomUUID(),
      userId: user.id,
      type: 'dj' as const,
      itemId: dj.id,
      itemName: dj.name,
      date: bookingDate,
      cost: dj.costPerDay,
      details: {
        genre: dj.genre,
        experience: dj.experience,
        rating: dj.rating,
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
      setSelectedDJ(null);
      setBookingDate("");
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">Professional DJs</h2>
        <p className="text-gray-600 text-lg">Get the party started with our expert DJs</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {djCatalog.map((dj) => (
          <div key={dj.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition">
            <div className="relative h-80">
              <img
                src={dj.image}
                alt={dj.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              
              <div className="absolute top-4 right-4 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                <div className="flex items-center gap-1">
                  <IndianRupee className="w-4 h-4" />
                  {(dj.costPerDay / 1000).toFixed(0)}k
                </div>
              </div>

              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-2xl font-bold text-white mb-2">{dj.name}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-white font-semibold">{dj.rating}</span>
                  <span className="text-gray-300 text-sm">• {dj.experience} exp</span>
                </div>
              </div>
            </div>

            <div className="p-6">
              <p className="text-gray-600 mb-4">{dj.description}</p>

              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Music className="w-4 h-4 text-purple-600" />
                  <p className="font-semibold text-gray-700">Genres:</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {dj.genre.map((genre, idx) => (
                    <span key={idx} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                      {genre}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleBooking(dj.id)}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition"
              >
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {selectedDJ && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              Book {djs.find(d => d.id === selectedDJ)?.name}
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

            <div className="bg-purple-50 p-4 rounded-lg mb-6">
              <p className="text-gray-700 font-semibold mb-2">Total Cost:</p>
              <p className="text-3xl font-bold text-purple-600">
                ₹{djs.find(d => d.id === selectedDJ)?.costPerDay.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 mt-1">For full day performance</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setSelectedDJ(null);
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