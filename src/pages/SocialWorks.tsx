import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Users, MapPin, Calendar, Loader2 } from 'lucide-react';

interface SocialWork {
  id: string;
  title_bn: string;
  description_bn: string;
  image_path: string;
  work_type: string;
  work_date: string;
  location_text_bn: string;
  upazilas?: { name_bn: string };
  unions?: { name_bn: string };
  wards?: { name_bn: string };
}

const SocialWorks = () => {
  const [searchParams] = useSearchParams();
  const [works, setWorks] = useState<SocialWork[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(searchParams.get('category') || 'all');
  const [workTypeOptions, setWorkTypeOptions] = useState<string[]>(['all']);

  useEffect(() => {
    supabase.from('social_categories').select('name_bn').order('sort_order').then(({ data }) => {
      if (data) {
        setWorkTypeOptions(['all', ...data.map(d => d.name_bn)]);
      }
    });
  }, []);

  useEffect(() => {
    const fetchWorks = async () => {
      setLoading(true);
      let query = supabase
        .from('social_works')
        .select('*, upazilas(name_bn), unions(name_bn), wards(name_bn)')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('work_type', filter);
      }

      const { data } = await query;
      if (data) setWorks(data as any);
      setLoading(false);
    };

    fetchWorks();
  }, [filter]);

  return (
    <div className="pt-24 pb-20 min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-blue-600 text-white py-16 mb-12">
        <div className="container mx-auto px-4 text-center space-y-4">
          <h1 className="text-3xl md:text-5xl font-black">স্বেচ্ছাসেবী কাজ</h1>
          <p className="text-blue-100 max-w-2xl mx-auto text-lg">
            সমাজের পিছিয়ে পড়া মানুষের কল্যাণে এবং সামাজিক উন্নয়নে গৃহীত পদক্ষেপসমূহ
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Filters */}
        <div className="flex justify-center mb-10 overflow-x-auto pb-4">
          <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100 flex flex-nowrap md:flex-wrap gap-1 min-w-max">
            {workTypeOptions.map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                  filter === type
                    ? 'bg-blue-500 text-white shadow-md shadow-blue-200'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {type === 'all' ? 'সকল কাজ' : type}
              </button>
            ))}
          </div>
        </div>

        {/* Works Grid */}
        {loading ? (
          <div className="py-20 flex flex-col items-center">
            <Loader2 className="animate-spin text-blue-500" size={48} />
            <p className="mt-4 text-slate-500 font-bold">লোড হচ্ছে...</p>
          </div>
        ) : works.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
            <Users size={64} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-500 font-bold text-lg">কোনো কাজ পাওয়া যায়নি</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {works.map((work) => (
              <div key={work.id} className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-all group flex flex-col">
                {work.image_path && (
                  <div className="relative h-60 overflow-hidden bg-slate-100 shrink-0">
                    <img 
                      src={work.image_path} 
                      alt={work.title_bn} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} 
                    />
                    <div className="absolute top-4 right-4">
                      <span className="px-4 py-1.5 rounded-full text-xs font-black text-blue-700 bg-blue-100 shadow-lg">
                        {work.work_type}
                      </span>
                    </div>
                  </div>
                )}
                <div className="p-8 flex flex-col flex-grow">
                  {!work.image_path && (
                    <div className="mb-4">
                      <span className="px-4 py-1.5 rounded-full text-xs font-black text-blue-700 bg-blue-100 shadow-sm inline-block">
                        {work.work_type}
                      </span>
                    </div>
                  )}
                  <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-blue-600 transition-colors">
                    {work.title_bn}
                  </h3>
                  {work.description_bn && (
                    <p className="text-slate-600 mb-6 line-clamp-3 flex-grow">
                      {work.description_bn}
                    </p>
                  )}
                  
                  <div className="space-y-3 pt-6 border-t border-slate-100 mt-auto">
                    {(work.upazilas || work.location_text_bn) && (
                      <div className="flex items-start gap-3 text-slate-500">
                        <MapPin size={18} className="text-blue-500 shrink-0 mt-0.5" />
                        <span className="text-sm font-medium">
                          {work.upazilas ? `${work.upazilas.name_bn}${work.unions ? ', ' + work.unions.name_bn : ''}${work.wards ? ', ' + work.wards.name_bn : ''}` : work.location_text_bn}
                        </span>
                      </div>
                    )}
                    {work.work_date && (
                      <div className="flex items-center gap-3 text-slate-500">
                        <Calendar size={18} className="text-blue-500 shrink-0" />
                        <span className="text-sm font-medium">
                          তারিখ: <span className="text-slate-900 font-bold">{new Date(work.work_date).toLocaleDateString('bn-BD')}</span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialWorks;
