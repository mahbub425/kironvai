import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  Plus, 
  List, 
  Edit2, 
  Trash2, 
  Loader2, 
  X,
  Check,
  Hash
} from 'lucide-react';

interface Category {
  id: string;
  name_bn: string;
  sort_order: number;
  status: string;
}

const AdminCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name_bn: '',
    sort_order: 0,
    status: 'active'
  });

  const fetchCategories = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('problem_categories')
      .select('*')
      .order('sort_order', { ascending: true });
    
    if (data) setCategories(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (editingCategory) {
      await supabase
        .from('problem_categories')
        .update(formData)
        .eq('id', editingCategory.id);
    } else {
      await supabase
        .from('problem_categories')
        .insert([formData]);
    }

    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData({ name_bn: '', sort_order: 0, status: 'active' });
    fetchCategories();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('আপনি কি নিশ্চিত যে এই ক্যাটাগরি টি ডিলিট করতে চান?')) return;
    await supabase.from('problem_categories').delete().eq('id', id);
    fetchCategories();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">সমস্যার ধরন (Categories)</h1>
          <p className="text-slate-500 font-medium">অভিযোগের বিভিন্ন ধরন ও ক্যাটাগরি ম্যানেজ করুন</p>
        </div>
        <button 
          onClick={() => { setEditingCategory(null); setFormData({ name_bn: '', sort_order: categories.length + 1, status: 'active' }); setIsModalOpen(true); }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          নতুন ক্যাটাগরি
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-20 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="animate-spin text-emerald-500" size={40} />
            <p className="text-slate-500 font-bold">লোড হচ্ছে...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="col-span-full py-20 bg-white rounded-3xl border border-dashed border-slate-200 text-center space-y-4">
            <List size={48} className="mx-auto text-slate-200" />
            <p className="text-slate-500 font-bold">কোনো ক্যাটাগরি পাওয়া যায়নি</p>
          </div>
        ) : (
          categories.map((category) => (
            <div key={category.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center font-black text-xs">
                  #{category.sort_order}
                </div>
                <div>
                  <span className="font-bold text-slate-800 block">{category.name_bn}</span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${category.status === 'active' ? 'text-emerald-500' : 'text-slate-400'}`}>
                    {category.status === 'active' ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => { setEditingCategory(category); setFormData({ name_bn: category.name_bn, sort_order: category.sort_order, status: category.status }); setIsModalOpen(true); }}
                  className="p-2 hover:bg-slate-100 text-slate-400 hover:text-blue-500 rounded-lg transition-all"
                >
                  <Edit2 size={16} />
                </button>
                <button 
                  onClick={() => handleDelete(category.id)}
                  className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">
                {editingCategory ? 'ক্যাটাগরি পরিবর্তন করুন' : 'নতুন ক্যাটাগরি যোগ করুন'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">ক্যাটাগরি নাম (বাংলায়)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <List size={18} />
                  </span>
                  <input 
                    required
                    type="text" 
                    placeholder="যেমন: রাস্তা সমস্যা"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-emerald-500"
                    value={formData.name_bn}
                    onChange={(e) => setFormData({...formData, name_bn: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">ক্রমিক নম্বর (Sort Order)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Hash size={18} />
                  </span>
                  <input 
                    required
                    type="number" 
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-emerald-500"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({...formData, sort_order: parseInt(e.target.value)})}
                  />
                </div>
                <p className="text-[10px] text-slate-400 font-medium ml-1">যেকোনো ক্রমে সাজানোর জন্য নম্বর ব্যবহার করুন</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">অবস্থা (Status)</label>
                <select 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-emerald-500 bg-white"
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  <option value="active">সক্রিয় (Active)</option>
                  <option value="inactive">নিষ্ক্রিয় (Inactive)</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-6 py-3 rounded-xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-all"
                >
                  বাতিল
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="flex-1 px-6 py-3 rounded-xl font-bold text-white bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : <Check size={20} />}
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
