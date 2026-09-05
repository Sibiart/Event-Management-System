import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getCurrentUser } from "../utils/auth";
import { getCatalog, getDefaultCatalog } from "../utils/catalog";
import { addBooking } from "../utils/bookings";
import { IndianRupee, Calendar, CheckCircle, Star, UtensilsCrossed, Camera, Sparkles } from "lucide-react";

export default function Vendors() {
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null);
  const [bookingDate, setBookingDate] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [filterType, setFilterType] = useState<string>("all");
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [vendorCatalog, setVendorCatalog] = useState(() => getDefaultCatalog().vendors);

  useEffect(() => {
    void getCatalog().then(({ vendors }) => setVendorCatalog(vendors)).catch((error) => console.error('Unable to load vendors:', error.message));
  }, []);

  const handleBooking = (vendorId: string) => {
    if (!user) {
      navigate('/auth');
      return;
    }
    setSelectedVendor(vendorId);
  };

  const confirmBooking = async () => {
    if (!user || !selectedVendor || !bookingDate) return;

    const vendor = vendorCatalog.find(v => v.id === selectedVendor);
    if (!vendor) return;

    const booking = {
      id: crypto.randomUUID(),
      userId: user.id,
      type: 'vendor' as const,
      itemId: vendor.id,
      itemName: vendor.name,
      date: bookingDate,
      cost: vendor.costPerDay,
      details: {
        vendorType: vendor.type,
        services: vendor.services,
        rating: vendor.rating,
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
      setSelectedVendor(null);
      setBookingDate("");
    }, 2000);
  };

  const filteredVendors = filterType === "all" 
    ? vendorCatalog 
    : vendorCatalog.filter(v => v.type === filterType);

  const getVendorIcon = (type: string) => {
    switch (type) {
      case 'catering': return <UtensilsCrossed className="w-6 h-6" />;
      case 'photography': return <Camera className="w-6 h-6" />;
      case 'decoration': return <Sparkles className="w-6 h-6" />;
      default: return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">Professional Vendors</h2>
        <p className="text-gray-600 text-lg">Expert services for your perfect event</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-3 justify-center mb-8">
        <button
          onClick={() => setFilterType("all")}
          className={`px-6 py-2 rounded-full font-semibold transition ${
            filterType === "all"
              ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
              : "bg-white text-gray-700 border border-gray-300 hover:border-purple-600"
          }`}
        >
          All Vendors
        </button>
        <button
          onClick={() => setFilterType("catering")}
          className={`px-6 py-2 rounded-full font-semibold transition ${
            filterType === "catering"
              ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
              : "bg-white text-gray-700 border border-gray-300 hover:border-purple-600"
          }`}
        >
          Catering
        </button>
        <button
          onClick={() => setFilterType("decoration")}
          className={`px-6 py-2 rounded-full font-semibold transition ${
            filterType === "decoration"
              ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
              : "bg-white text-gray-700 border border-gray-300 hover:border-purple-600"
          }`}
        >
          Decoration
        </button>
        <button
          onClick={() => setFilterType("photography")}
          className={`px-6 py-2 rounded-full font-semibold transition ${
            filterType === "photography"
              ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
              : "bg-white text-gray-700 border border-gray-300 hover:border-purple-600"
          }`}
        >
          Photography
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredVendors.map((vendor) => (
          <div key={vendor.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition">
            <div className="relative h-64">
              <img
                src={vendor.image}
                alt={vendor.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                <div className="flex items-center gap-1">
                  <IndianRupee className="w-4 h-4" />
                  {vendor.type === 'catering' 
                    ? `${vendor.costPerDay}/person` 
                    : `${(vendor.costPerDay / 1000).toFixed(0)}k`
                  }
                </div>
              </div>
              <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full flex items-center gap-1">
                {getVendorIcon(vendor.type)}
                <span className="text-sm font-semibold capitalize">{vendor.type}</span>
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{vendor.name}</h3>
              
              <div className="flex items-center gap-1 mb-3">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <span className="font-semibold text-gray-700">{vendor.rating}</span>
                <span className="text-gray-500 text-sm">/5.0</span>
              </div>

              <p className="text-gray-600 mb-4">{vendor.description}</p>

              <div className="mb-4">
                <p className="font-semibold text-gray-700 mb-2">Services:</p>
                <div className="flex flex-wrap gap-2">
                  {vendor.services.slice(0, 3).map((service, idx) => (
                    <span key={idx} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                      {service}
                    </span>
                  ))}
                  {vendor.services.length > 3 && (
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                      +{vendor.services.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => handleBooking(vendor.id)}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition"
              >
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {selectedVendor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              Book {vendors.find(v => v.id === selectedVendor)?.name}
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
              <p className="text-gray-700 font-semibold mb-2">Cost:</p>
              <p className="text-3xl font-bold text-purple-600">
                ₹{vendors.find(v => v.id === selectedVendor)?.costPerDay.toLocaleString()}
                {vendors.find(v => v.id === selectedVendor)?.type === 'catering' && '/person'}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setSelectedVendor(null);
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