import React from 'react';
import { CreditCard, Check, Lock } from 'lucide-react';

const PaymentMethod = ({ selectedMethod, setSelectedMethod }) => {
  const paymentMethods = [
    {
      id: 'vnpay',
      name: 'VNPay',
      description: 'Thanh toán qua các ngân hàng Việt Nam',
      logo: 'https://vnpay.vn/s1/statics.vnpay.vn/2023/9/06ncktiwd6dc1694418196384.png',
      popular: true
    },
    {
      id: 'paypal',
      name: 'PayPal',
      description: 'Thanh toán bằng tài khoản PayPal',
      logo: 'https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_111x69.jpg',
      popular: false
    },
    {
      id: 'card',
      name: 'Thẻ tín dụng/Ghi nợ',
      description: 'Thanh toán bằng Visa, Mastercard, v.v...',
      logo: null,
      popular: false
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold mb-6">Phương thức thanh toán</h2>
      
      <div className="space-y-4">
        {paymentMethods.map((method) => (
          <div 
            key={method.id}
            onClick={() => setSelectedMethod(method.id)}
            className={`relative border-2 rounded-xl p-6 cursor-pointer transition-all ${
              selectedMethod === method.id 
                ? 'border-orange-500 bg-orange-50' 
                : 'border-gray-200 hover:border-orange-300'
            }`}
          >
            {method.popular && (
              <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                Phổ biến
              </div>
            )}

            <div className="flex items-center gap-4">
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                selectedMethod === method.id ? 'border-orange-500' : 'border-gray-300'
              }`}>
                {selectedMethod === method.id && (
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                )}
              </div>

              {method.logo ? (
                <img src={method.logo} alt={method.name} className="h-10 object-contain" />
              ) : (
                <CreditCard className="text-gray-600" size={32} />
              )}

              <div className="flex-1">
                <h3 className="font-bold text-lg">{method.name}</h3>
                <p className="text-sm text-gray-600">{method.description}</p>
              </div>

              {selectedMethod === method.id && (
                <Check className="text-orange-500" size={24} />
              )}
            </div>

            {/* Form nhập thông tin thẻ */}
            {selectedMethod === 'card' && method.id === 'card' && (
              <div className="mt-6 pt-6 border-t space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Số thẻ
                  </label>
                  <input 
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Ngày hết hạn
                    </label>
                    <input 
                      type="text"
                      placeholder="MM/YY"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Mã CVV
                    </label>
                    <input 
                      type="text"
                      placeholder="123"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tên chủ thẻ
                  </label>
                  <input 
                    type="text"
                    placeholder="NGUYEN VAN A"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Thông tin bảo mật thanh toán */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <Lock className="text-blue-600 flex-shrink-0" size={20} />
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">Thanh toán an toàn</p>
            <p>Thông tin thanh toán của bạn được mã hóa và bảo mật. Chúng tôi không lưu trữ thông tin thẻ của bạn.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethod;
