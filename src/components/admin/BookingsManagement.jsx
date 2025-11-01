import React, { useState } from 'react';
import { Filter, CheckCircle, Clock, XCircle, DollarSign } from 'lucide-react';
const BookingsManagement = () => {
    const [bookings] = useState([
      { id: 'BK001', customer: 'John Doe', tour: 'Matterhorn Trek', date: 'Jun 15, 2025', guests: 2, amount: 598, status: 'Confirmed', payment: 'Paid' },
      { id: 'BK002', customer: 'Jane Smith', tour: 'Mont Blanc Circuit', date: 'Jun 20, 2025', guests: 4, amount: 1996, status: 'Pending', payment: 'Pending' },
      { id: 'BK003', customer: 'Mike Johnson', tour: 'Dolomites Adventure', date: 'Jun 25, 2025', guests: 3, amount: 1197, status: 'Confirmed', payment: 'Paid' },
      { id: 'BK004', customer: 'Sarah Williams', tour: 'Swiss Alps Explorer', date: 'Jul 1, 2025', guests: 2, amount: 1198, status: 'Cancelled', payment: 'Refunded' }
    ]);
  
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Bookings Management</h1>
          <div className="flex gap-3">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
              <Filter size={18} />
              Filter
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              Export
            </button>
          </div>
        </div>
  
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-2 text-green-600 mb-2">
              <CheckCircle size={20} />
              <span className="font-semibold">Confirmed</span>
            </div>
            <p className="text-2xl font-bold">856</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-2 text-yellow-600 mb-2">
              <Clock size={20} />
              <span className="font-semibold">Pending</span>
            </div>
            <p className="text-2xl font-bold">124</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-2 text-red-600 mb-2">
              <XCircle size={20} />
              <span className="font-semibold">Cancelled</span>
            </div>
            <p className="text-2xl font-bold">45</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-2 text-blue-600 mb-2">
              <DollarSign size={20} />
              <span className="font-semibold">Revenue</span>
            </div>
            <p className="text-2xl font-bold">$45.2K</p>
          </div>
        </div>
  
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">Booking ID</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">Customer</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">Tour</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">Date</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">Guests</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">Amount</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">Payment</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-blue-600">{booking.id}</td>
                    <td className="py-3 px-4">{booking.customer}</td>
                    <td className="py-3 px-4">{booking.tour}</td>
                    <td className="py-3 px-4">{booking.date}</td>
                    <td className="py-3 px-4">{booking.guests}</td>
                    <td className="py-3 px-4 font-semibold">${booking.amount}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        booking.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                        booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        booking.payment === 'Paid' ? 'bg-green-100 text-green-700' :
                        booking.payment === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {booking.payment}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button className="text-blue-500 hover:underline">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };
  export default BookingsManagement;