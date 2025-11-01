import React, { useState } from 'react';
import AdminDashboard from '../admin/AdminDashboard';
import ToursManagement from '../admin/ToursManagement';
import BookingsManagement from '../admin/BookingsManagement';
import AdminSidebar from '../admin/AdminSidebar';
import CustomersManagement from '../admin/CustomersManagement';
import SettingsPage from '../admin/SettingsPage';
import { Menu, Search, Bell, User } from 'lucide-react';
const AdminPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState('dashboard');

  const renderContent = () => {
    switch (activePage) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'tours':
        return <ToursManagement />;
      case 'bookings':
        return <BookingsManagement />;
      case 'customers':
        return <CustomersManagement />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar 
        activePage={activePage} 
        setActivePage={setActivePage}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
                className="lg:hidden hover:bg-gray-100 p-2 rounded-lg"
              >
                <Menu className="text-gray-700" size={24} />
              </button>
              <h1 className="text-xl font-bold text-gray-800">Trang quản trị</h1>
            </div>

            {/* Search & Icons */}
            <div className="flex items-center gap-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 w-64"
                />
              </div>
              <button className="relative p-2 hover:bg-gray-100 rounded-lg">
                <Bell className="text-gray-600" size={22} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <User className="text-gray-600" size={22} />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminPage;
