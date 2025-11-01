import React, { useState } from 'react';
import { Plus, UsersIcon, TrendingUp, DollarSign, Search, Mail, Phone, Edit, Trash2 } from 'lucide-react'; 
const CustomersManagement = () => {
    const [customers] = useState([
      { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+1 234 567 8901', totalBookings: 5, totalSpent: 2495, joined: 'Jan 15, 2024' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '+1 234 567 8902', totalBookings: 3, totalSpent: 1497, joined: 'Feb 20, 2024' },
      { id: 3, name: 'Mike Johnson', email: 'mike@example.com', phone: '+1 234 567 8903', totalBookings: 7, totalSpent: 3493, joined: 'Mar 10, 2024' },
      { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', phone: '+1 234 567 8904', totalBookings: 2, totalSpent: 998, joined: 'Apr 5, 2024' }
    ]);
  
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Customers Management</h1>
          <button className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 flex items-center gap-2">
            <Plus size={20} />
            Add Customer
          </button>
        </div>
  
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-2 text-blue-600 mb-2">
              <UsersIcon size={20} />
              <span className="font-semibold">Total Customers</span>
            </div>
            <p className="text-2xl font-bold">8,549</p>
            <p className="text-sm text-gray-500 mt-1">+23% from last month</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-2 text-green-600 mb-2">
              <TrendingUp size={20} />
              <span className="font-semibold">Active Customers</span>
            </div>
            <p className="text-2xl font-bold">6,234</p>
            <p className="text-sm text-gray-500 mt-1">72.9% of total</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-2 text-purple-600 mb-2">
              <DollarSign size={20} />
              <span className="font-semibold">Avg. Spending</span>
            </div>
            <p className="text-2xl font-bold">$1,245</p>
            <p className="text-sm text-gray-500 mt-1">Per customer</p>
          </div>
        </div>
  
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text"
                placeholder="Search customers..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>
  
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">Customer</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">Contact</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">Total Bookings</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">Total Spent</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">Joined</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                          <span className="font-semibold text-orange-600">
                            {customer.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <span className="font-medium">{customer.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail size={14} />
                          {customer.email}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 mt-1">
                          <Phone size={14} />
                          {customer.phone}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold">{customer.totalBookings}</td>
                    <td className="py-3 px-4 font-semibold text-green-600">${customer.totalSpent}</td>
                    <td className="py-3 px-4">{customer.joined}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg">
                          <Edit size={18} />
                        </button>
                        <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                          <Trash2 size={18} />
                        </button>
                      </div>
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
  export default CustomersManagement;   