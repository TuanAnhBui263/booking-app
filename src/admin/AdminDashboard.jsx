const AdminDashboard = () => {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>
  
        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <DollarSign className="text-orange-500" size={24} />
              </div>
              <span className="text-green-500 text-sm font-semibold">+12%</span>
            </div>
            <h3 className="text-gray-600 text-sm mb-1">Total Revenue</h3>
            <p className="text-2xl font-bold">$45,231</p>
          </div>
  
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <ShoppingBag className="text-blue-500" size={24} />
              </div>
              <span className="text-green-500 text-sm font-semibold">+8%</span>
            </div>
            <h3 className="text-gray-600 text-sm mb-1">Total Bookings</h3>
            <p className="text-2xl font-bold">1,234</p>
          </div>
  
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="text-green-500" size={24} />
              </div>
              <span className="text-green-500 text-sm font-semibold">+23%</span>
            </div>
            <h3 className="text-gray-600 text-sm mb-1">Total Customers</h3>
            <p className="text-2xl font-bold">8,549</p>
          </div>
  
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <MapPin className="text-purple-500" size={24} />
              </div>
              <span className="text-green-500 text-sm font-semibold">+5%</span>
            </div>
            <h3 className="text-gray-600 text-sm mb-1">Active Tours</h3>
            <p className="text-2xl font-bold">42</p>
          </div>
        </div>
  
        {/* Recent Bookings */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Recent Bookings</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">Customer</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">Tour</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">Date</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">Amount</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'John Doe', tour: 'Matterhorn Trek', date: 'Jun 15, 2025', amount: '$299', status: 'Confirmed' },
                  { name: 'Jane Smith', tour: 'Mont Blanc Circuit', date: 'Jun 20, 2025', amount: '$499', status: 'Pending' },
                  { name: 'Mike Johnson', tour: 'Dolomites Adventure', date: 'Jun 25, 2025', amount: '$399', status: 'Confirmed' }
                ].map((booking, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{booking.name}</td>
                    <td className="py-3 px-4">{booking.tour}</td>
                    <td className="py-3 px-4">{booking.date}</td>
                    <td className="py-3 px-4 font-semibold">{booking.amount}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        booking.status === 'Confirmed' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {booking.status}
                      </span>
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
  export default AdminDashboard;