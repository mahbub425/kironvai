import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Image as ImageIcon, Loader2 } from 'lucide-react';

interface GalleryItem {
  id: string;
  title: string;
  image_path: string;
  type: 'development' | 'social';
}

const Gallery = () => {
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      
      // Fetch from development works
      const { data: devData } = await supabase
        .from('development_works')
        .select('id, title_bn, image_path')
        .not('image_path', 'is', null)
        .not('image_path', 'eq', '');

      // Fetch from social works
      const { data: socialData } = await supabase
        .from('social_works')
        .select('id, title_bn, image_path')
        .not('image_path', 'is', null)
        .not('image_path', 'eq', '');

      let combined: GalleryItem[] = [];
      
      if (devData) {
        combined = [...combined, ...devData.map(d => ({ id: d.id, title: d.title_bn, image_path: d.image_path, type: 'development' as const }))];
      }
      if (socialData) {
        combined = [...combined, ...socialData.map(d => ({ id: d.id, title: d.title_bn, image_path: d.image_path, type: 'social' as const }))];
      }

      // Shuffle or sort
      combined.sort(() => Math.random() - 0.5);

      setImages(combined);
      setLoading(false);
    };

    fetchImages();
  }, []);

  const filteredImages = filter === 'all' ? images : images.filter(img => img.type === filter);

  return (
    <div className="pt-24 pb-20 min-h-screen bg-slate-50">
      <div className="bg-purple-600 text-white py-16 mb-12">
        <div className="container mx-auto px-4 text-center space-y-4">
          <h1 className="text-3xl md:text-5xl font-black">গ্যালারি</h1>
          <p className="text-purple-100 max-w-2xl mx-auto text-lg">
            আমাদের এলাকার বিভিন্ন উন্নয়নমূলক ও স্বেচ্ছাসেবী কাজের স্থিরচিত্র
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex justify-start sm:justify-center mb-10 overflow-x-auto pb-4">
          <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100 flex flex-nowrap sm:flex-wrap gap-1 min-w-max">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${filter === 'all' ? 'bg-purple-500 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              সকল ছবি
            </button>
            <button
              onClick={() => setFilter('development')}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${filter === 'development' ? 'bg-purple-500 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              উন্নয়নমূলক কাজ
            </button>
            <button
              onClick={() => setFilter('social')}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${filter === 'social' ? 'bg-purple-500 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              স্বেচ্ছাসেবী কাজ
            </button>
          </div>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center">
            <Loader2 className="animate-spin text-purple-500" size={48} />
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
            <ImageIcon size={64} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-500 font-bold text-lg">কোনো ছবি পাওয়া যায়নি</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredImages.map((img, index) => (
              <div key={`${img.id}-${index}`} className="group relative rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all aspect-square bg-slate-100">
                <img 
                  src={img.image_path} 
                  alt={img.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-full w-fit mb-2 ${img.type === 'development' ? 'bg-emerald-500 text-white' : 'bg-blue-500 text-white'}`}>
                    {img.type === 'development' ? 'উন্নয়নমূলক কাজ' : 'স্বেচ্ছাসেবী কাজ'}
                  </span>
                  <p className="text-white font-bold text-sm line-clamp-2">{img.title}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
