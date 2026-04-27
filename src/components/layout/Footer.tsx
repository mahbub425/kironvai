import { Link } from 'react-router-dom';
import { Facebook, Twitter, Youtube, Mail, Phone, MapPin, Instagram, Linkedin } from 'lucide-react';
import { useHomeContent } from '../../hooks/useHomeContent';

const Footer = () => {
  const { get } = useHomeContent();

  const socialLinks = [
    { key: 'social_facebook', icon: <Facebook size={20} />, label: 'Facebook' },
    { key: 'social_twitter', icon: <Twitter size={20} />, label: 'Twitter' },
    { key: 'social_youtube', icon: <Youtube size={20} />, label: 'YouTube' },
    { key: 'social_instagram', icon: <Instagram size={20} />, label: 'Instagram' },
    { key: 'social_linkedin', icon: <Linkedin size={20} />, label: 'LinkedIn' },
  ];

  // Filter only social links that have a URL set
  const activeSocialLinks = socialLinks.filter(s => get(s.key));

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* About Section */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                <span className="font-bold text-xl">K1</span>
              </div>
              <span className="font-bold text-xl text-white">কুড়িগ্রাম-১</span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400">
              {get('footer_description', 'ভূরুঙ্গামারী ও নাগেশ্বরীর মানুষের সমস্যা সংগ্রহ, অভিযোগ ট্র্যাকিং এবং উন্নয়নমূলক কাজ প্রদর্শনের একটি ডিজিটাল প্ল্যাটফর্ম।')}
            </p>
            <div className="flex space-x-4">
              {activeSocialLinks.length > 0 ? (
                activeSocialLinks.map((social) => (
                  <a
                    key={social.key}
                    href={get(social.key)}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={social.label}
                    className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-emerald-500 transition-colors duration-300"
                  >
                    {social.icon}
                  </a>
                ))
              ) : (
                // Fallback: show placeholder icons
                <>
                  <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-emerald-500 transition-colors duration-300">
                    <Facebook size={20} />
                  </a>
                  <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-emerald-500 transition-colors duration-300">
                    <Twitter size={20} />
                  </a>
                  <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-emerald-500 transition-colors duration-300">
                    <Youtube size={20} />
                  </a>
                </>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 border-l-4 border-emerald-500 pl-3">প্রয়োজনীয় লিংক</h3>
            <ul className="space-y-4 text-sm">
              <li><Link to="/about" className="hover:text-emerald-500 transition-colors">কিরণ ভাই সম্পর্কে</Link></li>
              <li><Link to="/development-works" className="hover:text-emerald-500 transition-colors">উন্নয়নমূলক কাজ</Link></li>
              <li><Link to="/social-works" className="hover:text-emerald-500 transition-colors">স্বেচ্ছাসেবী কাজ</Link></li>
              <li><Link to="/gallery" className="hover:text-emerald-500 transition-colors">গ্যালারি</Link></li>
            </ul>
          </div>

          {/* Citizen Services */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 border-l-4 border-emerald-500 pl-3">নাগরিক সেবা</h3>
            <ul className="space-y-4 text-sm">
              <li><Link to="/submit-complaint" className="text-emerald-500 font-semibold">অভিযোগ জমা দিন</Link></li>
              <li><Link to="/track-complaint" className="hover:text-emerald-500 transition-colors">অভিযোগের অবস্থা দেখুন</Link></li>
              <li><Link to="/contact" className="hover:text-emerald-500 transition-colors">সরাসরি যোগাযোগ</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 border-l-4 border-emerald-500 pl-3">যোগাযোগ</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-emerald-500 shrink-0" />
                <span>{get('footer_address', 'কুড়িগ্রাম রোড, ভূরুঙ্গামারী পৌরসভা, কুড়িগ্রাম।')}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-emerald-500 shrink-0" />
                <span>{get('footer_phone', '+৮৮০১XXXXXXXXX')}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-emerald-500 shrink-0" />
                <span>{get('footer_email', 'contact@kironvai.com')}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
          <p>{get('footer_copyright', '© ২০২৬ কুড়িগ্রাম-১ জনসেবা প্ল্যাটফর্ম। সর্বস্বত্ব সংরক্ষিত।')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
