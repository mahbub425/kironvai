import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Edit2, Trash2, Loader2, X, Check, Tag } from 'lucide-react';

interface Category {
  id: string;
  name_bn: string;
  description_bn: string;
  icon: string;
  is_featured_on_home: boolean;
  sort_order: number;
}

const emptyForm = {
  name_bn: '',
  description_bn: '',
  icon: '🤝',
  is_featured_on_home: false,
  sort_order: 0,
};

const AdminSocialCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ ...emptyForm });

  const fetchCategories = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('social_categories')
      .select('*')
      .order('sort_order');
    if (data) setCategories(data as Category[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    if (editingCategory) {
      await supabase.from('social_categories').update(formData).eq('id', editingCategory.id);
    } else {
      await supabase.from('social_categories').insert([formData]);
    }
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData({ ...emptyForm });
    setSaving(false);
    fetchCategories();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('আপনি কি নিশ্চিত?')) return;
    await supabase.from('social_categories').delete().eq('id', id);
    fetchCategories();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">সামাজিক কাজের ধরন</h1>
          <p className="text-slate-500 font-medium">স্বেচ্ছাসেবী ও সামাজিক কাজের ক্যাটাগরি ম্যানেজ করুন</p>
        </div>
        <button 
          onClick={() => { setEditingCategory(null); setFormData({ ...emptyForm }); setIsModalOpen(true); }}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-emerald-200 transition-all"
        >
          <Plus size={20} /> নতুন ধরন যোগ করুন
        </button>
      </div>

      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
        {loading ? (
          <div className="py-12 flex justify-center"><Loader2 className="animate-spin text-emerald-500" size={40} /></div>
        ) : categories.length === 0 ? (
          <div className="py-12 text-center text-slate-500 font-bold">কোনো ধরন পাওয়া যায়নি</div>
        ) : (
          <>
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-sm font-bold text-slate-600">
                    <th className="p-4 rounded-tl-2xl">আইকন</th>
                    <th className="p-4">নাম</th>
                    <th className="p-4">বিবরণ</th>
                    <th className="p-4 text-center">হোমপেজে দেখান?</th>
                    <th className="p-4 text-center">ক্রম</th>
                    <th className="p-4 text-right rounded-tr-2xl">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {categories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 text-2xl">{cat.icon}</td>
                      <td className="p-4 font-bold text-slate-900">{cat.name_bn}</td>
                      <td className="p-4 text-slate-600 text-sm max-w-xs truncate">{cat.description_bn}</td>
                      <td className="p-4 text-center">
                        {cat.is_featured_on_home ? (
                          <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">হ্যাঁ</span>
                        ) : (
                          <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-xs font-bold">না</span>
                        )}
                      </td>
                      <td className="p-4 text-center font-bold text-slate-600">{cat.sort_order}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => { setEditingCategory(cat); setFormData(cat); setIsModalOpen(true); }}
                            className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button 
                            onClick={() => handleDelete(cat.id)}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="lg:hidden grid grid-cols-1 gap-4">
              {categories.map((cat) => (
                <div key={cat.id} className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl bg-white w-12 h-12 rounded-xl flex items-center justify-center shadow-sm shrink-0">
                        {cat.icon}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{cat.name_bn}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-slate-500">ক্রম: {cat.sort_order}</span>
                          <span className="text-slate-300">•</span>
                          {cat.is_featured_on_home ? (
                            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-100 px-2 py-0.5 rounded-md">হোমপেজ</span>
                          ) : (
                            <span className="text-[10px] text-slate-500 font-bold bg-slate-200 px-2 py-0.5 rounded-md">লুকানো</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {cat.description_bn && (
                    <p className="text-sm text-slate-600 bg-white p-3 rounded-xl border border-slate-100">
                      {cat.description_bn}
                    </p>
                  )}

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200/60 mt-1">
                    <button 
                      onClick={() => { setEditingCategory(cat); setFormData(cat); setIsModalOpen(true); }}
                      className="px-4 py-2 text-xs font-bold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      সম্পাদনা
                    </button>
                    <button 
                      onClick={() => handleDelete(cat.id)}
                      className="px-4 py-2 text-xs font-bold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      ডিলিট
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">{editingCategory ? 'ধরন পরিবর্তন করুন' : 'নতুন ধরন যোগ করুন'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">ক্যাটাগরির নাম *</label>
                <input required type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" value={formData.name_bn} onChange={(e) => setFormData({...formData, name_bn: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">আইকন (ইমোজি)</label>
                <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" value={formData.icon} onChange={(e) => setFormData({...formData, icon: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">সংক্ষিপ্ত বিবরণ</label>
                <textarea rows={3} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" value={formData.description_bn} onChange={(e) => setFormData({...formData, description_bn: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">ক্রম (Sort Order)</label>
                  <input type="number" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" value={formData.sort_order} onChange={(e) => setFormData({...formData, sort_order: parseInt(e.target.value) || 0})} />
                </div>
                <div className="flex flex-col justify-center gap-2 pt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-5 h-5 accent-emerald-500" checked={formData.is_featured_on_home} onChange={(e) => setFormData({...formData, is_featured_on_home: e.target.checked})} />
                    <span className="text-sm font-bold text-slate-700">হোমপেজে দেখান</span>
                  </label>
                </div>
              </div>
              
              <button type="submit" disabled={saving} className="w-full mt-4 px-6 py-3 rounded-xl font-bold text-white bg-emerald-500 hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                {saving ? <Loader2 className="animate-spin" size={20} /> : <Check size={20} />} সংরক্ষণ করুন
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSocialCategories;
