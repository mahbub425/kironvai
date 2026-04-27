import { useState } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { 
  LayoutDashboard, 
  MessageSquare, 
  MapPin, 
  List, 
  Hammer, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  ChevronRight,
  Tags,
  Globe
} from 'lucide-react';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin');
  };

  // Menu configuration with Bengali labels and collapsible Complaints menu
  const menuItems = [
    { name: 'ড্যাশবোর্ড', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    {
      name: 'অভিযোগসমূহ',
      icon: <MessageSquare size={20} />, // parent item
      subItems: [
        { name: 'সকল অভিযোগ', path: '/admin/complaints' },
        { name: 'নতুন অভিযোগ যুক্ত করুন', path: '/admin/complaints/new' },
        { name: 'সমাধান হওয়া অভিযোগ', path: '/admin/complaints/resolved' },
      ],
    },
    { name: 'লোকেশন ম্যানেজমেন্ট', path: '/admin/locations', icon: <MapPin size={20} /> },
    { name: 'সমস্যার ধরন', path: '/admin/categories', icon: <List size={20} /> },
    { name: 'সামাজিক কাজের ধরন', path: '/admin/social-categories', icon: <Tags size={20} /> },
    { name: 'উন্নয়নমূলক কাজ', path: '/admin/development', icon: <Hammer size={20} /> },
    { name: 'স্বেচ্ছাসেবী কাজ', path: '/admin/social', icon: <Users size={20} /> },
    { name: 'হোমপেজ কন্টেন্ট', path: '/admin/home-content', icon: <Globe size={20} /> },
    { name: 'সেটিংস', path: '/admin/settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-x-hidden">
      {/* Mobile Sidebar Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`bg-slate-900 text-slate-300 transition-all duration-300 fixed lg:static inset-y-0 left-0 z-50 ${isSidebarOpen ? 'w-72 translate-x-0' : 'w-0 lg:w-20 -translate-x-full lg:translate-x-0 overflow-hidden'}`}>
        <div className="p-6 flex items-center justify-between">
          <div className={`flex items-center gap-3 transition-all duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 lg:opacity-0'}`}>
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-bold shrink-0">K1</div>
            <span className="font-bold text-white text-lg whitespace-nowrap">অ্যাডমিন প্যানেল</span>
          </div>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-800 rounded-lg lg:block hidden">
            <Menu size={20} />
          </button>
        </div>

        <nav className="mt-6 px-4 space-y-2 overflow-y-auto max-h-[calc(100vh-160px)]">
          {menuItems.map((item) => (
            item.subItems ? (
              <div key={item.name} className="space-y-1 mb-2">
                {/* Parent Label */}
                <div className="flex items-center gap-4 w-full p-4 text-slate-400">
                  <span className="text-slate-400 group-hover:text-emerald-400 shrink-0">
                    {item.icon}
                  </span>
                  <span className={`font-bold transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'hidden'}`}>
                    {item.name}
                  </span>
                </div>
                {/* Sub items (always visible) */}
                <div className={`${isSidebarOpen ? 'ml-8' : 'hidden'} space-y-0.5`}>
                  {item.subItems.map((sub) => (
                    <Link
                      key={sub.path}
                      to={sub.path}
                      className={`flex items-center gap-2 p-2 rounded-md transition-colors
                        ${location.pathname === sub.path ? 'bg-slate-700 text-white' : 'hover:bg-slate-800 hover:text-white'}`}
                      onClick={() => { if (window.innerWidth < 1024) setIsSidebarOpen(false); }}
                    >
                      <span className="text-sm">{sub.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 p-4 rounded-xl transition-all group
                  ${location.pathname === item.path 
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                    : 'hover:bg-slate-800 hover:text-white'
                  }`}
                onClick={() => { if (window.innerWidth < 1024) setIsSidebarOpen(false); }}
              >
                <span className={`shrink-0 ${location.pathname === item.path ? 'text-white' : 'text-slate-400 group-hover:text-emerald-400'}`}>
                  {item.icon}
                </span>
                <span className={`font-bold transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'hidden'}`}>
                  {item.name}
                </span>
                {location.pathname === item.path && isSidebarOpen && (
                  <ChevronRight size={16} className="ml-auto" />
                )}
              </Link>
            )
          ))}
        </nav>

        <div className="absolute bottom-8 left-0 w-full px-4">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-4 p-4 w-full rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-all text-slate-400 font-bold"
          >
            <LogOut size={20} className="shrink-0" />
            <span className={isSidebarOpen ? 'block' : 'hidden'}>লগআউট</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 flex flex-col w-full">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 p-4 sticky top-0 z-30">
          <div className="flex items-center justify-between gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-2 md:gap-4 ml-auto">
              <div className="text-right hidden xs:block">
                <p className="text-sm font-bold text-slate-900 truncate max-w-[120px] md:max-w-none">অ্যাডমিন ইউজার</p>
                <p className="text-xs text-slate-500">এডমিনিস্ট্রেটর</p>
              </div>
              <div className="w-9 h-9 md:w-10 md:h-10 bg-slate-100 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 font-bold shrink-0">
                A
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 md:p-8 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
