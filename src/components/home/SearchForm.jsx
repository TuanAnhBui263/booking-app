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
    console.log('Tìm kiếm:', formData);
  };

  return (
    <section id="search" className="py-20 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Tìm Kiếm <span className="text-orange-500">Hành Trình</span>
          </h2>
          <p className="text-gray-600 text-lg">Chọn tour leo núi phù hợp nhất với bạn</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Điểm đến */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Điểm đến
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <select 
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  value={formData.destination}
                  onChange={(e) => setFormData({...formData, destination: e.target.value})}
                >
                  <option value="">Chọn điểm đến</option>
                  <option value="switzerland">Thụy Sĩ</option>
                  <option value="france">Pháp</option>
                  <option value="italy">Ý</option>
                  <option value="austria">Áo</option>
                </select>
              </div>
            </div>

            {/* Ngày khởi hành */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Ngày khởi hành
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

            {/* Số khách */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Số khách
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <select 
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  value={formData.guests}
                  onChange={(e) => setFormData({...formData, guests: e.target.value})}
                >
                  {[1,2,3,4,5,6,7,8,9,10].map(num => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'khách' : 'khách'}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Nút tìm kiếm */}
          <button 
            type="submit"
            className="w-full mt-6 bg-orange-500 text-white py-4 rounded-lg font-semibold hover:bg-orange-600 transition-colors text-lg"
          >
            TÌM KIẾM TOUR
          </button>
        </form>
      </div>
    </section>
  );
};

export default SearchForm;
