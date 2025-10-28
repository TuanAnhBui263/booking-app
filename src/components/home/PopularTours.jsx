import React from 'react';
import TourCard from './TourCard';

const PopularTours = () => {
  const tours = [
    {
      id: 1,
      title: "Matterhorn Base Trek",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      price: 299,
      duration: "5 days",
      groupSize: "8-12 people",
      location: "Switzerland",
      rating: 5,
      reviews: 128
    },
    {
      id: 2,
      title: "Mont Blanc Circuit",
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
      price: 499,
      duration: "7 days",
      groupSize: "6-10 people",
      location: "France",
      rating: 5,
      reviews: 94
    },
    {
      id: 3,
      title: "Dolomites Adventure",
      image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80",
      price: 399,
      duration: "6 days",
      groupSize: "8-14 people",
      location: "Italy",
      rating: 4,
      reviews: 76
    }
  ];

  return (
    <section id="tours" className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Popular <span className="text-orange-500">Tours</span>
          </h2>
          <p className="text-gray-600 text-lg">Discover our most loved hiking experiences</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tours.map(tour => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="bg-orange-500 text-white px-8 py-4 rounded-full font-semibold hover:bg-orange-600 transition-colors">
            View All Tours
          </button>
        </div>
      </div>
    </section>
  );
};

export default PopularTours;