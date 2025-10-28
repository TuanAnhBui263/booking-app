import React, { useState } from 'react';
import { MapPin, Calendar, Users } from 'lucide-react';

const SearchForm = () => {
  const [formData, setFormData] = useState({
    destination: '',
    date: '',
    guests: '2'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Search:', formData);
  };

  return (
    <section id="search" className="py-20 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Find Your <span className="text-orange-500">Adventure</span>
          </h2>
          <p className="text-gray-600 text-lg">Search for the perfect hiking tour</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Destination
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <select 
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  value={formData.destination}
                  onChange={(e) => setFormData({...formData, destination: e.target.value})}
                >
                  <option value="">Select destination</option>
                  <option value="switzerland">Switzerland</option>
                  <option value="france">France</option>
                  <option value="italy">Italy</option>
                  <option value="austria">Austria</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="date"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Guests
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <select 
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  value={formData.guests}
                  onChange={(e) => setFormData({...formData, guests: e.target.value})}
                >
                  {[1,2,3,4,5,6,7,8,9,10].map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full mt-6 bg-orange-500 text-white py-4 rounded-lg font-semibold hover:bg-orange-600 transition-colors text-lg"
          >
            Search Tours
          </button>
        </form>
      </div>
    </section>
  );
};

export default SearchForm;