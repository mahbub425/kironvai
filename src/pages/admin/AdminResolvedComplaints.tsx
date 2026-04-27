import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  Search, 
  CheckCircle2, 
  MapPin, 
  Phone,
  Calendar,
  Loader2,
  Undo2
} from 'lucide-react';

interface Complaint {
  id: string;
  complaint_id: string;
  name: string;
  phone: string;
  status: string;
  created_at: string;
  updated_at: string;
  gram_moholla: string;
  upazila_id?: string;
  union_id?: string;
  ward_id?: string;
  problem_categories: { name_bn: string };
  upazilas: { name_bn: string };
  unions: { name_bn: string };
  wards: { name_bn: string };
}

const AdminResolvedComplaints = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const [upazilas, setUpazilas] = useState<any[]>([]);
  const [unions, setUnions] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);
  const [filterUpazila, setFilterUpazila] = useState('');
  const [filterUnion, setFilterUnion] = useState('');
  const [filterWard, setFilterWard] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const fetchComplaints = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('complaints')
      .select(`
        *,
        problem_categories(name_bn),
        upazilas(name_bn),
        unions(name_bn),
        wards(name_bn)
      `)
      .eq('status', 'সমস্যার সমাধান করা হয়েছে')
      .order('updated_at', { ascending: false });

    if (data) setComplaints(data as any);
    setLoading(false);
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  // Fetch initial upazilas
  useEffect(() => {
    const fetchUpazilas = async () => {
      const { data } = await supabase.from('upazilas').select('id, name_bn').eq('status', 'active');
      if (data) setUpazilas(data);
    };
    fetchUpazilas();
  }, []);

  // Fetch Unions when Upazila changes
  useEffect(() => {
    const fetchUnions = async () => {
      if (!filterUpazila) {
        setUnions([]);
        return;
      }
      const { data } = await supabase.from('unions').select('id, name_bn').eq('upazila_id', filterUpazila).eq('status', 'active');
      if (data) setUnions(data);
    };
    fetchUnions();
  }, [filterUpazila]);

  // Fetch Wards when Union changes
  useEffect(() => {
    const fetchWards = async () => {
      if (!filterUnion) {
        setWards([]);
        return;
      }
      const { data } = await supabase.from('wards').select('id, name_bn').eq('union_id', filterUnion).eq('status', 'active');
      if (data) setWards(data);
    };
    fetchWards();
  }, [filterUnion]);

  const handleReopen = async (id: string) => {
    if (!window.confirm('আপনি কি নিশ্চিত যে এই অভিযোগটি আবার খুলতে চান?')) return;
    
    setUpdatingId(id);
    const { error } = await supabase
      .from('complaints')
      .update({ 
        status: 'এখনো ভিজিট করা হয়নি',
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (!error) {
      setComplaints(complaints.filter(c => c.id !== id));
    }
    setUpdatingId(null);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterUpazila('');
    setFilterUnion('');
    setFilterWard('');
    setDateFrom('');
    setDateTo('');
  };

  const filteredComplaints = complaints.filter(c => {
    const complaintDate = new Date(c.updated_at || c.created_at).getTime();
    const matchesDateFrom = dateFrom ? complaintDate >= new Date(dateFrom).getTime() : true;
    const matchesDateTo = dateTo ? complaintDate <= new Date(dateTo).setHours(23, 59, 59, 999) : true;

    const matchesUpazila = filterUpazila ? c.upazila_id === filterUpazila : true;
    const matchesUnion = filterUnion ? c.union_id === filterUnion : true;
    const matchesWard = filterWard ? c.ward_id === filterWard : true;

    const term = searchTerm.toLowerCase();
    const matchesSearch = !term || (
      c.complaint_id?.toLowerCase().includes(term) ||
      c.name?.toLowerCase().includes(term) ||
      c.phone?.includes(term) ||
      c.upazilas?.name_bn?.toLowerCase().includes(term) ||
      c.unions?.name_bn?.toLowerCase().includes(term) ||
      c.wards?.name_bn?.toLowerCase().includes(term)
    );

    return matchesDateFrom && matchesDateTo && matchesUpazila && matchesUnion && matchesWard && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">সমাধান হওয়া অভিযোগ</h1>
          <p className="text-slate-500 font-medium">যেসব অভিযোগের সমাধান সম্পন্ন হয়েছে তার তালিকা</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="নাম, মোবাইল, অভিযোগ নম্বর বা এলাকা দিয়ে খুঁজুন..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={clearFilters}
            className="px-6 py-3 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-all whitespace-nowrap flex items-center justify-center gap-2"
          >
            <span className="font-bold">✕</span> ফিল্টার রিসেট
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500">উপজেলা</label>
            <select 
              className="w-full py-2.5 px-3 rounded-xl border border-slate-200 outline-none text-sm text-slate-700"
              value={filterUpazila}
              onChange={(e) => { setFilterUpazila(e.target.value); setFilterUnion(''); setFilterWard(''); }}
            >
              <option value="">সকল উপজেলা</option>
              {upazilas.map(u => <option key={u.id} value={u.id}>{u.name_bn}</option>)}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500">ইউনিয়ন</label>
            <select 
              className="w-full py-2.5 px-3 rounded-xl border border-slate-200 outline-none text-sm text-slate-700 disabled:bg-slate-50"
              value={filterUnion}
              onChange={(e) => { setFilterUnion(e.target.value); setFilterWard(''); }}
              disabled={!filterUpazila}
            >
              <option value="">সকল ইউনিয়ন</option>
              {unions.map(u => <option key={u.id} value={u.id}>{u.name_bn}</option>)}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500">ওয়ার্ড</label>
            <select 
              className="w-full py-2.5 px-3 rounded-xl border border-slate-200 outline-none text-sm text-slate-700 disabled:bg-slate-50"
              value={filterWard}
              onChange={(e) => setFilterWard(e.target.value)}
              disabled={!filterUnion}
            >
              <option value="">সকল ওয়ার্ড</option>
              {wards.map(u => <option key={u.id} value={u.id}>{u.name_bn}</option>)}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500">শুরুর তারিখ</label>
            <input 
              type="date"
              className="w-full py-2 px-3 rounded-xl border border-slate-200 outline-none text-sm text-slate-700"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500">শেষ তারিখ</label>
            <input 
              type="date"
              className="w-full py-2 px-3 rounded-xl border border-slate-200 outline-none text-sm text-slate-700"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Table / Mobile Cards */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">অভিযোগ নম্বর</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">নাম</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">মোবাইল নম্বর</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">এলাকা</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">সমস্যার ধরন</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">সমাধানের তারিখ</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-20 text-center">
                    <Loader2 className="animate-spin mx-auto text-emerald-500" size={40} />
                    <p className="mt-4 text-slate-500 font-bold">লোড হচ্ছে...</p>
                  </td>
                </tr>
              ) : filteredComplaints.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-20 text-center">
                    <div className="w-16 h-16 bg-emerald-50 text-emerald-300 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 size={32} />
                    </div>
                    <p className="text-slate-500 font-bold">কোনো সমাধান হওয়া অভিযোগ পাওয়া যায়নি</p>
                  </td>
                </tr>
              ) : (
                filteredComplaints.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 text-sm">
                      <span className="text-emerald-600 font-black tracking-tight">{c.complaint_id}</span>
                    </td>
                    <td className="p-4 text-sm font-bold text-slate-900">{c.name}</td>
                    <td className="p-4 text-sm text-slate-600">{c.phone}</td>
                    <td className="p-4 text-sm text-slate-600">
                      {[c.upazilas?.name_bn, c.unions?.name_bn, c.wards?.name_bn, c.gram_moholla].filter(Boolean).join(', ')}
                    </td>
                    <td className="p-4 text-sm text-slate-600">
                      <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-600">
                        {c.problem_categories?.name_bn || '-'}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-slate-500 font-bold">
                      {new Date(c.updated_at || c.created_at).toLocaleDateString('bn-BD', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="p-4">
                      <button 
                        onClick={() => handleReopen(c.id)}
                        disabled={updatingId === c.id}
                        className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-lg text-xs font-bold transition-all disabled:opacity-50"
                      >
                        {updatingId === c.id ? <Loader2 size={14} className="animate-spin" /> : <Undo2 size={14} />}
                        Reopen
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards View */}
        <div className="lg:hidden divide-y divide-slate-100">
          {loading ? (
            <div className="p-12 text-center">
              <Loader2 className="animate-spin mx-auto text-emerald-500" size={32} />
            </div>
          ) : filteredComplaints.length === 0 ? (
            <div className="p-12 text-center">
              <CheckCircle2 size={32} className="mx-auto text-emerald-300 mb-2" />
              <p className="text-slate-500 font-bold">কোনো সমাধান হওয়া অভিযোগ পাওয়া যায়নি</p>
            </div>
          ) : (
            filteredComplaints.map((c) => (
              <div key={c.id} className="p-4 space-y-4 hover:bg-slate-50 active:bg-slate-100 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="text-emerald-600 font-black text-xs tracking-tight">{c.complaint_id}</span>
                    <h4 className="font-bold text-slate-900">{c.name}</h4>
                  </div>
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black tracking-wider shadow-sm">
                    সমাধান হয়েছে
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Phone size={14} className="text-slate-400" /> {c.phone}
                  </div>
                  <div className="flex items-center gap-2 text-slate-500">
                    <Calendar size={14} className="text-slate-400" /> {new Date(c.updated_at || c.created_at).toLocaleDateString('bn-BD')}
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 col-span-2">
                    <MapPin size={14} className="text-slate-400 shrink-0" /> 
                    <span className="truncate">{[c.upazilas?.name_bn, c.unions?.name_bn].filter(Boolean).join(', ')}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                  <span className="px-2 py-1 bg-slate-100 rounded-md text-[10px] font-bold text-slate-600">
                    {c.problem_categories?.name_bn || '-'}
                  </span>
                  <button 
                    onClick={() => handleReopen(c.id)}
                    disabled={updatingId === c.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-lg text-xs font-bold transition-all disabled:opacity-50"
                  >
                    {updatingId === c.id ? <Loader2 size={12} className="animate-spin" /> : <Undo2 size={12} />}
                    Reopen
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminResolvedComplaints;
