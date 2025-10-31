const AdminSidebar = ({ activeMenu, setActiveMenu, isMobileOpen, setIsMobileOpen }) => {
    const menuItems = [
      { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { id: 'tours', icon: MapPin, label: 'Tours' },
      { id: 'bookings', icon: ShoppingBag, label: 'Bookings' },
      { id: 'customers', icon: Users, label: 'Customers' },
      { id: 'settings', icon: Settings, label: 'Settings' }
    ];
  
    return (
      <>
        {/* Mobile Overlay */}
        {isMobileOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
  
        {/* Sidebar */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-gray-900 text-white
          transform transition-transform duration-300 ease-in-out
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="h-full flex flex-col">
            {/* Logo */}
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <LayoutDashboard className="text-orange-500" size={32} />
                <div>
                  <h2 className="font-bold text-lg">Hiking Tour</h2>
                  <p className="text-xs text-gray-400">Admin Panel</p>
                </div>
              </div>
              <button 
                className="lg:hidden"
                onClick={() => setIsMobileOpen(false)}
              >
                <X size={24} />
              </button>
            </div>
  
            {/* Menu Items */}
            <nav className="flex-1 p-4 space-y-2">
              {menuItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveMenu(item.id);
                    setIsMobileOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg
                    transition-colors
                    ${activeMenu === item.id 
                      ? 'bg-orange-500 text-white' 
                      : 'text-gray-300 hover:bg-gray-800'
                    }
                  `}
                >
                  <item.icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>
  
            {/* User Profile */}
            <div className="p-4 border-t border-gray-800">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                  <User size={20} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">Admin User</p>
                  <p className="text-xs text-gray-400">admin@example.com</p>
                </div>
              </div>
              <button className="w-full flex items-center gap-2 px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors">
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </aside>
      </>
    );
  };
  export default AdminSidebar;
  