import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Star, 
  Clock, 
  Users, 
  Calendar,
  CheckCircle,
  XCircle,
  Mountain,
  Compass,
  Heart,
  Share2,
  ChevronRight,
  ArrowLeft,
  Phone,
  Mail,
  Award,
  Shield,
  DollarSign
} from 'lucide-react';

const TourDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState('');
  const [numberOfGuests, setNumberOfGuests] = useState(2);
  const [activeTab, setActiveTab] = useState('overview');
  const [liked, setLiked] = useState(false);

  const tour = {
    id: 1,
    title: "Hành Trình Dưới Chân Matterhorn",
    subtitle: "Khám phá vẻ đẹp hùng vĩ của dãy Alps Thụy Sĩ",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
      "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80",
      "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&q=80"
    ],
    location: "Zermatt, Thụy Sĩ",
    price: 299,
    duration: "5 ngày 4 đêm",
    groupSize: "8-12 người",
    rating: 5.0,
    reviews: 128,
    difficulty: "Trung bình",
    category: "Leo núi & Trekking",
    overview: "Trải nghiệm hành trình leo núi khó quên dưới chân Matterhorn - một trong những ngọn núi biểu tượng nhất thế giới. Tour này sẽ đưa bạn qua những thung lũng tuyệt đẹp, hồ băng trong xanh và những ngôi làng Alpine truyền thống.",
    highlights: [
      "Ngắm nhìn Matterhorn từ nhiều góc độ khác nhau",
      "Đi bộ qua các con đường mòn Alpine ngoạn mục",
      "Ghé thăm các ngôi làng truyền thống Thụy Sĩ",
      "Trải nghiệm ẩm thực địa phương đích thực",
      "Hướng dẫn viên chuyên nghiệp và giàu kinh nghiệm",
      "Thiết bị leo núi chất lượng cao được cung cấp"
    ],
    included: [
      "Chỗ ở 4 đêm (khách sạn 3-4 sao)",
      "Bữa sáng hàng ngày và 3 bữa tối",
      "Hướng dẫn viên chuyên nghiệp",
      "Vận chuyển trong tour",
      "Thiết bị leo núi cơ bản",
      "Bảo hiểm du lịch"
    ],
    notIncluded: [
      "Vé máy bay quốc tế",
      "Chi phí visa",
      "Bữa trưa",
      "Chi phí cá nhân",
      "Thiết bị leo núi chuyên nghiệp (có thể thuê)"
    ],
    itinerary: [
      {
        day: 1,
        title: "Đến Zermatt & Định hướng",
        description: "Đến Zermatt, nhận phòng khách sạn. Buổi chiều gặp gỡ nhóm và hướng dẫn viên, giới thiệu về hành trình và chuẩn bị thiết bị."
      },
      {
        day: 2,
        title: "Leo đến Schwarzsee",
        description: "Ngày leo đầu tiên đến Schwarzsee (2,583m). Ngắm cảnh tuyệt đẹp của Matterhorn và các ngọn núi xung quanh."
      },
      {
        day: 3,
        title: "Thung lũng Findeln",
        description: "Leo qua thung lũng Findeln với những ngôi làng truyền thống và cánh đồng cỏ Alpine. Dừng chân thưởng thức ẩm thực địa phương."
      },
      {
        day: 4,
        title: "Gornergrat & Sông băng",
        description: "Tham quan Gornergrat (3,089m) và khám phá sông băng Gorner - sông băng lớn thứ hai ở Alps."
      },
      {
        day: 5,
        title: "Kết thúc tour",
        description: "Buổi sáng tự do khám phá Zermatt. Buổi trưa check-out và tiễn đoàn."
      }
    ],
    guide: {
      name: "Hans Mueller",
      image: "https://i.pravatar.cc/200?img=12",
      experience: "15 năm",
      rating: 4.9,
      tours: 320
    }
  };

  const handleBookNow = () => {
    if (!selectedDate) {
      alert('Vui lòng chọn ngày khởi hành');
      return;
    }
    
    navigate('/checkout', {
      state: {
        tourData: {
          id: tour.id,
          title: tour.title,
          image: tour.image,
          price: tour.price,
          location: tour.location,
          duration: tour.duration,
          groupSize: tour.groupSize,
          date: selectedDate,
          guests: numberOfGuests
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Back Button */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-cyan-600 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Quay lại</span>
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-[500px]">
        <img 
          src={tour.image} 
          alt={tour.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        
        {/* Actions */}
        <div className="absolute top-6 right-6 flex gap-3">
          <button 
            onClick={() => setLiked(!liked)}
            className={`p-3 rounded-full backdrop-blur-md transition-all ${
              liked ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-700 hover:bg-white'
            }`}
          >
            <Heart size={20} className={liked ? 'fill-current' : ''} />
          </button>
          <button className="p-3 bg-white/90 backdrop-blur-md rounded-full text-gray-700 hover:bg-white transition-all">
            <Share2 size={20} />
          </button>
        </div>

        {/* Title */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-3">
              <span className="px-3 py-1 bg-cyan-500 text-white rounded-full text-sm font-semibold">
                {tour.category}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                tour.difficulty === 'Dễ' ? 'bg-green-500 text-white' :
                tour.difficulty === 'Trung bình' ? 'bg-yellow-500 text-white' :
                'bg-red-500 text-white'
              }`}>
                {tour.difficulty}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{tour.title}</h1>
            <p className="text-xl text-white/90">{tour.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2">
            {/* Quick Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-4 rounded-xl">
                <Clock className="text-cyan-600 mb-2" size={24} />
                <p className="text-sm text-gray-600">Thời lượng</p>
                <p className="font-bold text-gray-900">{tour.duration}</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl">
                <Users className="text-blue-600 mb-2" size={24} />
                <p className="text-sm text-gray-600">Nhóm</p>
                <p className="font-bold text-gray-900">{tour.groupSize}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl">
                <MapPin className="text-purple-600 mb-2" size={24} />
                <p className="text-sm text-gray-600">Địa điểm</p>
                <p className="font-bold text-gray-900">{tour.location}</p>
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded-xl">
                <Star className="text-yellow-600 mb-2" size={24} />
                <p className="text-sm text-gray-600">Đánh giá</p>
                <p className="font-bold text-gray-900">{tour.rating} ({tour.reviews})</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-8">
              <div className="flex gap-8">
                {['overview', 'itinerary', 'included'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 font-semibold transition-colors relative ${
                      activeTab === tab 
                        ? 'text-cyan-600' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab === 'overview' && 'Tổng quan'}
                    {tab === 'itinerary' && 'Lịch trình'}
                    {tab === 'included' && 'Bao gồm'}
                    {activeTab === tab && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-cyan-600 rounded-t" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Giới thiệu</h3>
                <p className="text-gray-700 leading-relaxed mb-6">{tour.overview}</p>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Điểm nổi bật</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {tour.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle className="text-green-500 flex-shrink-0 mt-1" size={20} />
                      <span className="text-gray-700">{highlight}</span>
                    </div>
                  ))}
                </div>

                {/* Gallery */}
                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Thư viện ảnh</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {tour.gallery.map((img, idx) => (
                    <div key={idx} className="aspect-square rounded-xl overflow-hidden">
                      <img 
                        src={img} 
                        alt={`Gallery ${idx + 1}`}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'itinerary' && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Lịch trình chi tiết</h3>
                <div className="space-y-6">
                  {tour.itinerary.map((day, idx) => (
                    <div key={idx} className="flex gap-6">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                          {day.day}
                        </div>
                      </div>
                      <div className="flex-1 pb-6 border-b border-gray-200 last:border-0">
                        <h4 className="text-xl font-bold text-gray-900 mb-2">{day.title}</h4>
                        <p className="text-gray-700 leading-relaxed">{day.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'included' && (
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Bao gồm</h3>
                  <div className="space-y-3">
                    {tour.included.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <CheckCircle className="text-green-500 flex-shrink-0 mt-1" size={20} />
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Không bao gồm</h3>
                  <div className="space-y-3">
                    {tour.notIncluded.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <XCircle className="text-red-500 flex-shrink-0 mt-1" size={20} />
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Guide Section */}
            <div className="mt-12 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Hướng dẫn viên của bạn</h3>
              <div className="flex items-center gap-6">
                <img 
                  src={tour.guide.image} 
                  alt={tour.guide.name}
                  className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
                />
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{tour.guide.name}</h4>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <Award size={16} className="text-cyan-600" />
                      <span>{tour.guide.experience} kinh nghiệm</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star size={16} className="fill-yellow-400 text-yellow-400" />
                      <span>{tour.guide.rating} đánh giá</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Compass size={16} className="text-cyan-600" />
                      <span>{tour.guide.tours} tours</span>
                    </div>
                  </div>
                  <p className="text-gray-700">
                    Hướng dẫn viên chuyên nghiệp với nhiều năm kinh nghiệm trong leo núi và trekking ở Alps.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
                <div className="mb-6">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-4xl font-bold text-cyan-600">${tour.price}</span>
                    <span className="text-gray-500">/người</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded">
                      <Star size={14} className="fill-yellow-400 text-yellow-400" />
                      <span className="font-bold text-sm text-yellow-600">{tour.rating}</span>
                    </div>
                    <span className="text-sm text-gray-600">({tour.reviews} đánh giá)</span>
                  </div>
                </div>

                {/* Date Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Ngày khởi hành
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:outline-none"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>

                {/* Guests */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Số lượng khách
                  </label>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setNumberOfGuests(Math.max(1, numberOfGuests - 1))}
                      className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 font-bold text-gray-700"
                    >
                      -
                    </button>
                    <span className="flex-1 text-center font-bold text-lg">{numberOfGuests}</span>
                    <button 
                      onClick={() => setNumberOfGuests(Math.min(12, numberOfGuests + 1))}
                      className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 font-bold text-gray-700"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="border-t border-gray-200 pt-4 mb-6 space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>${tour.price} x {numberOfGuests} khách</span>
                    <span>${tour.price * numberOfGuests}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Phí dịch vụ</span>
                    <span>${Math.round(tour.price * numberOfGuests * 0.1)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg text-gray-900 pt-2 border-t border-gray-200">
                    <span>Tổng cộng</span>
                    <span className="text-cyan-600">
                      ${Math.round(tour.price * numberOfGuests * 1.1)}
                    </span>
                  </div>
                </div>

                {/* Book Button */}
                <button 
                  onClick={handleBookNow}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all flex items-center justify-center gap-2 group"
                >
                  <span>Đặt ngay</span>
                  <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  Bạn sẽ không bị tính phí ngay lập tức
                </p>

                {/* Contact */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3">Cần hỗ trợ?</h4>
                  <div className="space-y-2 text-sm">
                    <a href="tel:+1234567890" className="flex items-center gap-2 text-gray-600 hover:text-cyan-600">
                      <Phone size={16} />
                      <span>+1 (234) 567-890</span>
                    </a>
                    <a href="mailto:support@tavelo.com" className="flex items-center gap-2 text-gray-600 hover:text-cyan-600">
                      <Mail size={16} />
                      <span>support@tavelo.com</span>
                    </a>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Shield className="text-green-500" size={16} />
                    <span>Bảo hiểm toàn diện</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Award className="text-cyan-500" size={16} />
                    <span>Hướng dẫn viên chuyên nghiệp</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <DollarSign className="text-blue-500" size={16} />
                    <span>Giá tốt nhất</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <CheckCircle className="text-purple-500" size={16} />
                    <span>Hoàn tiền 100%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourDetailPage;