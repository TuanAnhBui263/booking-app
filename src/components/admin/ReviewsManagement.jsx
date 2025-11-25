import React, { useEffect, useMemo, useState } from 'react';
import { reviewService } from '../../services/reviewService';
import ReviewStars from '../reviews/ReviewStars';
import {
  AlertTriangle,
  CheckCircle,
  Filter,
  Loader,
  Search,
  ThumbsUp,
  XCircle,
} from 'lucide-react';

const statusTabs = [
  { id: 'Pending', label: 'Chờ duyệt' },
  { id: 'Approved', label: 'Đã duyệt' },
  { id: 'Rejected', label: 'Từ chối' },
  { id: 'All', label: 'Tất cả' },
];

const defaultFilters = {
  tourId: '',
  userId: '',
  minRating: '',
  maxRating: '',
};

const resolveRatingValue = (review) => {
  if (!review) return 0;
  const value = Number(review.rating ?? review.Rating ?? 0);
  return Number.isNaN(value) ? 0 : value;
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
    totalPages: data.totalPages ?? data.TotalPages ?? 1,
    totalItems: data.totalItems ?? data.TotalItems ?? items.length,
  };
};

const STATUS_VALUE_MAP = {
  0: 'Pending',
  1: 'Approved',
  2: 'Rejected',
};

const normalizeStatusValue = (status) => {
  if (status === undefined || status === null) return 'Pending';

  if (typeof status === 'number') {
    return STATUS_VALUE_MAP[status] || 'Pending';
  }

  const statusStr = String(status).trim();
  if (statusStr === '') return 'Pending';

  if (!Number.isNaN(Number(statusStr))) {
    return STATUS_VALUE_MAP[Number(statusStr)] || 'Pending';
  }

  const normalized = statusStr.toLowerCase();
  if (normalized === 'pending') return 'Pending';
  if (normalized === 'approved') return 'Approved';
  if (normalized === 'rejected' || normalized === 'denied') return 'Rejected';

  return statusStr;
};

const normalizeReviewItem = (review) => {
  if (!review) return {};

  const user =
    review.user ||
    review.User ||
    review.customer ||
    review.Customer ||
    {};
  const tour = review.tour || review.Tour || {};

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
      '',
    userAvatar:
      review.userAvatar ??
      review.UserAvatar ??
      user.avatar ??
      user.Avatar ??
      '',
    tourId:
      review.tourId ??
      review.TourId ??
      tour.id ??
      tour.Id ??
      0,
    tourName:
      review.tourName ??
      review.TourName ??
      tour.name ??
      tour.Name ??
      '',
    bookingId: review.bookingId ?? review.BookingId ?? null,
    rating: Number(review.rating ?? review.Rating ?? 0),
    title: review.title ?? review.Title ?? '',
    comment: review.comment ?? review.Comment ?? '',
    status: normalizeStatusValue(review.status ?? review.Status),
    helpfulCount: review.helpfulCount ?? review.HelpfulCount ?? 0,
    createdAt: review.createdAt ?? review.CreatedAt ?? null,
    approvedAt: review.approvedAt ?? review.ApprovedAt ?? null,
  };
};

const ReviewsManagement = () => {
  const [pendingCount, setPendingCount] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [statusFilter, setStatusFilter] = useState('Pending');
  const [filterInputs, setFilterInputs] = useState(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState(defaultFilters);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  const hasCustomFilters = useMemo(
    () => Object.values(appliedFilters).some((value) => value !== '' && value !== null),
    [appliedFilters]
  );

  useEffect(() => {
    fetchPendingCount();
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [statusFilter, pageNumber, appliedFilters]);

  const fetchPendingCount = async () => {
    try {
      const response = await reviewService.getPendingCount();
      const count = response?.pendingCount ?? response?.PendingCount ?? response ?? 0;
      setPendingCount(count);
    } catch (err) {
      console.warn('Không thể tải số lượng review pending', err);
    }
  };

  const buildSearchRequest = () => {
    const payload = {
      pageNumber,
      pageSize,
    };

    if (statusFilter !== 'All') {
      payload.status = statusFilter;
    }

    if (appliedFilters.tourId) {
      payload.tourId = Number(appliedFilters.tourId);
    }
    if (appliedFilters.userId) {
      payload.userId = Number(appliedFilters.userId);
    }
    if (appliedFilters.minRating) {
      payload.minRating = Number(appliedFilters.minRating);
    }
    if (appliedFilters.maxRating) {
      payload.maxRating = Number(appliedFilters.maxRating);
    }

    return payload;
  };

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      let response;

      const shouldUsePendingEndpoint = statusFilter === 'Pending' && !hasCustomFilters;
      if (shouldUsePendingEndpoint) {
        response = await reviewService.getPendingReviews(pageNumber, pageSize);
      } else {
        const searchPayload = buildSearchRequest();
        response = await reviewService.adminSearchReviews(searchPayload);
      }

      const paged = normalizePagedResult(response);
      setReviews(paged.items.map(normalizeReviewItem));
      setTotalPages(paged.totalPages);
    } catch (err) {
      console.error('Failed to load reviews', err);
      setError(err.message || 'Không thể tải danh sách đánh giá.');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tabId) => {
    setStatusFilter(tabId);
    setPageNumber(1);
  };

  const handleFilterInputChange = (field, value) => {
    setFilterInputs((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const applyFilters = () => {
    setAppliedFilters(filterInputs);
    setPageNumber(1);
  };

  const resetFilters = () => {
    setFilterInputs(defaultFilters);
    setAppliedFilters(defaultFilters);
    setPageNumber(1);
  };

  const handleApprove = async (reviewId) => {
    setProcessingId(reviewId);
    try {
      await reviewService.approveReview(reviewId);
      await fetchPendingCount();
      await fetchReviews();
    } catch (err) {
      alert(err.message || 'Không thể duyệt đánh giá.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (reviewId) => {
    setProcessingId(reviewId);
    try {
      await reviewService.rejectReview(reviewId);
      await fetchPendingCount();
      await fetchReviews();
    } catch (err) {
      alert(err.message || 'Không thể từ chối đánh giá.');
    } finally {
      setProcessingId(null);
    }
  };

  const renderStatusBadge = (status) => {
    const mapping = {
      Pending: {
        label: 'Chờ duyệt',
        className: 'bg-yellow-100 text-yellow-700',
        icon: AlertTriangle,
      },
      Approved: {
        label: 'Đã duyệt',
        className: 'bg-green-100 text-green-700',
        icon: CheckCircle,
      },
      Rejected: {
        label: 'Đã từ chối',
        className: 'bg-red-100 text-red-700',
        icon: XCircle,
      },
    };
    const statusConfig = mapping[status] || mapping.Pending;
    const Icon = statusConfig.icon;
    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${statusConfig.className}`}
      >
        <Icon size={14} />
        {statusConfig.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-2">Đánh giá chờ duyệt</p>
          <p className="text-4xl font-extrabold text-gray-900">{pendingCount}</p>
          <p className="text-xs text-gray-400 mt-1">Cần xử lý sớm</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-2">Bộ lọc nâng cao</p>
          <p className="text-xl font-bold text-gray-900">
            {hasCustomFilters ? 'Đang áp dụng' : 'Không có'}
          </p>
          <p className="text-xs text-gray-400 mt-1">Lọc theo tour, user, rating</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-2">Trang hiện tại</p>
          <p className="text-3xl font-bold text-gray-900">{pageNumber}</p>
          <p className="text-xs text-gray-400 mt-1">Tổng {totalPages} trang</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
        <div className="flex items-center gap-2 text-gray-700 font-semibold">
          <Filter size={18} />
          Bộ lọc
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-sm text-gray-500 mb-1 block">Tour ID</label>
            <input
              type="number"
              value={filterInputs.tourId}
              onChange={(e) => handleFilterInputChange('tourId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-cyan-500 focus:ring-1 focus:ring-cyan-200"
              placeholder="VD: 101"
            />
          </div>
          <div>
            <label className="text-sm text-gray-500 mb-1 block">User ID</label>
            <input
              type="number"
              value={filterInputs.userId}
              onChange={(e) => handleFilterInputChange('userId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-cyan-500 focus:ring-1 focus:ring-cyan-200"
              placeholder="VD: 42"
            />
          </div>
          <div>
            <label className="text-sm text-gray-500 mb-1 block">Rating tối thiểu</label>
            <input
              type="number"
              min="1"
              max="5"
              value={filterInputs.minRating}
              onChange={(e) => handleFilterInputChange('minRating', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-cyan-500 focus:ring-1 focus:ring-cyan-200"
              placeholder="1 - 5"
            />
          </div>
          <div>
            <label className="text-sm text-gray-500 mb-1 block">Rating tối đa</label>
            <input
              type="number"
              min="1"
              max="5"
              value={filterInputs.maxRating}
              onChange={(e) => handleFilterInputChange('maxRating', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-cyan-500 focus:ring-1 focus:ring-cyan-200"
              placeholder="1 - 5"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={applyFilters}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white rounded-lg font-semibold hover:bg-cyan-600 transition-colors"
          >
            <Search size={16} />
            Áp dụng
          </button>
          <button
            type="button"
            onClick={resetFilters}
            className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 font-semibold hover:bg-gray-50"
          >
            Xóa bộ lọc
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {statusTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => handleTabChange(tab.id)}
            className={`px-5 py-2 rounded-full font-semibold transition-all ${
              statusFilter === tab.id
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-cyan-200 hover:text-cyan-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader className="animate-spin text-cyan-500" size={40} />
            <p className="text-gray-500 mt-4">Đang tải danh sách đánh giá...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-20 px-6">
            <AlertTriangle className="mx-auto text-gray-300" size={48} />
            <h3 className="text-xl font-bold text-gray-900 mt-4 mb-2">Không có dữ liệu</h3>
            <p className="text-gray-500">Chưa có đánh giá phù hợp với bộ lọc hiện tại.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Thông tin
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Tour
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Chi tiết
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {reviews.map((review) => (
                  <tr key={review.id}>
                    <td className="px-4 py-4">
                      <p className="font-semibold text-gray-900">{review.userName || `User #${review.userId}`}</p>
                      <p className="text-sm text-gray-500">User ID: {review.userId}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <ReviewStars value={resolveRatingValue(review)} size={16} />
                        <span className="text-sm font-semibold text-gray-700">
                          {resolveRatingValue(review).toFixed(1)}
                        </span>
                      </div>
                      <div className="mt-2">{renderStatusBadge(review.status || review.Status)}</div>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-semibold text-gray-900">{review.tourName || `Tour #${review.tourId}`}</p>
                      <p className="text-sm text-gray-500">Tour ID: {review.tourId}</p>
                      <div className="mt-1 inline-flex items-center gap-1 text-xs text-gray-500">
                        <ThumbsUp size={14} />
                        <span>{review.helpfulCount || 0} hữu ích</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 max-w-md">
                      {review.title && (
                        <p className="font-semibold text-gray-900 mb-1">{review.title}</p>
                      )}
                      <p className="text-sm text-gray-600 line-clamp-3">{review.comment}</p>
                    </td>
                    <td className="px-4 py-4">
                      {review.status === 'Pending' ? (
                        <div className="flex flex-col gap-2">
                          <button
                            type="button"
                            onClick={() => handleApprove(review.id)}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 disabled:opacity-50"
                            disabled={processingId === review.id}
                          >
                            Duyệt
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReject(review.id)}
                            className="px-4 py-2 bg-red-50 text-red-600 rounded-lg font-semibold hover:bg-red-100 disabled:opacity-50"
                            disabled={processingId === review.id}
                          >
                            Từ chối
                          </button>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">Không có hành động</p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
            className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:border-cyan-500 disabled:opacity-50"
            disabled={pageNumber === 1}
          >
            Trang trước
          </button>
          <span className="text-sm font-semibold text-gray-600">
            Trang {pageNumber} / {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPageNumber((prev) => Math.min(prev + 1, totalPages))}
            className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:border-cyan-500 disabled:opacity-50"
            disabled={pageNumber === totalPages}
          >
            Trang sau
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewsManagement;

