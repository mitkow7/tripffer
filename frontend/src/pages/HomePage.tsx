import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MapPin,
  Calendar,
  Users,
  ArrowRight,
  ShieldCheck,
  Award,
  ThumbsUp,
} from "lucide-react";
import Button from "../components/ui/Button";
import { useFeaturedHotels } from "../hooks/useApi";
import { Hotel } from "../types/api";
import LoadingSpinner from "../components/ui/LoadingSpinner";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { data: featuredHotels, isLoading: featuredHotelsLoading } =
    useFeaturedHotels();
  const [destination, setDestination] = useState("");

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (destination) {
      navigate(`/search?destination=${destination}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <section
        className="relative min-h-screen flex items-center justify-center text-white"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
            Find Your Next Adventure
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto">
            Discover and book unique travel experiences and beautiful places to
            stay.
          </p>

          <form
            onSubmit={handleSearch}
            className="bg-white p-4 rounded-lg shadow-2xl max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-4 items-center"
          >
            <div className="flex items-center bg-white border border-gray-200 p-3 rounded-lg">
              <MapPin className="text-gray-500 mr-3" />
              <input
                type="text"
                name="destination"
                placeholder="Where are you going?"
                className="bg-transparent focus:outline-none w-full text-gray-900"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>
            <div className="flex items-center bg-white border border-gray-200 p-3 rounded-lg">
              <Calendar className="text-gray-500 mr-3" />
              <input
                type="text"
                placeholder="Check in"
                className="bg-transparent focus:outline-none w-full text-gray-900"
                onFocus={(e) => (e.target.type = "date")}
                onBlur={(e) => (e.target.type = "text")}
              />
            </div>
            <div className="flex items-center bg-white border border-gray-200 p-3 rounded-lg">
              <Users className="text-gray-500 mr-3" />
              <input
                type="number"
                placeholder="Guests"
                className="bg-transparent focus:outline-none w-full text-gray-900"
              />
            </div>
            <Button type="submit" size="lg" className="w-full md:w-auto">
              Search
            </Button>
          </form>
        </div>
      </section>

      {/* Featured Trips Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Featured Trips</h2>
            <p className="text-xl text-gray-600">
              Handpicked adventures for every traveler
            </p>
          </div>
          {featuredHotelsLoading ? (
            <div className="flex justify-center">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredHotels?.slice(0, 3).map((hotel: Hotel) => (
                <div
                  key={hotel.id}
                  className="bg-gray-100 rounded-lg shadow-md overflow-hidden transform hover:-translate-y-2 transition-transform duration-300"
                >
                  <img
                    src={
                      hotel.photo_url ||
                      "https://source.unsplash.com/random/800x600/?hotel"
                    }
                    alt={hotel.name}
                    className="w-full h-56 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{hotel.name}</h3>
                    <p className="text-gray-600 mb-4">{hotel.address}</p>
                    <Link
                      to={`/hotel/${hotel.id}`}
                      className="text-blue-600 font-semibold inline-flex items-center"
                    >
                      Learn More <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Why Choose Tripffer?
            </h2>
            <p className="text-xl text-gray-600">
              Your trusted partner for unforgettable travel experiences
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center h-16 w-16 bg-blue-100 text-blue-600 rounded-full mx-auto mb-4">
                <Award size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Best Selection</h3>
              <p className="text-gray-600">
                Handpicked destinations and top-rated accommodations.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center h-16 w-16 bg-green-100 text-green-600 rounded-full mx-auto mb-4">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure & Simple</h3>
              <p className="text-gray-600">
                Effortless booking with secure payment protection.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center h-16 w-16 bg-yellow-100 text-yellow-600 rounded-full mx-auto mb-4">
                <ThumbsUp size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Trusted by Travelers
              </h3>
              <p className="text-gray-600">
                Thousands of positive reviews from our happy customers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              What Our Travelers Say
            </h2>
            <p className="text-xl text-gray-600">
              Real stories from our amazing community
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Example Testimonial Card */}
            <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
              <p className="text-gray-700 mb-6">
                "Tripffer made planning our dream vacation a breeze. The
                selection was incredible, and the booking process was so simple.
                We'll definitely be back!"
              </p>
              <div className="flex items-center">
                <img
                  src="https://randomuser.me/api/portraits/women/68.jpg"
                  alt="Jane Doe"
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <p className="font-bold">Jane Doe</p>
                  <p className="text-sm text-gray-500">New York, USA</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
              <p className="text-gray-700 mb-6">
                "I was blown away by the amazing deals I found on Tripffer. I
                was able to book a luxury hotel for a fraction of the price.
                Highly recommended!"
              </p>
              <div className="flex items-center">
                <img
                  src="https://randomuser.me/api/portraits/men/46.jpg"
                  alt="John Smith"
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <p className="font-bold">John Smith</p>
                  <p className="text-sm text-gray-500">London, UK</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
              <p className="text-gray-700 mb-6">
                "The customer support team was incredibly helpful when I had a
                question about my booking. They went above and beyond to ensure
                I had a great experience."
              </p>
              <div className="flex items-center">
                <img
                  src="https://randomuser.me/api/portraits/women/44.jpg"
                  alt="Emily Johnson"
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <p className="font-bold">Emily Johnson</p>
                  <p className="text-sm text-gray-500">Sydney, Australia</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Your Next Adventure Awaits
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Don't just dream about it. Book your next trip with Tripffer and
            create memories that will last a lifetime.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/search">
              <Button size="lg" variant="default">
                Start Exploring
              </Button>
            </Link>
            <Link to="/register">
              <Button
                size="lg"
                variant="outline"
                className="bg-white border-white text-blue-600 hover:bg-blue-50"
              >
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
