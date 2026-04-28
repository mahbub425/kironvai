import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Search, MapPin, Calendar, AlertCircle, Loader2 } from 'lucide-react';

interface Location {
  id: string;
  name_bn: string;
}

interface Complaint {
  id: string;
  complaint_id: string;
  problem_details: string;
  status: string;
  created_at: string;
  updated_at?: string;
  problem_categories: { name_bn: string };
  upazilas: { name_bn: string };
  unions: { name_bn: string };
  wards: { name_bn: string };
}

const TrackComplaint = () => {
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [error, setError] = useState('');

  // Search States
  const [searchData, setSearchData] = useState<{
    phone: string;
    upazila_id: string;
    union_id: string;
    ward_id: string;
  }>({
    phone: '',
    upazila_id: '',
    union_id: '',
    ward_id: '',
  });

  const toEnglishNumber = (str: string) => {
    const bengaliToEnglish: Record<string, string> = {
      '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
      '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
    };
    return str.replace(/[০-৯]/g, match => bengaliToEnglish[match]);
  };

  // Location States
  const [upazilas, setUpazilas] = useState<Location[]>([]);
  const [unions, setUnions] = useState<Location[]>([]);
  const [wards, setWards] = useState<Location[]>([]);

  useEffect(() => {
    const fetchUpazilas = async () => {
      const { data } = await supabase.from('upazilas').select('id, name_bn').eq('status', 'active');
      if (data) setUpazilas(data);
    };
    fetchUpazilas();
  }, []);

  useEffect(() => {
    const fetchUnions = async () => {
      if (!searchData.upazila_id) {
        setUnions([]);
        return;
      }
      const { data } = await supabase.from('unions').select('id, name_bn').eq('upazila_id', searchData.upazila_id).eq('status', 'active');
      if (data) setUnions(data);
    };
    fetchUnions();
  }, [searchData.upazila_id]);

  useEffect(() => {
    const fetchWards = async () => {
      if (!searchData.union_id) {
        setWards([]);
        return;
      }
      const { data } = await supabase.from('wards').select('id, name_bn').eq('union_id', searchData.union_id).eq('status', 'active');
      if (data) setWards(data);
    };
    fetchWards();
  }, [searchData.union_id]);

  useEffect(() => {
    const complaintIds = complaints.map((complaint) => complaint.id).filter(Boolean);
    if (complaintIds.length === 0) return;

    const channel = supabase
      .channel(`public-complaint-tracking-${complaintIds.join('-')}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'complaints' },
        (payload) => {
          const updatedComplaint = payload.new as Partial<Complaint>;
          if (!updatedComplaint.id || !complaintIds.includes(updatedComplaint.id)) return;

          setComplaints((currentComplaints) =>
            currentComplaints.map((complaint) =>
              complaint.id === updatedComplaint.id
                ? {
                    ...complaint,
                    status: updatedComplaint.status || complaint.status,
                    updated_at: updatedComplaint.updated_at || complaint.updated_at,
                  }
                : complaint
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [complaints]);

    const handleSearch = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError('');
      setSearched(true);
 
      // Convert phone to English digits for query
      const convertedPhone = toEnglishNumber(searchData.phone);
 
      // Validate phone format (Bangladeshi numbers)
      const phoneRegex = /^01[3-9]\d{8}$/;
      if (!phoneRegex.test(convertedPhone)) {
        setError('অনুগ্রহ করে একটি সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: ০১৭XXXXXXXX)');
        setLoading(false);
        return;
      }
 
      try {
        const { data, error: searchError } = await supabase
          .from('complaints')
          .select(`
            id,
            complaint_id,
            problem_details,
            status,
            created_at,
            updated_at,
            problem_categories(name_bn),
            upazilas(name_bn),
            unions(name_bn),
            wards(name_bn)
          `)
          .eq('phone', convertedPhone)
          .eq('upazila_id', searchData.upazila_id)
          .eq('union_id', searchData.union_id)
          .eq('ward_id', searchData.ward_id)
          .order('updated_at', { ascending: false })
            .order('created_at', { ascending: false });
 
        if (searchError) throw searchError;
        setComplaints((data || []) as unknown as Complaint[]);
      } catch (err) {
        console.error(err);
        setError('তথ্য খুঁজতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।');
      } finally {
        setLoading(false);
      }
    };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'সমস্যার সমাধান করা হয়েছে': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'অভিযোগ নিয়ে কাজ করা হচ্ছে': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'কর্তৃপক্ষের কাছে অভিযোগ জানানো হয়েছে': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'ভিজিট করা হয়েছে': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="pt-32 pb-20 bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-10 text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">অভিযোগের বর্তমান অবস্থা</h1>
          <p className="text-slate-600 max-w-xl mx-auto">মোবাইল নম্বর ও লোকেশন দিয়ে আপনার জমা দেওয়া অভিযোগের অগ্রগতি দেখুন।</p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-lg border border-slate-100 mb-8">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            <div className="lg:col-span-1 space-y-2">
              <label className="text-xs font-bold text-slate-500 ml-1">মোবাইল নম্বর</label>
              <input 
                required
                type="tel" 
                placeholder="০১৭XXXXXXXX"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none text-sm"
                value={searchData.phone}
                onChange={(e) => setSearchData({...searchData, phone: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 ml-1">উপজেলা</label>
              <select 
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-emerald-500 outline-none text-sm"
                value={searchData.upazila_id}
                onChange={(e) => setSearchData({...searchData, upazila_id: e.target.value, union_id: '', ward_id: ''})}
              >
                <option value="">নির্বাচন করুন</option>
                {upazilas.map(u => <option key={u.id} value={u.id}>{u.name_bn}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 ml-1">ইউনিয়ন</label>
              <select 
                required
                disabled={!searchData.upazila_id}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-emerald-500 outline-none text-sm disabled:bg-slate-50 disabled:text-slate-400"
                value={searchData.union_id}
                onChange={(e) => setSearchData({...searchData, union_id: e.target.value, ward_id: ''})}
              >
                <option value="">নির্বাচন করুন</option>
                {unions.map(u => <option key={u.id} value={u.id}>{u.name_bn}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 ml-1">ওয়ার্ড</label>
              <select 
                required
                disabled={!searchData.union_id}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-emerald-500 outline-none text-sm disabled:bg-slate-50 disabled:text-slate-400"
                value={searchData.ward_id}
                onChange={(e) => setSearchData({...searchData, ward_id: e.target.value})}
              >
                <option value="">নির্বাচন করুন</option>
                {wards.map(u => <option key={u.id} value={u.id}>{u.name_bn}</option>)}
              </select>
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="bg-emerald-500 hover:bg-emerald-600 text-white p-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-100 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
              খুঁজুন
            </button>
          </form>
        </div>

        {/* Results Section */}
        {searched && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              সার্চ রেজাল্ট ({complaints.length})
            </h3>
            
            {loading ? (
              <div className="py-20 text-center space-y-4">
                <Loader2 className="animate-spin mx-auto text-emerald-500" size={48} />
                <p className="text-slate-500 font-medium">তথ্য লোড হচ্ছে...</p>
              </div>
            ) : complaints.length > 0 ? (
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                {/* Desktop View */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-sm font-bold text-slate-600">
                        <th className="p-4 whitespace-nowrap">অভিযোগ নম্বর</th>
                        <th className="p-4 whitespace-nowrap">সমস্যার ধরন</th>
                        <th className="p-4 whitespace-nowrap">এলাকা</th>
                        <th className="p-4 whitespace-nowrap">বর্তমান অবস্থা</th>
                        <th className="p-4 whitespace-nowrap">জমা দেওয়ার তারিখ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {complaints.map((c) => (
                        <tr key={c.complaint_id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-4 font-bold text-slate-900 whitespace-nowrap">
                            #{c.complaint_id}
                          </td>
                          <td className="p-4 text-slate-700">
                            <span className="font-bold">{c.problem_categories?.name_bn || 'অন্যান্য'}</span>
                          </td>
                          <td className="p-4 text-slate-600">
                            {c.upazilas?.name_bn}, {c.unions?.name_bn}, {c.wards?.name_bn}
                          </td>
                          <td className="p-4">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold border whitespace-nowrap ${getStatusColor(c.status)}`}>
                              {c.status}
                            </span>
                          </td>
                          <td className="p-4 text-slate-600 whitespace-nowrap">
                            {new Date(c.created_at).toLocaleDateString('bn-BD', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="lg:hidden divide-y divide-slate-100">
                  {complaints.map((c) => (
                    <div key={c.complaint_id} className="p-5 space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <span className="text-emerald-600 font-black text-xs tracking-tight">#{c.complaint_id}</span>
                          <h4 className="font-bold text-slate-900">{c.problem_categories?.name_bn || 'অন্যান্য'}</h4>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-[10px] font-black tracking-wider shadow-sm border ${getStatusColor(c.status)}`}>
                          {c.status}
                        </span>
                      </div>
                      
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center gap-2 text-slate-500">
                          <MapPin size={14} className="text-emerald-500 shrink-0" />
                          <span>{c.upazilas?.name_bn}, {c.unions?.name_bn}, {c.wards?.name_bn}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500">
                          <Calendar size={14} className="text-emerald-500 shrink-0" />
                          <span>জমা: {new Date(c.created_at).toLocaleDateString('bn-BD')}</span>
                        </div>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 line-clamp-3">
                        {c.problem_details}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-200">
                <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search size={32} />
                </div>
                <h4 className="text-xl font-bold text-slate-900">কোনো তথ্য পাওয়া যায়নি</h4>
                <p className="text-slate-500 mt-2">আপনার মোবাইল নম্বর ও লোকেশন সঠিক কি না তা যাচাই করে আবার চেষ্টা করুন।</p>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3 text-sm font-medium border border-red-100">
            <AlertCircle size={20} />
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackComplaint;
