import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Search, ArrowRight, CheckCircle2, TrendingUp, Users, Building2, MapPin, Calendar, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useHomeContent } from '../hooks/useHomeContent';
import heroImg from '../assets/hero_leader.png';

interface DevWork {
  id: string;
  title_bn: string;
  description_bn: string;
  image_path: string;
  work_status: string;
  work_date: string;
  location_text_bn: string;
  upazilas?: { name_bn: string };
  unions?: { name_bn: string };
  wards?: { name_bn: string };
}

const Home = () => {
  const [devWorks, setDevWorks] = useState<DevWork[]>([]);
  const [loadingWorks, setLoadingWorks] = useState(true);
  const [socialCategories, setSocialCategories] = useState<{name_bn: string, icon: string, description_bn: string}[]>([]);
  const [galleryImages, setGalleryImages] = useState<{id: string, title: string, image_path: string, type: string}[]>([]);
  const { get } = useHomeContent();

  useEffect(() => {
    const fetchWorks = async () => {
      const { data } = await supabase.from('development_works')
        .select('*, upazilas(name_bn), unions(name_bn), wards(name_bn)')
        .order('sort_order')
        .limit(6);
      if (data) setDevWorks(data as any);
      setLoadingWorks(false);
    };
    fetchWorks();

    const fetchCategories = async () => {
      const { data } = await supabase.from('social_categories')
        .select('name_bn, icon, description_bn')
        .eq('is_featured_on_home', true)
        .order('sort_order');
      if (data) setSocialCategories(data);
    };
    fetchCategories();

    const fetchGallery = async () => {
      const { data: devData } = await supabase.from('development_works').select('id, title_bn, image_path').not('image_path', 'is', null).not('image_path', 'eq', '').limit(4);
      const { data: socialData } = await supabase.from('social_works').select('id, title_bn, image_path').not('image_path', 'is', null).not('image_path', 'eq', '').limit(4);
      
      let combined: any[] = [];
      if (devData) combined = [...combined, ...devData.map(d => ({ id: d.id, title: d.title_bn, image_path: d.image_path, type: 'development' }))];
      if (socialData) combined = [...combined, ...socialData.map(d => ({ id: d.id, title: d.title_bn, image_path: d.image_path, type: 'social' }))];
      
      combined.sort(() => Math.random() - 0.5);
      setGalleryImages(combined.slice(0, 8));
    };
    fetchGallery();
  }, []);

  const getStatusColor = (s: string) => {
    if (s === 'সম্পন্ন') return 'bg-emerald-500';
    if (s === 'চলমান') return 'bg-blue-500';
    return 'bg-orange-500';
  };

  const getStatusLabel = (s: string) => {
    switch (s) {
      case 'পরিকল্পিত': return 'পরিকল্পনা গ্রহণের তারিখ';
      case 'চলমান': return 'কাজে শুরু';
      case 'সম্পন্ন': return 'সম্পন্ন';
      default: return 'তারিখ';
    }
  };

  // Determine hero image: prefer DB, fallback to local asset
  const heroImageSrc = get('hero_image') || heroImg;
  const aboutImageSrc = get('about_image') || heroImg;

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-600 text-sm font-bold">
                {get('hero_tag', 'উন্নয়ন ও সেবার অঙ্গীকারে')}
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 leading-tight">
                {(() => {
                  const title = get('hero_title', 'ভূরুঙ্গামারীর মানুষের পাশে, উন্নয়ন ও সেবার অঙ্গীকারে');
                  const parts = title.split(',');
                  if (parts.length > 1) {
                    return <>{parts[0]}, <span className="text-emerald-500 block mt-2">{parts.slice(1).join(',').trim()}</span></>;
                  }
                  return title;
                })()}
              </h1>
              <p className="text-lg md:text-xl text-slate-600 max-w-2xl leading-relaxed mx-auto lg:mx-0">
                {get('hero_subtitle', 'আপনার এলাকার সমস্যা জানান এবং অভিযোগের বর্তমান অবস্থা সহজেই দেখুন।')}
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 justify-center lg:justify-start">
                <Link to="/submit-complaint" className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold text-lg flex items-center gap-2 transition-all shadow-lg shadow-emerald-200 w-full sm:w-auto justify-center">
                  <MessageSquare size={20} /> অভিযোগ জমা দিন
                </Link>
                <Link to="/track-complaint" className="border-2 border-emerald-500 text-emerald-500 hover:bg-emerald-50 px-8 py-4 rounded-2xl font-bold text-lg flex items-center gap-2 transition-all w-full sm:w-auto justify-center">
                  <Search size={20} /> আপনার অভিযোগের বর্তমান অবস্থা
                </Link>
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100">
                <img src={heroImageSrc} alt="Mahfuzul Islam Kiron" className="w-full h-auto object-cover aspect-[4/5]" onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&q=80&w=1000"; }} />
              </div>
              <div className="absolute -bottom-6 -left-6 z-20 bg-white p-4 rounded-2xl shadow-xl hidden md:block">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center"><CheckCircle2 size={20} /></div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">{get('stat_resolved_label', 'সমাধানকৃত অভিযোগ')}</p>
                    <p className="text-lg font-bold text-slate-900">{get('stat_resolved_complaints', '১,২৫০+')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Statistics Section */}
      <section className="py-16 bg-emerald-500">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            <div className="space-y-2">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 size={28} />
              </div>
              <p className="text-3xl md:text-4xl font-extrabold">{get('stat_resolved_complaints', '১,২৫০+')}</p>
              <p className="text-sm text-white/80 font-medium">{get('stat_resolved_label', 'সমাধানকৃত অভিযোগ')}</p>
            </div>
            <div className="space-y-2">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Building2 size={28} />
              </div>
              <p className="text-3xl md:text-4xl font-extrabold">{get('stat_total_projects', '৫০+')}</p>
              <p className="text-sm text-white/80 font-medium">{get('stat_projects_label', 'উন্নয়নমূলক প্রকল্প')}</p>
            </div>
            <div className="space-y-2">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Users size={28} />
              </div>
              <p className="text-3xl md:text-4xl font-extrabold">{get('stat_people_served', '১০,০০০+')}</p>
              <p className="text-sm text-white/80 font-medium">{get('stat_people_label', 'সেবা পেয়েছেন')}</p>
            </div>
            <div className="space-y-2">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <TrendingUp size={28} />
              </div>
              <p className="text-3xl md:text-4xl font-extrabold">{get('stat_areas_covered', '২৫+')}</p>
              <p className="text-sm text-white/80 font-medium">{get('stat_areas_label', 'এলাকা কভারেজ')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Leader Intro Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="bg-slate-50 rounded-3xl p-8 md:p-12 border border-slate-100 shadow-sm flex flex-col md:flex-row gap-8 items-center">
            <div className="w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-white shadow-lg shrink-0">
              <img src={aboutImageSrc} alt="Mahfuzul Islam Kiron" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&q=80&w=500"; }} />
            </div>
            <div className="space-y-4 text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-black text-slate-900">
                {get('about_name', 'মাহফুজুল ইসলাম কিরন')}
              </h2>
              <p className="text-emerald-600 font-bold">
                {get('about_designation', 'সমাজসেবক ও জননেতা, কুড়িগ্রাম-১')}
              </p>
              <p className="text-slate-600 leading-relaxed">
                {get('about_description', '"আমার স্বপ্ন একটি আধুনিক, নিরাপদ ও উন্নত কুড়িগ্রাম-১ গড়া। আমি বিশ্বাস করি, সাধারণ মানুষের অংশগ্রহণ এবং সঠিক পরিকল্পনার মাধ্যমেই আমরা এই লক্ষ্য অর্জন করতে পারি। আপনাদের যেকোনো সমস্যা বা পরামর্শ আমাকে জানান, আমি সর্বদা আপনাদের পাশে আছি।"')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Development Works from DB */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 md:px-6 text-center space-y-12">
          <div className="space-y-4 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">উন্নয়নমূলক কাজ</h2>
            <p className="text-slate-600">এলাকার সার্বিক উন্নয়নে গৃহীত ও সম্পন্ন হওয়া গুরুত্বপূর্ণ কাজগুলো</p>
          </div>

          {loadingWorks ? (
            <div className="py-12"><Loader2 className="animate-spin mx-auto text-emerald-500" size={40} /></div>
          ) : devWorks.length === 0 ? (
            <p className="text-slate-400 py-12 font-bold">এখনো কোনো কাজ যোগ করা হয়নি</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {devWorks.map((work) => (
                <div key={work.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-all group text-left flex flex-col">
                  {work.image_path && (
                    <div className="relative h-52 overflow-hidden bg-slate-100 shrink-0">
                      <img src={work.image_path} alt={work.title_bn} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      <div className="absolute top-4 right-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold text-white shadow-md ${getStatusColor(work.work_status)}`}>
                          {work.work_status}
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="p-6 space-y-3 flex-grow flex flex-col">
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-500 transition-colors">{work.title_bn}</h3>
                    {work.description_bn && <p className="text-slate-600 text-sm leading-relaxed line-clamp-2 flex-grow">{work.description_bn}</p>}
                    <div className="flex flex-wrap gap-3 text-xs text-slate-400 pt-4 mt-auto border-t border-slate-50">
                      {(work.upazilas || work.location_text_bn) && (
                        <span className="flex items-center gap-1">
                          <MapPin size={12} className="text-emerald-500" />
                          {work.upazilas ? `${work.upazilas.name_bn}${work.unions ? ', ' + work.unions.name_bn : ''}` : work.location_text_bn}
                        </span>
                      )}
                      {work.work_date && (
                        <span className="flex items-center gap-1">
                          <Calendar size={12} className="text-emerald-500" />
                          {getStatusLabel(work.work_status)}: {new Date(work.work_date).toLocaleDateString('bn-BD')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="pt-8">
            <Link to="/development-works" className="border-2 border-emerald-500 text-emerald-500 hover:bg-emerald-50 px-8 py-3 rounded-xl font-bold inline-flex items-center gap-2 transition-all">
              সকল কাজ দেখুন <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Social Works Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6 text-center space-y-12">
          <div className="space-y-4 max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Users size={32} />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">স্বেচ্ছাসেবী ও সামাজিক কাজ</h2>
            <p className="text-slate-600">সমাজের পিছিয়ে পড়া মানুষের কল্যাণে এবং সামাজিক উন্নয়নে গৃহীত পদক্ষেপসমূহ</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto text-left">
            {socialCategories.map((item, i) => (
              <Link to={`/social-works?category=${encodeURIComponent(item.name_bn)}`} key={i} className="p-8 bg-slate-50 rounded-3xl border border-slate-100 hover:border-blue-100 hover:shadow-lg transition-all group block">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform origin-left">{item.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{item.name_bn}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{item.description_bn}</p>
              </Link>
            ))}
          </div>

          <div className="pt-8">
            <Link to="/social-works" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold inline-flex items-center gap-2 transition-all shadow-lg shadow-blue-200">
              সকল সামাজিক কাজ দেখুন <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Gallery Preview Section */}
      {galleryImages.length > 0 && (
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4 md:px-6 text-center space-y-12">
            <div className="space-y-4 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">গ্যালারি</h2>
              <p className="text-slate-600">আমাদের এলাকার বিভিন্ন উন্নয়নমূলক ও স্বেচ্ছাসেবী কাজের কিছু স্থিরচিত্র</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {galleryImages.map((img, index) => (
                <Link to="/gallery" key={`${img.id}-${index}`} className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all aspect-square bg-slate-100 block">
                  <img 
                    src={img.image_path} 
                    alt={img.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 md:p-6 text-left">
                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-full w-fit mb-2 ${img.type === 'development' ? 'bg-emerald-500 text-white' : 'bg-blue-500 text-white'}`}>
                      {img.type === 'development' ? 'উন্নয়নমূলক কাজ' : 'স্বেচ্ছাসেবী কাজ'}
                    </span>
                    <p className="text-white font-bold text-sm line-clamp-2">{img.title}</p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="pt-8">
              <Link to="/gallery" className="border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white px-8 py-3 rounded-xl font-bold inline-flex items-center gap-2 transition-all">
                সকল ছবি দেখুন <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="bg-emerald-500 rounded-[3rem] p-8 md:p-16 text-center text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
            <div className="relative z-10 space-y-8 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-extrabold leading-tight">
                {get('cta_title', 'আপনার এলাকার কোনো সমস্যা আছে? আমাদের জানান!')}
              </h2>
              <p className="text-lg text-white/90">
                {get('cta_subtitle', 'আমরা প্রতিটি অভিযোগ গুরুত্বের সাথে বিবেচনা করি।')}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/submit-complaint" className="bg-white text-emerald-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-slate-100 transition-all shadow-xl w-full sm:w-auto">অভিযোগ জমা দিন</Link>
                <Link to="/contact" className="border-2 border-white/30 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all w-full sm:w-auto">যোগাযোগ করুন</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
