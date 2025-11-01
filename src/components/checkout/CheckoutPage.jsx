import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ContactForm from './ContactForm';
import PaymentMethod from './PaymentMethod';
import TermsAndConditions from './TermsAndConditions';
import OrderSummary from './OrderSummary';
import {
  CreditCard,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Users,
  Check,
  Lock,
  ArrowLeft,
  ChevronRight
} from 'lucide-react';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    specialRequests: ''
  });

  const [errors, setErrors] = useState({});
  const [selectedMethod, setSelectedMethod] = useState('vnpay');
  const [agreed, setAgreed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const tourData = {
    title: "Hành trình Matterhorn",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    date: "15/06/2025",
    guests: 2,
    location: "Thụy Sĩ",
    price: 299,
    serviceFee: 29,
    insurance: 15,
    total: 642
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Vui lòng nhập tên';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Vui lòng nhập họ';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async () => {
    if (!validateForm()) {
      alert('Vui lòng điền đầy đủ các thông tin bắt buộc');
      return;
    }

    if (!agreed) {
      alert('Vui lòng đồng ý với các điều khoản và điều kiện');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);

      if (selectedMethod === 'vnpay') {
        alert('Đang chuyển hướng đến cổng thanh toán VNPay...');
      } else if (selectedMethod === 'paypal') {
        alert('Đang chuyển hướng đến PayPal...');
      } else {
        alert('Đang xử lý thanh toán bằng thẻ tín dụng...');
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
          <button 
              onClick={() => navigate('/tours')} 
              className="flex items-center gap-2 text-gray-600 hover:text-orange-500"
            >
              <ArrowLeft size={20} />
              <span>Quay lại danh sách tour</span>
            </button>
            <h1 className="text-2xl font-bold">Thanh toán</h1>
            <div className="w-24"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cột trái - Biểu mẫu */}
          <div className="lg:col-span-2">
            <ContactForm 
              formData={formData} 
              setFormData={setFormData}
              errors={errors}
            />
            
            <PaymentMethod 
              selectedMethod={selectedMethod}
              setSelectedMethod={setSelectedMethod}
            />
            
            <TermsAndConditions 
              agreed={agreed}
              setAgreed={setAgreed}
            />

            {/* Nút hoàn tất thanh toán */}
            <button 
              onClick={handlePayment}
              disabled={isProcessing || !agreed}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                isProcessing || !agreed
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-orange-500 text-white hover:bg-orange-600 transform hover:scale-[1.02]'
              }`}
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Đang xử lý...
                </>
              ) : (
                <>
                  Hoàn tất thanh toán - ${tourData.total}
                  <ChevronRight size={20} />
                </>
              )}
            </button>
          </div>

          {}
          <div className="lg:col-span-1">
            <OrderSummary tourData={tourData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
