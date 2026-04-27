import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Edit2, Trash2, Loader2, X, Check, Hammer, MapPin, Upload, Link as LinkIcon } from 'lucide-react';

interface Location { id: string; name_bn: string; }

interface DevWork {
  id: string;
  title_bn: string;
  description_bn: string;
  image_path: string;
  location_text_bn: string;
  work_date: string;
  work_status: string;
  is_featured: boolean;
  sort_order: number;
  upazila_id: string;
  union_id: string;
  ward_id: string;
  gram_moholla: string;
  upazilas?: { name_bn: string };
  unions?: { name_bn: string };
  wards?: { name_bn: string };
}

const emptyForm = {
  title_bn: '', description_bn: '', work_status: 'পরিকল্পিত',
  location_text_bn: '', work_date: '', image_path: '',
  is_featured: false, sort_order: 0,
  upazila_id: '', union_id: '', ward_id: '', gram_moholla: ''
};

const AdminDevelopment = () => {
  const [works, setWorks] = useState<DevWork[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWork, setEditingWork] = useState<DevWork | null>(null);
  const [formData, setFormData] = useState({ ...emptyForm });
  const [imageMode, setImageMode] = useState<'url' | 'upload'>('url');
  const [uploading, setUploading] = useState(false);

  // Location states
  const [upazilas, setUpazilas] = useState<Location[]>([]);
  const [unions, setUnions] = useState<Location[]>([]);
  const [wards, setWards] = useState<Location[]>([]);

  const statusOptions = ['পরিকল্পিত', 'চলমান', 'সম্পন্ন'];

  const getDateLabel = (status: string) => {
    switch (status) {
      case 'পরিকল্পিত': return 'পরিকল্পনা গ্রহণের তারিখ';
      case 'চলমান': return 'কাজে শুরু হওয়ার তারিখ';
      case 'সম্পন্ন': return 'সম্পন্ন হওয়ার তারিখ';
      default: return 'তারিখ';
    }
  };

  const fetchWorks = async () => {
    setLoading(true);
    const { data } = await supabase.from('development_works')
      .select('*, upazilas(name_bn), unions(name_bn), wards(name_bn)')
      .order('sort_order');
    if (data) setWorks(data as any);
    setLoading(false);
  };

  useEffect(() => { fetchWorks(); }, []);

  // Fetch upazilas on mount
  useEffect(() => {
    supabase.from('upazilas').select('id, name_bn').eq('status', 'active').then(({ data }) => { if (data) setUpazilas(data); });
  }, []);

  // Fetch unions when upazila changes
  useEffect(() => {
    if (!formData.upazila_id) { setUnions([]); return; }
    supabase.from('unions').select('id, name_bn').eq('upazila_id', formData.upazila_id).eq('status', 'active').then(({ data }) => { if (data) setUnions(data); });
  }, [formData.upazila_id]);

  // Fetch wards when union changes
  useEffect(() => {
    if (!formData.union_id) { setWards([]); return; }
    supabase.from('wards').select('id, name_bn').eq('union_id', formData.union_id).eq('status', 'active').then(({ data }) => { if (data) setWards(data); });
  }, [formData.union_id]);

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    const ext = file.name.split('.').pop();
    const fileName = `dev_${Date.now()}.${ext}`;
    const { data, error } = await supabase.storage.from('images').upload(fileName, file);
    if (data) {
      const { data: urlData } = supabase.storage.from('images').getPublicUrl(fileName);
      setFormData({ ...formData, image_path: urlData.publicUrl });
    }
    if (error) console.error(error);
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...formData };
    // Remove empty foreign keys
    if (!payload.upazila_id) delete (payload as any).upazila_id;
    if (!payload.union_id) delete (payload as any).union_id;
    if (!payload.ward_id) delete (payload as any).ward_id;

    if (editingWork) {
      await supabase.from('development_works').update(payload).eq('id', editingWork.id);
    } else {
      await supabase.from('development_works').insert([payload]);
    }
    setIsModalOpen(false);
    setEditingWork(null);
    setFormData({ ...emptyForm });
    setSaving(false);
    fetchWorks();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('আপনি কি নিশ্চিত?')) return;
    await supabase.from('development_works').delete().eq('id', id);
    fetchWorks();
  };

  const getStatusColor = (s: string) => {
    if (s === 'সম্পন্ন') return 'bg-emerald-100 text-emerald-700';
    if (s === 'চলমান') return 'bg-blue-100 text-blue-700';
    return 'bg-orange-100 text-orange-700';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">উন্নয়নমূলক কাজ</h1>
          <p className="text-slate-500 font-medium">এলাকার উন্নয়নমূলক কাজের তালিকা ম্যানেজ করুন</p>
        </div>
        <button onClick={() => { setEditingWork(null); setFormData({ ...emptyForm }); setIsModalOpen(true); }} className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-emerald-200 transition-all">
          <Plus size={20} /> নতুন কাজ যোগ করুন
        </button>
      </div>

      {/* Works Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-20 flex flex-col items-center space-y-4">
            <Loader2 className="animate-spin text-emerald-500" size={40} />
          </div>
        ) : works.length === 0 ? (
          <div className="col-span-full py-20 bg-white rounded-3xl border border-dashed border-slate-200 text-center space-y-4">
            <Hammer size={48} className="mx-auto text-slate-200" />
            <p className="text-slate-500 font-bold">কোনো কাজ পাওয়া যায়নি</p>
          </div>
        ) : works.map((w) => (
          <div key={w.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden group">
            {w.image_path && (
              <div className="h-40 overflow-hidden bg-slate-100">
                <img src={w.image_path} alt={w.title_bn} className="w-full h-full object-cover group-hover:scale-105 transition-transform" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              </div>
            )}
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${getStatusColor(w.work_status)}`}>{w.work_status}</span>
                {w.is_featured && <span className="text-[10px] bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full font-bold">ফিচার্ড</span>}
              </div>
              <h3 className="font-bold text-slate-900">{w.title_bn}</h3>
              <p className="text-sm text-slate-500 line-clamp-2">{w.description_bn}</p>
              {(w.upazilas || w.location_text_bn) && (
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <MapPin size={12} />
                  {w.upazilas ? `${w.upazilas.name_bn}${w.unions ? ', ' + w.unions.name_bn : ''}${w.wards ? ', ' + w.wards.name_bn : ''}` : w.location_text_bn}
                </p>
              )}
              <div className="flex items-center justify-end gap-1 pt-2 border-t border-slate-50">
                <button onClick={() => {
                  setEditingWork(w);
                  setFormData({
                    title_bn: w.title_bn, description_bn: w.description_bn || '', work_status: w.work_status,
                    location_text_bn: w.location_text_bn || '', work_date: w.work_date || '', image_path: w.image_path || '',
                    is_featured: w.is_featured, sort_order: w.sort_order,
                    upazila_id: w.upazila_id || '', union_id: w.union_id || '', ward_id: w.ward_id || '', gram_moholla: w.gram_moholla || ''
                  });
                  setIsModalOpen(true);
                }} className="p-2 hover:bg-slate-100 text-slate-400 hover:text-blue-500 rounded-lg transition-all">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => handleDelete(w.id)} className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-all">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10 rounded-t-3xl">
              <h3 className="text-xl font-bold text-slate-900">{editingWork ? 'কাজ পরিবর্তন করুন' : 'নতুন কাজ যোগ করুন'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">কাজের শিরোনাম *</label>
                <input required type="text" placeholder="যেমন: নতুন পাকা রাস্তা নির্মাণ" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-emerald-500" value={formData.title_bn} onChange={(e) => setFormData({...formData, title_bn: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">বিবরণ</label>
                <textarea rows={3} placeholder="কাজের বিস্তারিত বিবরণ" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-emerald-500" value={formData.description_bn} onChange={(e) => setFormData({...formData, description_bn: e.target.value})} />
              </div>

              {/* Status & Dynamic Date */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">অবস্থা *</label>
                  <select className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none bg-white" value={formData.work_status} onChange={(e) => setFormData({...formData, work_status: e.target.value})}>
                    {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">{getDateLabel(formData.work_status)}</label>
                  <input type="date" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none" value={formData.work_date} onChange={(e) => setFormData({...formData, work_date: e.target.value})} />
                </div>
              </div>

              {/* Location Dropdowns */}
              <div className="p-4 bg-slate-50 rounded-2xl space-y-4">
                <h4 className="font-bold text-slate-700 text-sm flex items-center gap-2"><MapPin size={16} className="text-emerald-500" /> লোকেশন</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500">উপজেলা</label>
                    <select className="w-full px-3 py-2.5 rounded-lg border border-slate-200 outline-none bg-white text-sm" value={formData.upazila_id} onChange={(e) => setFormData({...formData, upazila_id: e.target.value, union_id: '', ward_id: ''})}>
                      <option value="">নির্বাচন করুন</option>
                      {upazilas.map(u => <option key={u.id} value={u.id}>{u.name_bn}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500">ইউনিয়ন</label>
                    <select disabled={!formData.upazila_id} className="w-full px-3 py-2.5 rounded-lg border border-slate-200 outline-none bg-white text-sm disabled:bg-slate-100" value={formData.union_id} onChange={(e) => setFormData({...formData, union_id: e.target.value, ward_id: ''})}>
                      <option value="">নির্বাচন করুন</option>
                      {unions.map(u => <option key={u.id} value={u.id}>{u.name_bn}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500">ওয়ার্ড</label>
                    <select disabled={!formData.union_id} className="w-full px-3 py-2.5 rounded-lg border border-slate-200 outline-none bg-white text-sm disabled:bg-slate-100" value={formData.ward_id} onChange={(e) => setFormData({...formData, ward_id: e.target.value})}>
                      <option value="">নির্বাচন করুন</option>
                      {wards.map(u => <option key={u.id} value={u.id}>{u.name_bn}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500">গ্রাম/মহল্লা</label>
                    <input type="text" placeholder="গ্রামের নাম" className="w-full px-3 py-2.5 rounded-lg border border-slate-200 outline-none bg-white text-sm" value={formData.gram_moholla} onChange={(e) => setFormData({...formData, gram_moholla: e.target.value})} />
                  </div>
                </div>
              </div>

              {/* Image Upload / URL */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-700">ছবি</label>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setImageMode('upload')} className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all ${imageMode === 'upload' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    <Upload size={14} /> আপলোড
                  </button>
                  <button type="button" onClick={() => setImageMode('url')} className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all ${imageMode === 'url' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    <LinkIcon size={14} /> URL
                  </button>
                </div>
                {imageMode === 'upload' ? (
                  <div className="relative">
                    <input type="file" accept="image/*" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none text-sm file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-600" onChange={(e) => { if (e.target.files?.[0]) handleImageUpload(e.target.files[0]); }} />
                    {uploading && <Loader2 className="absolute right-4 top-3 animate-spin text-emerald-500" size={20} />}
                  </div>
                ) : (
                  <input type="url" placeholder="https://example.com/image.jpg" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-emerald-500 text-sm" value={formData.image_path} onChange={(e) => setFormData({...formData, image_path: e.target.value})} />
                )}
                {formData.image_path && (
                  <div className="rounded-xl overflow-hidden border border-slate-200 h-32">
                    <img src={formData.image_path} alt="Preview" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = ''; }} />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <input type="checkbox" id="featured" className="w-5 h-5 accent-emerald-500" checked={formData.is_featured} onChange={(e) => setFormData({...formData, is_featured: e.target.checked})} />
                <label htmlFor="featured" className="text-sm font-bold text-slate-700">হোমপেজে ফিচার্ড হিসেবে দেখান</label>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-6 py-3 rounded-xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-all">বাতিল</button>
                <button type="submit" disabled={saving} className="flex-1 px-6 py-3 rounded-xl font-bold text-white bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                  {saving ? <Loader2 className="animate-spin" size={20} /> : <Check size={20} />} সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDevelopment;
