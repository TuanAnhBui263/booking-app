import React, { useEffect, useMemo, useState } from 'react';
import { reviewService } from '../../services/reviewService';
import ReviewStars from './ReviewStars';
import { Loader, AlertCircle, MessageCircle, ThumbsUp, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const emptyStats = {
  totalReviews: 0,
  averageRating: 0,
  ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
};

const normalizeSummary = (payload) => {
  if (!payload) return null;
  const summary = payload.data || payload.Data || payload;
  return {
    tourId: summary.tourId ?? summary.TourId,
    tourName: summary.tourName ?? summary.TourName,
    averageRating: summary.averageRating ?? summary.AverageRating ?? 0,
    totalReviews: summary.totalReviews ?? summary.TotalReviews ?? 0,
    recommendationPercentage: summary.recommendationPercentage ?? summary.RecommendationPercentage ?? 0,
    recentReviews: summary.recentReviews ?? summary.RecentReviews ?? [],
    statistics: summary.statistics ?? summary.Statistics ?? {},
  };
};

const normalizePagedResult = (payload) => {
  const data = payload?.data || payload?.Data || payload || {};
  const items =
    data.items ||
    data.Items ||
    data.results ||
    data.Results ||
    data.data ||
    data.Data ||
    [];

  return {
    items,
    pageNumber: data.pageNumber ?? data.PageNumber ?? 1,
    pageSize: data.pageSize ?? data.PageSize ?? items.length,
    totalItems: data.totalItems ?? data.TotalItems ?? items.length,
    totalPages: data.totalPages ?? data.TotalPages ?? 1,
  };
};

const normalizeReviewItem = (review) => {
  if (!review) return {};

  const user =
    review.user ||
    review.User ||
    {};

  return {
    id: review.id ?? review.Id,
    userId: review.userId ?? review.UserId ?? user.id ?? user.Id ?? 0,
    userName:
      review.userName ??
      review.UserName ??
      user.fullName ??
      user.FullName ??
      user.name ??
      user.Name ??
      'Ẩn danh',
    userAvatar:
      review.userAvatar ??
      review.UserAvatar ??
      user.avatar ??
      user.Avatar ??
      '',
    rating: Number(review.rating ?? review.Rating ?? 0),
    title: review.title ?? review.Title ?? '',
    comment: review.comment ?? review.Comment ?? '',
    helpfulCount: review.helpfulCount ?? review.HelpfulCount ?? 0,
    createdAt: review.createdAt ?? review.CreatedAt ?? null,
    images: review.images ?? review.Images ?? [],
  };
};

const formatDate = (value) => {
  if (!value) return 'Chưa cập nhật';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const ReviewCard = ({ review, onMarkHelpful, markingHelpful }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="font-semibold text-gray-900">{review.userName}</p>
          <p className="text-sm text-gray-500">{formatDate(review.createdAt)}</p>
        </div>
        <ReviewStars value={review.rating} size={18} />
      </div>
      {review.title && <p className="text-lg font-semibold text-gray-900 mb-2">{review.title}</p>}
      <p className="text-gray-700 mb-4 whitespace-pre-line">{review.comment}</p>

      {review.images?.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-4">
          {review.images.map((image, idx) => {
            const url =
              (image && (image.imageUrl || image.ImageUrl || image.url || image.Url)) ||
              image;
            const caption =
              (image && (image.caption || image.Caption || image.description || image.Description)) ||
              `Review image ${idx + 1}`;

            if (!url) return null;

            return (
              <img
                key={idx}
                src={url}
                alt={caption}
                className="w-24 h-24 object-cover rounded-lg border border-gray-100"
              />
            );
          })}
        </div>
      )}

      <div className="flex items-center justify-between text-sm">
        <div className="text-gray-500">
          {review.helpfulCount || 0} người thấy đánh giá này hữu ích
        </div>
        <button
          type="button"
          onClick={() => onMarkHelpful(review.id)}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-cyan-500 hover:text-cyan-600 transition-all disabled:opacity-60"
          disabled={markingHelpful}
        >
          <ThumbsUp size={16} />
          Hữu ích
        </button>
      </div>
    </div>
  );
};

const RatingDistributionBar = ({ stats }) => {
  const total = stats.totalReviews || 0;
  return (
    <div className="space-y-3">
      {[5, 4, 3, 2, 1].map((rating) => {
        const count =
          stats.ratingDistribution?.[rating] ??
          stats.ratingDistribution?.[rating.toString()] ??
          0;
        const percentage = total ? Math.round((count / total) * 100) : 0;
        return (
          <div key={rating} className="flex items-center gap-3">
            <span className="w-16 text-sm font-medium text-gray-600">
              {rating} sao
            </span>
            <div className="flex-1 bg-gray-200 rounded-full h-2.5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className="w-12 text-sm font-medium text-gray-600 text-right">
              {percentage}%
            </span>
          </div>
        );
      })}
    </div>
  );
};

const TourReviewsSection = ({ tourId }) => {
  const { isAuthenticated } = useAuth();
  const [summary, setSummary] = useState(null);
  const [stats, setStats] = useState(emptyStats);
  const [reviews, setReviews] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [markingHelpful, setMarkingHelpful] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!tourId) return;
    fetchSummary();
  }, [tourId]);

  useEffect(() => {
    if (!tourId) return;
    fetchReviews();
  }, [tourId, pageNumber]);

  const fetchSummary = async () => {
    try {
      const [summaryResponse, statsResponse] = await Promise.all([
        reviewService.getTourSummary(tourId),
        reviewService.getTourStatistics(tourId),
      ]);
      const normalizedSummary = normalizeSummary(summaryResponse);
      setSummary(normalizedSummary);
      const statistics =
        normalizedSummary?.statistics ||
        statsResponse?.statistics ||
        statsResponse?.Statistics ||
        statsResponse ||
        emptyStats;
      const distribution =
        statistics.ratingDistribution ||
        statistics.RatingDistribution || {
          5: statistics.fiveStarCount ?? statistics.FiveStarCount ?? 0,
          4: statistics.fourStarCount ?? statistics.FourStarCount ?? 0,
          3: statistics.threeStarCount ?? statistics.ThreeStarCount ?? 0,
          2: statistics.twoStarCount ?? statistics.TwoStarCount ?? 0,
          1: statistics.oneStarCount ?? statistics.OneStarCount ?? 0,
        };
      setStats({
        totalReviews: statistics.totalReviews ?? statistics.TotalReviews ?? 0,
        averageRating: statistics.averageRating ?? statistics.AverageRating ?? 0,
        ratingDistribution: distribution,
      });
    } catch (err) {
      console.error('Failed to load review summary', err);
      setError(err.message || 'Không thể tải thống kê đánh giá');
    } finally {
      // no-op
    }
  };

  const fetchReviews = async () => {
    try {
      setReviewsLoading(true);
      const response = await reviewService.getTourReviews(tourId, pageNumber, pageSize);
      const paged = normalizePagedResult(response);
      setReviews(paged.items.map(normalizeReviewItem));
      setTotalPages(paged.totalPages);
    } catch (err) {
      console.error('Failed to load reviews', err);
      setError(err.message || 'Không thể tải danh sách đánh giá');
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleMarkHelpful = async (id) => {
    try {
      setMarkingHelpful(true);
      await reviewService.markHelpful(id);
      setReviews((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, helpfulCount: (item.helpfulCount || 0) + 1 }
            : item
        )
      );
    } catch (err) {
      console.error('Failed to mark helpful', err);
      alert(err.message || 'Không thể ghi nhận phản hồi');
    } finally {
      setMarkingHelpful(false);
    }
  };

  const recommendedText = useMemo(() => {
    if (!summary) return 'Chưa có dữ liệu';
    return `${summary.recommendationPercentage || 0}% khách hàng sẵn sàng giới thiệu tour này`;
  }, [summary]);

  if (!tourId) return null;

  return (
    <section className="mt-12">
      <div className="flex items-center gap-3 mb-6">
        <MessageCircle className="text-cyan-600" size={26} />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Đánh giá từ khách hàng</h2>
          <p className="text-gray-500">Tổng hợp trải nghiệm thực tế của du khách đã tham gia tour</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3 text-red-700">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3 mb-8">
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
          <p className="text-sm uppercase tracking-wide text-gray-500 mb-2">Điểm trung bình</p>
          <div className="flex items-end gap-4 mb-4">
            <span className="text-5xl font-extrabold text-gray-900">
              {(stats.averageRating || 0).toFixed(1)}
            </span>
            <span className="text-gray-500 mb-2">/ 5</span>
          </div>
          <ReviewStars value={stats.averageRating || 0} size={26} />
          <p className="text-gray-600 mt-4">
            {stats.totalReviews} đánh giá được xác thực
          </p>
          <div className="mt-4 bg-cyan-50 text-cyan-700 rounded-xl p-4 flex items-start gap-3">
            <TrendingUp size={20} className="text-cyan-500" />
            <div>
              <p className="font-semibold">{recommendedText}</p>
              <p className="text-sm text-cyan-600">
                Dựa trên phản hồi của khách hàng trong 12 tháng gần nhất
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 lg:col-span-2">
          <p className="font-semibold text-gray-900 mb-4">Phân bố đánh giá</p>
          <RatingDistributionBar stats={stats} />
        </div>
      </div>

      {!isAuthenticated && (
        <div className="mb-8">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-5 py-3 border border-cyan-500 text-cyan-600 rounded-xl font-semibold hover:bg-cyan-50 transition-colors"
          >
            Đăng nhập để viết đánh giá của bạn
          </Link>
        </div>
      )}

      {isAuthenticated && (
        <div className="mb-8">
          <Link
            to="/bookings"
            className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all"
          >
            Viết đánh giá trong lịch sử đặt tour
          </Link>
        </div>
      )}

      {reviewsLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader className="animate-spin text-cyan-500" size={40} />
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-12 text-center">
          <MessageCircle className="mx-auto text-gray-300" size={48} />
          <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">Chưa có đánh giá nào</h3>
          <p className="text-gray-500 max-w-lg mx-auto">
            Hãy trở thành người đầu tiên chia sẻ trải nghiệm của bạn sau khi hoàn thành tour.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onMarkHelpful={handleMarkHelpful}
              markingHelpful={markingHelpful}
            />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-8">
          <button
            type="button"
            onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
            className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:border-cyan-500 disabled:opacity-50"
            disabled={pageNumber === 1}
          >
            Trước
          </button>
          <span className="text-sm font-medium text-gray-600">
            Trang {pageNumber} / {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPageNumber((prev) => Math.min(prev + 1, totalPages))}
            className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:border-cyan-500 disabled:opacity-50"
            disabled={pageNumber === totalPages}
          >
            Sau
          </button>
        </div>
      )}
    </section>
  );
};

export default TourReviewsSection;

