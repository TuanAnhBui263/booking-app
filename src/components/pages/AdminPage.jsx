import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Menu, Search, Bell, User } from 'lucide-react';

import AdminSidebar from '../admin/AdminSidebar';
import AdminDashboard from '../admin/AdminDashboard';
import ToursManagement from '../admin/ToursManagement';

const AdminPage = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState('dashboard');

  const renderContent = () => {
    switch (activePage) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'tours':
        return <ToursManagement />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {}
      <AdminSidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
        activePage={activePage} 
        setActivePage={setActivePage} 
      />

      {}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between bg-white px-6 py-3 shadow-sm">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden">
              <Menu className="text-gray-700" size={24} />
            </button>
            <h1 className="text-xl font-bold text-gray-800">Trang quản trị</h1>
          </div>

          {/* Thanh tìm kiếm & icon */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <Bell className="text-gray-600 hover:text-orange-500 cursor-pointer" size={22} />
            <User
              className="text-gray-600 hover:text-orange-500 cursor-pointer"
              size={22}
              onClick={() => navigate('/login')}
            />
          </div>
        </header>

        {/* Nội dung thay đổi theo trang */}
        <main className="flex-1 overflow-y-auto p-6">{renderContent()}</main>
      </div>
    </div>
  );
};

export default AdminPage;
