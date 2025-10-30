import React from 'react';
import { useNavigate } from 'react-router-dom';
import TourCard from './TourCard';

const PopularTours = () => {
  const navigate = useNavigate();

  const tours = [
    {
      id: 1,
      title: "Hành trình chinh phục Matterhorn",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      price: 299,
      duration: "5 ngày",
      groupSize: "8-12 người",
      location: "Thụy Sĩ",
      rating: 5,
      reviews: 128
    },
    {
      id: 2,
      title: "Khám phá Mont Blanc",
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
      price: 499,
      duration: "7 ngày",
      groupSize: "6-10 người",
      location: "Pháp",
      rating: 5,
      reviews: 94
    },
    {
      id: 3,
      title: "Phiêu lưu Dolomites",
      image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80",
      price: 399,
      duration: "6 ngày",
      groupSize: "8-14 người",
      location: "Ý",
      rating: 4,
      reviews: 76
    }
  ];

  return (
    <section id="tours" className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-orange-500">Tour</span> Nổi Bật
          </h2>
          <p className="text-gray-600 text-lg">
            Khám phá những hành trình leo núi được yêu thích nhất
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tours.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>

        <div className="text-center mt-12">
          <button
            onClick={() => navigate('/tours')}
            className="bg-orange-500 text-white px-8 py-4 rounded-full font-semibold hover:bg-orange-600 transition-colors"
          >
            XEM TẤT CẢ TOUR
          </button>
        </div>
      </div>
    </section>
  );
};

export default PopularTours;
