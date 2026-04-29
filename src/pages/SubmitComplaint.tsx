import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface Location {
  id: string;
  name_bn: string;
}

const SubmitComplaint = ({ isAdmin = false }: { isAdmin?: boolean }) => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [complaintId, setComplaintId] = useState('');
  const [error, setError] = useState('');

  // Form States
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    upazila_id: '',
    union_id: '',
    ward_id: '',
    gram_moholla: '',
    problem_category_id: '',
    problem_details: '',
  });
  const [consent, setConsent] = useState(false);

  // Location States
  const [upazilas, setUpazilas] = useState<Location[]>([]);
  const [unions, setUnions] = useState<Location[]>([]);
  const [wards, setWards] = useState<Location[]>([]);
  const [categories, setCategories] = useState<Location[]>([]);

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      // Fetch Upazilas
      const { data: upazilaData } = await supabase.from('upazilas').select('id, name_bn').eq('status', 'active');
      if (upazilaData) setUpazilas(upazilaData);

      // Fetch Categories
      const { data: catData } = await supabase.from('problem_categories').select('id, name_bn').eq('status', 'active').order('sort_order');
      if (catData) setCategories(catData);
    };
    fetchInitialData();
  }, []);

  // Fetch Unions when Upazila changes
  useEffect(() => {
    const fetchUnions = async () => {
      if (!formData.upazila_id) {
        setUnions([]);
        return;
      }
      const { data } = await supabase.from('unions').select('id, name_bn').eq('upazila_id', formData.upazila_id).eq('status', 'active');
      if (data) setUnions(data);
    };
    fetchUnions();
  }, [formData.upazila_id]);

  // Fetch Wards when Union changes
  useEffect(() => {
    const fetchWards = async () => {
      if (!formData.union_id) {
        setWards([]);
        return;
      }
      const { data } = await supabase.from('wards').select('id, name_bn').eq('union_id', formData.union_id).eq('status', 'active');
      if (data) setWards(data);
    };
    fetchWards();
  }, [formData.union_id]);

  const toEnglishNumber = (str: string) => {
    const bengaliToEnglish: Record<string, string> = {
      '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
      '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
    };
    return str.replace(/[০-৯]/g, match => bengaliToEnglish[match]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert phone to English before validation
    const convertedPhone = toEnglishNumber(formData.phone);

    // Phone validation (Bangladeshi numbers)
    const phoneRegex = /^01[3-9]\d{8}$/;
    if (!phoneRegex.test(convertedPhone)) {
      setError('অনুগ্রহ করে একটি সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: ০১৭XXXXXXXX)');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data, error: submitError } = await supabase
        .from('complaints')
        .insert([{ ...formData, phone: convertedPhone }])
        .select('complaint_id')
        .single();

      if (submitError) throw submitError;

      if (data) {
        setComplaintId(data.complaint_id);
        setSubmitted(true);
        window.scrollTo(0, 0);
      }
    } catch (err: any) {
      console.error(err);
      setError('দুঃখিত, অভিযোগটি জমা দেওয়া সম্ভব হয়নি। দয়া করে আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className={`${isAdmin ? 'py-10' : 'pt-32 pb-20'} container mx-auto px-4 max-w-2xl`}>
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl text-center space-y-6 border border-emerald-100">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="text-3xl font-bold text-slate-900">অভিযোগ সফলভাবে জমা হয়েছে!</h2>
          <p className="text-slate-600">অভিযোগ নম্বরটি সংরক্ষণ করুন:</p>
          <div className="bg-emerald-50 p-6 rounded-2xl border-2 border-dashed border-emerald-200">
            <span className="text-4xl font-black text-emerald-600 tracking-wider">{complaintId}</span>
          </div>
          <button 
            onClick={() => {
              if (isAdmin) {
                window.location.href = '/admin/complaints';
              } else {
                window.location.href = '/';
              }
            }}
            className="btn-primary w-full"
          >
            {isAdmin ? 'সকল অভিযোগ পেজে ফিরে যান' : 'হোমপেজে ফিরে যান'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${isAdmin ? 'py-4' : 'pt-32 pb-20'} bg-slate-50 min-h-screen`}>
      <div className="container mx-auto px-4 max-w-3xl">
        {!isAdmin && (
          <div className="mb-10 text-center space-y-4">
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">অভিযোগ জমা দিন</h1>
            <p className="text-slate-600 max-w-xl mx-auto">আপনার এলাকার যেকোনো সমস্যা আমাদের জানান। আমরা দ্রুত সমাধান করার চেষ্টা করব।</p>
          </div>
        )}

        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-xl border border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">নাম <span className="text-red-500">*</span></label>
                <input 
                  required
                  type="text" 
                  placeholder="আপনার নাম লিখুন"
                  className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">মোবাইল নম্বর <span className="text-red-500">*</span></label>
                <input 
                  required
                  type="tel" 
                  placeholder="০১৭XXXXXXXX"
                  className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">ইমেইল <span className="text-slate-400 font-normal">(ঐচ্ছিক)</span></label>
              <input 
                type="email" 
                placeholder="example@email.com"
                className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            {/* Location Section */}
            <div className="p-6 bg-slate-50 rounded-2xl space-y-6">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <span className="w-6 h-6 bg-emerald-500 text-white rounded-full text-xs flex items-center justify-center">১</span>
                লোকেশন নির্বাচন করুন
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500">উপজেলা *</label>
                  <select 
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-emerald-500 outline-none"
                    value={formData.upazila_id}
                    onChange={(e) => setFormData({...formData, upazila_id: e.target.value, union_id: '', ward_id: ''})}
                  >
                    <option value="">নির্বাচন করুন</option>
                    {upazilas.map(u => <option key={u.id} value={u.id}>{u.name_bn}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500">ইউনিয়ন *</label>
                  <select 
                    required
                    disabled={!formData.upazila_id}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-emerald-500 outline-none disabled:bg-slate-100 disabled:text-slate-400"
                    value={formData.union_id}
                    onChange={(e) => setFormData({...formData, union_id: e.target.value, ward_id: ''})}
                  >
                    <option value="">নির্বাচন করুন</option>
                    {unions.map(u => <option key={u.id} value={u.id}>{u.name_bn}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500">ওয়ার্ড *</label>
                  <select 
                    required
                    disabled={!formData.union_id}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-emerald-500 outline-none disabled:bg-slate-100 disabled:text-slate-400"
                    value={formData.ward_id}
                    onChange={(e) => setFormData({...formData, ward_id: e.target.value})}
                  >
                    <option value="">নির্বাচন করুন</option>
                    {wards.map(u => <option key={u.id} value={u.id}>{u.name_bn}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500">গ্রাম/মহল্লা</label>
                <input 
                  type="text" 
                  placeholder="গ্রাম বা মহল্লার নাম লিখুন"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-emerald-500 outline-none"
                  value={formData.gram_moholla}
                  onChange={(e) => setFormData({...formData, gram_moholla: e.target.value})}
                />
              </div>
            </div>

            {/* Problem Section */}
            <div className="space-y-6">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <span className="w-6 h-6 bg-emerald-500 text-white rounded-full text-xs flex items-center justify-center">২</span>
                সমস্যার বিবরণ
              </h3>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">সমস্যার ধরন *</label>
                <select 
                  required
                  className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-white focus:border-emerald-500 outline-none"
                  value={formData.problem_category_id}
                  onChange={(e) => setFormData({...formData, problem_category_id: e.target.value})}
                >
                  <option value="">নির্বাচন করুন</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name_bn}</option>)}
                  <option value="other">অন্যান্য</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">বিস্তারিত সমস্যা *</label>
                <textarea 
                  required
                  rows={5}
                  placeholder="আপনার সমস্যার কথা বিস্তারিত লিখুন..."
                  className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none"
                  value={formData.problem_details}
                  onChange={(e) => setFormData({...formData, problem_details: e.target.value})}
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3 text-sm font-medium border border-red-100">
                <AlertCircle size={20} />
                {error}
              </div>
            )}

            <div className="flex items-start gap-3">
              <input 
                type="checkbox" 
                id="consent" 
                required
                className="mt-1 w-5 h-5 accent-emerald-500 cursor-pointer"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
              />
              <label htmlFor="consent" className="text-sm text-slate-600 cursor-pointer">
                আমি নিশ্চিত করছি যে, আমার দেওয়া উপরের সকল তথ্য সঠিক। মিথ্যা তথ্য প্রদানের ক্ষেত্রে কর্তৃপক্ষ যেকোনো ব্যবস্থা নিতে পারে।
              </label>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-3 py-5 text-xl shadow-xl shadow-emerald-200"
            >
              {loading ? <Loader2 className="animate-spin" size={24} /> : <Send size={24} />}
              অভিযোগ জমা দিন
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubmitComplaint;
