const AdminPage = () => {
    const navigate = useNavigate();
    const [activeMenu, setActiveMenu] = useState('dashboard');
    const [isMobileOpen, setIsMobileOpen] = useState(false);
  
    const handleLogout = () => {
      navigate('/login');
    };
  
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <AdminSidebar 
          activeMenu={activeMenu} 
          setActiveMenu={setActiveMenu}
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
          onLogout={handleLogout}
        />
  
        <div className="flex-1 flex flex-col">
          <header className="bg-white shadow-sm p-4 flex items-center justify-between">
            <button 
              className="lg:hidden"
              onClick={() => setIsMobileOpen(true)}
            >
              <Menu size={24} />
            </button>
            
            <div className="flex-1 max-w-xl mx-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
  
            <div className="flex items-center gap-4">
              <button className="relative p-2 hover:bg-gray-100 rounded-lg">
                <Bell size={24} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                <User size={20} className="text-white" />
              </div>
            </div>
          </header>
  
          <main className="flex-1 p-6 overflow-auto">
            {activeMenu === 'dashboard' && <AdminDashboard />}
            {activeMenu === 'tours' && <ToursManagement />}
            {activeMenu === 'bookings' && <div className="text-2xl">Bookings Management (Coming Soon)</div>}
            {activeMenu === 'customers' && <div className="text-2xl">Customers Management (Coming Soon)</div>}
            {activeMenu === 'settings' && <div className="text-2xl">Settings (Coming Soon)</div>}
          </main>
        </div>
      </div>
    );
  };
  
  export default AdminPage;