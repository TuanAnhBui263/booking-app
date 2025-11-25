import React, { useEffect, useMemo, useState } from 'react';
import { X, Loader, Trash2 } from 'lucide-react';
import ReviewStars from './ReviewStars';
import { reviewService } from '../../services/reviewService';

const defaultFormState = {
  rating: 5,
  title: '',
  comment: '',
  imagesText: '',
};

const BookingReviewModal = ({
  isOpen,
  booking,
  existingReview,
  loadingExisting = false,
  onClose,
  onCompleted,
}) => {
  const [formState, setFormState] = useState(defaultFormState);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setFormState(defaultFormState);
      setSubmitting(false);
      return;
    }

    if (existingReview) {
      setFormState({
        rating: existingReview.rating || 5,
        title: existingReview.title || '',
        comment: existingReview.comment || '',
        imagesText: (existingReview.images || [])
          .map((img) => img.imageUrl || img)
          .join('\n'),
      });
    } else {
      setFormState(defaultFormState);
    }
  }, [existingReview, isOpen]);

  const handleChange = (field, value) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const imageList = useMemo(() => {
    return formState.imagesText
      .split('\n')
      .map((url) => url.trim())
      .filter(Boolean);
  }, [formState.imagesText]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!booking) return;

    if (!formState.comment.trim()) {
      alert('Vui lòng chia sẻ cảm nhận của bạn.');
      return;
    }

    setSubmitting(true);
    try {
      if (existingReview?.id) {
        await reviewService.updateReview(existingReview.id, {
          rating: formState.rating,
          title: formState.title,
          comment: formState.comment,
          images: imageList,
        });
      } else {
        await reviewService.createReview({
          tourId: booking.tourId,
          bookingId: booking.id,
          rating: formState.rating,
          title: formState.title,
          comment: formState.comment,
          images: imageList,
        });
      }

      onCompleted?.();
      onClose();
    } catch (error) {
      console.error('Review submission failed', error);
      alert(error.message || 'Không thể gửi đánh giá. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!existingReview?.id) return;
    if (!window.confirm('Bạn có chắc chắn muốn xóa đánh giá này?')) return;

    setSubmitting(true);
    try {
      await reviewService.deleteReview(existingReview.id);
      onCompleted?.();
      onClose();
    } catch (error) {
      console.error('Delete review failed', error);
      alert(error.message || 'Không thể xóa đánh giá.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen || !booking) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <p className="text-sm text-gray-500">Đánh giá tour</p>
            <h3 className="text-xl font-bold text-gray-900">{booking.tourName}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
            aria-label="Đóng"
          >
            <X size={20} />
          </button>
        </div>

        {loadingExisting ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader className="animate-spin text-cyan-500" size={36} />
            <p className="mt-4 text-gray-500">Đang tải đánh giá...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Bạn đánh giá tour này như thế nào?
              </label>
              <ReviewStars
                value={formState.rating}
                interactive
                size={28}
                onChange={(value) => handleChange('rating', value)}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tiêu đề ngắn gọn
              </label>
              <input
                type="text"
                value={formState.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Ví dụ: Trải nghiệm tuyệt vời!"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-none"
                maxLength={120}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Cảm nhận của bạn
              </label>
              <textarea
                value={formState.comment}
                onChange={(e) => handleChange('comment', e.target.value)}
                rows={5}
                placeholder="Hãy chia sẻ những điều bạn thích và những điểm có thể cải thiện..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Hình ảnh (tuỳ chọn)
              </label>
              <textarea
                value={formState.imagesText}
                onChange={(e) => handleChange('imagesText', e.target.value)}
                rows={3}
                placeholder="Dán đường dẫn ảnh, mỗi dòng một ảnh"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-none resize-none text-sm text-gray-600"
              />
              <p className="text-xs text-gray-500 mt-1">
                Chúng tôi hiện hỗ trợ dán URL của ảnh đã được tải lên trên các nền tảng khác.
              </p>
            </div>

            {imageList.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Xem trước</p>
                <div className="flex flex-wrap gap-3">
                  {imageList.map((url) => (
                    <img
                      key={url}
                      src={url}
                      alt="Uploaded preview"
                      className="w-20 h-20 object-cover rounded-lg border border-gray-100"
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              {existingReview?.id ? (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 text-sm font-medium"
                  disabled={submitting}
                >
                  <Trash2 size={16} />
                  Xóa đánh giá
                </button>
              ) : (
                <div />
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:border-gray-300"
                  disabled={submitting}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold shadow-lg hover:shadow-xl disabled:opacity-60"
                  disabled={submitting}
                >
                  {submitting ? 'Đang gửi...' : existingReview ? 'Cập nhật đánh giá' : 'Gửi đánh giá'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default BookingReviewModal;

