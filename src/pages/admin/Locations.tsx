import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  Plus, 
  MapPin, 
  Building2, 
  Flag, 
  Edit2, 
  Trash2, 
  Loader2, 
  X,
  Check
} from 'lucide-react';

interface LocationItem {
  id: string;
  name_bn: string;
  upazila_id?: string;
  union_id?: string;
}

const AdminLocations = () => {
  const [activeTab, setActiveTab] = useState<'upazila' | 'union' | 'ward'>('upazila');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<LocationItem[]>([]);
  const [upazilas, setUpazilas] = useState<LocationItem[]>([]);
  const [unions, setUnions] = useState<LocationItem[]>([]);

  // Form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<LocationItem | null>(null);
  const [formData, setFormData] = useState({
    name_bn: '',
    upazila_id: '',
    union_id: '',
  });

  // Filters for selection
  const [selectedUpazila, setSelectedUpazila] = useState('');
  const [selectedUnion, setSelectedUnion] = useState('');

  const fetchData = async () => {
    setLoading(true);
    let table = activeTab === 'upazila' ? 'upazilas' : activeTab === 'union' ? 'unions' : 'wards';
    
    let query = supabase.from(table).select('*').order('name_bn');

    if (activeTab === 'union' && selectedUpazila) {
      query = query.eq('upazila_id', selectedUpazila);
    } else if (activeTab === 'ward') {
      if (selectedUpazila) query = query.eq('upazila_id', selectedUpazila);
      if (selectedUnion) query = query.eq('union_id', selectedUnion);
    }

    const { data: result } = await query;
    if (result) setData(result);

    // Fetch dependencies for dropdowns
    const { data: upz } = await supabase.from('upazilas').select('*').order('name_bn');
    if (upz) setUpazilas(upz);

    if (formData.upazila_id || selectedUpazila) {
      const { data: un } = await supabase.from('unions')
        .select('*')
        .eq('upazila_id', formData.upazila_id || selectedUpazila)
        .order('name_bn');
      if (un) setUnions(un);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [activeTab, selectedUpazila, selectedUnion]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    let table = activeTab === 'upazila' ? 'upazilas' : activeTab === 'union' ? 'unions' : 'wards';
    
    const payload: any = { name_bn: formData.name_bn };
    if (activeTab === 'union') payload.upazila_id = formData.upazila_id;
    if (activeTab === 'ward') {
      payload.upazila_id = formData.upazila_id;
      payload.union_id = formData.union_id;
    }

    if (editingItem) {
      await supabase.from(table).update(payload).eq('id', editingItem.id);
    } else {
      await supabase.from(table).insert([payload]);
    }

    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({ name_bn: '', upazila_id: '', union_id: '' });
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('আপনি কি নিশ্চিত যে এটি ডিলিট করতে চান?')) return;
    
    let table = activeTab === 'upazila' ? 'upazilas' : activeTab === 'union' ? 'unions' : 'wards';
    await supabase.from(table).delete().eq('id', id);
    fetchData();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">লোকেশন ম্যানেজমেন্ট</h1>
          <p className="text-slate-500 font-medium">উপজেলা, ইউনিয়ন এবং ওয়ার্ড সেটআপ করুন</p>
        </div>
        <button 
          onClick={() => { setEditingItem(null); setFormData({ name_bn: '', upazila_id: '', union_id: '' }); setIsModalOpen(true); }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          নতুন যোগ করুন
        </button>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-slate-200 rounded-2xl w-fit">
        <button 
          onClick={() => setActiveTab('upazila')}
          className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'upazila' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          উপজেলা
        </button>
        <button 
          onClick={() => setActiveTab('union')}
          className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'union' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          ইউনিয়ন
        </button>
        <button 
          onClick={() => setActiveTab('ward')}
          className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'ward' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          ওয়ার্ড
        </button>
      </div>

      {/* Filters Area */}
      {(activeTab === 'union' || activeTab === 'ward') && (
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400">ফিল্টার:</span>
            <select 
              className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none"
              value={selectedUpazila}
              onChange={(e) => { setSelectedUpazila(e.target.value); setSelectedUnion(''); }}
            >
              <option value="">সকল উপজেলা</option>
              {upazilas.map(u => <option key={u.id} value={u.id}>{u.name_bn}</option>)}
            </select>
          </div>
          {activeTab === 'ward' && (
            <select 
              className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none"
              value={selectedUnion}
              onChange={(e) => setSelectedUnion(e.target.value)}
              disabled={!selectedUpazila}
            >
              <option value="">সকল ইউনিয়ন</option>
              {unions.map(u => <option key={u.id} value={u.id}>{u.name_bn}</option>)}
            </select>
          )}
        </div>
      )}

      {/* Data Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-20 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="animate-spin text-emerald-500" size={40} />
            <p className="text-slate-500 font-bold">লোড হচ্ছে...</p>
          </div>
        ) : data.length === 0 ? (
          <div className="col-span-full py-20 bg-white rounded-3xl border border-dashed border-slate-200 text-center space-y-4">
            <MapPin size={48} className="mx-auto text-slate-200" />
            <p className="text-slate-500 font-bold">কোনো তথ্য পাওয়া যায়নি</p>
          </div>
        ) : (
          data.map((item) => (
            <div key={item.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${activeTab === 'upazila' ? 'bg-blue-50 text-blue-500' : activeTab === 'union' ? 'bg-emerald-50 text-emerald-500' : 'bg-purple-50 text-purple-500'}`}>
                  {activeTab === 'upazila' ? <Building2 size={20} /> : activeTab === 'union' ? <MapPin size={20} /> : <Flag size={20} />}
                </div>
                <span className="font-bold text-slate-800">{item.name_bn}</span>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => { 
                    setEditingItem(item); 
                    setFormData({ name_bn: item.name_bn, upazila_id: item.upazila_id || '', union_id: item.union_id || '' }); 
                    setIsModalOpen(true); 
                  }}
                  className="p-2 hover:bg-slate-100 text-slate-400 hover:text-blue-500 rounded-lg transition-all"
                >
                  <Edit2 size={16} />
                </button>
                <button 
                  onClick={() => handleDelete(item.id)}
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
                {editingItem ? 'তথ্য পরিবর্তন করুন' : 'নতুন যোগ করুন'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {activeTab !== 'upazila' && (
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">উপজেলা নির্বাচন করুন</label>
                  <select 
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-emerald-500"
                    value={formData.upazila_id}
                    onChange={(e) => setFormData({...formData, upazila_id: e.target.value, union_id: ''})}
                  >
                    <option value="">নির্বাচন করুন</option>
                    {upazilas.map(u => <option key={u.id} value={u.id}>{u.name_bn}</option>)}
                  </select>
                </div>
              )}

              {activeTab === 'ward' && (
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">ইউনিয়ন নির্বাচন করুন</label>
                  <select 
                    required
                    disabled={!formData.upazila_id}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-emerald-500 disabled:bg-slate-50"
                    value={formData.union_id}
                    onChange={(e) => setFormData({...formData, union_id: e.target.value})}
                  >
                    <option value="">নির্বাচন করুন</option>
                    {unions.map(u => <option key={u.id} value={u.id}>{u.name_bn}</option>)}
                  </select>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">নাম (বাংলায়)</label>
                <input 
                  required
                  type="text" 
                  placeholder="নাম লিখুন"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-emerald-500"
                  value={formData.name_bn}
                  onChange={(e) => setFormData({...formData, name_bn: e.target.value})}
                />
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

export default AdminLocations;
