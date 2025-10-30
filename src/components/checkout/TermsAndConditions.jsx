import React from 'react';

const TermsAndConditions = ({ agreed, setAgreed }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold mb-6">Điều khoản & Điều kiện</h2>
      
      <div className="space-y-4 text-gray-700 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-4 mb-4">
        <div>
          <h3 className="font-bold mb-2">Chính sách hủy tour</h3>
          <p className="text-sm">
            Miễn phí hủy tour trước ngày khởi hành 14 ngày. 
            Hoàn 50% cho các yêu cầu hủy trong khoảng 7–14 ngày trước ngày khởi hành. 
            Không hoàn tiền nếu hủy trong vòng 7 ngày.
          </p>
        </div>

        <div>
          <h3 className="font-bold mb-2">Điều kiện thời tiết</h3>
          <p className="text-sm">
            Chuyến tham quan có thể được dời lịch do điều kiện thời tiết khắc nghiệt. 
            Khách sẽ được hoàn tiền đầy đủ hoặc chọn ngày thay thế.
          </p>
        </div>

        <div>
          <h3 className="font-bold mb-2">Yêu cầu về thể lực</h3>
          <p className="text-sm">
            Người tham gia cần có sức khỏe tốt. 
            Hầu hết các chuyến tham quan yêu cầu mức độ thể lực trung bình.
          </p>
        </div>

        <div>
          <h3 className="font-bold mb-2">Bảo hiểm</h3>
          <p className="text-sm">
            Gói tour đã bao gồm bảo hiểm du lịch, 
            tuy nhiên khách được khuyến khích mua thêm bảo hiểm mở rộng nếu cần.
          </p>
        </div>

        <div>
          <h3 className="font-bold mb-2">Trách nhiệm</h3>
          <p className="text-sm">
            Người tham gia tự chịu trách nhiệm với các hoạt động trong chuyến đi. 
            Công ty không chịu trách nhiệm cho các tai nạn hoặc chấn thương xảy ra trong quá trình tham quan.
          </p>
        </div>
      </div>

      <label className="flex items-start gap-3 cursor-pointer">
        <input 
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-1 w-5 h-5 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
        />
        <span className="text-sm text-gray-700">
          Tôi đã đọc và đồng ý với 
          <a href="#" className="text-orange-500 hover:underline"> Điều khoản & Điều kiện</a>, 
          <a href="#" className="text-orange-500 hover:underline"> Chính sách hủy tour</a>, 
          và <a href="#" className="text-orange-500 hover:underline"> Chính sách bảo mật</a>.
        </span>
      </label>
    </div>
  );
};

export default TermsAndConditions;
