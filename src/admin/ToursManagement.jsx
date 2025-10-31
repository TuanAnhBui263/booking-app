const ToursManagement = () => {
    const tours = [
      { id: 1, name: 'Matterhorn Base Trek', location: 'Switzerland', price: 299, status: 'Active' },
      { id: 2, name: 'Mont Blanc Circuit', location: 'France', price: 499, status: 'Active' },
      { id: 3, name: 'Dolomites Adventure', location: 'Italy', price: 399, status: 'Inactive' }
    ];
  
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Tours Management</h1>
          <button className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 flex items-center gap-2">
            <Plus size={20} />
            Add New Tour
          </button>
        </div>
  
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text"
                placeholder="Search tours..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500">
              <option>All Status</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
  
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">Tour Name</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">Location</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">Price</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tours.map((tour) => (
                  <tr key={tour.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{tour.name}</td>
                    <td className="py-3 px-4">{tour.location}</td>
                    <td className="py-3 px-4 font-semibold">${tour.price}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        tour.status === 'Active' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {tour.status}
                      </span>
                    </td>
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
  export default ToursManagement;