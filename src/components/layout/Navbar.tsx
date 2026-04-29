import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, MessageSquare, Search, Home, Hammer, Users, Image as ImageIcon, Phone } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'হোম', path: '/', icon: <Home size={18} /> },
    { name: 'অভিযোগ জমা দিন', path: '/submit-complaint', icon: <MessageSquare size={18} /> },
    { name: 'অবস্থা দেখুন', path: '/track-complaint', icon: <Search size={18} /> },
    { name: 'উন্নয়নমূলক কাজ', path: '/development-works', icon: <Hammer size={18} /> },
    { name: 'স্বেচ্ছাসেবী কাজ', path: '/social-works', icon: <Users size={18} /> },
    { name: 'গ্যালারি', path: '/gallery', icon: <ImageIcon size={18} /> },
    { name: 'যোগাযোগ', path: '/contact', icon: <Phone size={18} /> },
  ];

  return (
    <>
      <nav className={`fixed w-full z-40 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-md py-2' : 'bg-white/90 backdrop-blur-md py-3 md:py-4 border-b border-slate-100/50'}`}>
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                <span className="font-bold text-xl">K1</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-tight text-slate-900">কুড়িগ্রাম-১</span>
                <span className="text-[10px] md:text-xs font-bold text-slate-500 tracking-wide uppercase">জনসেবা প্ল্যাটফর্ম</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 flex items-center gap-2
                    ${location.pathname === link.path 
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200' 
                      : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-600'
                    }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden p-2.5 rounded-xl bg-slate-900 text-white shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-95"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Nav Overlay */}
      <div className={`lg:hidden fixed inset-0 bg-slate-900 z-50 transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full p-6">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                <span className="font-bold text-xl">K1</span>
              </div>
              <span className="font-bold text-xl text-white">কুড়িগ্রাম-১</span>
            </div>
            <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all" onClick={() => setIsOpen(false)}>
              <X size={28} />
            </button>
          </div>
          
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-4 p-4 rounded-xl text-lg font-bold transition-all
                  ${location.pathname === link.path 
                    ? 'bg-emerald-500/10 text-emerald-400 border-l-4 border-emerald-500' 
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                onClick={() => setIsOpen(false)}
              >
                <span className={location.pathname === link.path ? 'text-emerald-400' : 'text-slate-400'}>
                  {link.icon}
                </span>
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
