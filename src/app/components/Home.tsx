import { Link } from "react-router";
import { Building2, Users, Music, Mic2, Calendar, Star, CheckCircle } from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: <Building2 className="w-12 h-12" />,
      title: "Premium Venues",
      description: "Choose from 5+ luxurious venues with varying capacities",
      link: "/venues",
      color: "bg-blue-500",
    },
    {
      icon: <Users className="w-12 h-12" />,
      title: "Top Vendors",
      description: "Catering, decoration, and photography services",
      link: "/vendors",
      color: "bg-green-500",
    },
    {
      icon: <Music className="w-12 h-12" />,
      title: "Professional DJs",
      description: "Expert DJs for all genres and occasions",
      link: "/djs",
      color: "bg-purple-500",
    },
    {
      icon: <Mic2 className="w-12 h-12" />,
      title: "Live Artists",
      description: "Talented musicians and performers",
      link: "/artists",
      color: "bg-pink-500",
    },
  ];

  const benefits = [
    "Real-time venue availability checking",
    "Transparent pricing with no hidden costs",
    "Capacity management for venues",
    "Secure booking system",
    "Professional service providers",
    "24/7 customer support",
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-purple-600 to-pink-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h2 className="text-5xl font-bold mb-4">Welcome to Namma Event</h2>
            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              Your one-stop solution for booking venues, vendors, DJs, and artists for all your special occasions
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/venues"
                className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-purple-50 transition shadow-lg"
              >
                Browse Venues
              </Link>
              <Link
                to="/auth"
                className="bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-800 transition border-2 border-white"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full">
            <path
              fill="#faf5ff"
              d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
            ></path>
          </svg>
        </div>
      </section>

      {/* Services Grid */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-800 mb-2">Our Services</h3>
          <p className="text-gray-600">Everything you need for a perfect event</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Link
              key={index}
              to={feature.link}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition p-6 text-center group"
            >
              <div className={`${feature.color} text-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition`}>
                {feature.icon}
              </div>
              <h4 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h4>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-800 mb-2">Why Choose Namma Event?</h3>
            <p className="text-gray-600">We make event planning simple and stress-free</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3 bg-purple-50 p-4 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                <p className="text-gray-700">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-6 text-center">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-8 rounded-xl shadow-lg">
            <Calendar className="w-12 h-12 mx-auto mb-3" />
            <p className="text-4xl font-bold mb-2">5+</p>
            <p className="text-blue-100">Premium Venues</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-8 rounded-xl shadow-lg">
            <Users className="w-12 h-12 mx-auto mb-3" />
            <p className="text-4xl font-bold mb-2">6+</p>
            <p className="text-green-100">Trusted Vendors</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-8 rounded-xl shadow-lg">
            <Music className="w-12 h-12 mx-auto mb-3" />
            <p className="text-4xl font-bold mb-2">4+</p>
            <p className="text-purple-100">Professional DJs</p>
          </div>
          <div className="bg-gradient-to-br from-pink-500 to-pink-600 text-white p-8 rounded-xl shadow-lg">
            <Star className="w-12 h-12 mx-auto mb-3" />
            <p className="text-4xl font-bold mb-2">4.8</p>
            <p className="text-pink-100">Average Rating</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-4">Ready to Plan Your Event?</h3>
          <p className="text-xl text-purple-100 mb-8">
            Join Namma Event today and get access to premium venues and services
          </p>
          <Link
            to="/auth"
            className="inline-block bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-purple-50 transition shadow-lg"
          >
            Sign Up Now - It's Free!
          </Link>
        </div>
      </section>
    </div>
  );
}
