import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { useHomeContent } from '../hooks/useHomeContent';

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const { get } = useHomeContent();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="pt-24 pb-20 min-h-screen bg-slate-50">
      <div className="bg-slate-900 text-white py-16 mb-12">
        <div className="container mx-auto px-4 text-center space-y-4">
          <h1 className="text-3xl md:text-5xl font-black">যোগাযোগ</h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            যেকোনো প্রয়োজনে আমাদের সাথে যোগাযোগ করুন
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-black text-slate-900 mb-6">আমাদের ঠিকানা</h2>
              <p className="text-slate-600 leading-relaxed">
                আপনার যেকোনো মতামত, পরামর্শ বা অভিযোগ সরাসরি আমাদের জানাতে পারেন। 
                আমরা আপনাদের সেবায় সর্বদা প্রস্তুত।
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">অফিসের ঠিকানা</h3>
                  <p className="text-slate-600 mt-1">{get('contact_address', 'ভূরুঙ্গামারী সদর, ভূরুঙ্গামারী, কুড়িগ্রাম-১')}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">মোবাইল নম্বর</h3>
                  <p className="text-slate-600 mt-1">{get('contact_phone_1', '+880 1700-000000')}</p>
                  <p className="text-slate-600">{get('contact_phone_2', '+880 1900-000000')}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">ইমেইল</h3>
                  <p className="text-slate-600 mt-1">{get('contact_email', 'contact@kironvai.com')}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center shrink-0">
                  <Clock size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">অফিস সময়</h3>
                  <p className="text-slate-600 mt-1">{get('contact_office_hours', 'শনিবার - বৃহস্পতিবার: সকাল ৯টা - সন্ধ্যা ৬টা')}</p>
                  <p className="text-slate-600">{get('contact_office_closed', 'শুক্রবার: বন্ধ')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-slate-100">
            <h3 className="text-2xl font-black text-slate-900 mb-8">বার্তা পাঠান</h3>
            
            {submitted ? (
              <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center">
                  <CheckCircle2 size={40} />
                </div>
                <h4 className="text-xl font-bold text-slate-900">ধন্যবাদ!</h4>
                <p className="text-slate-500">আপনার বার্তা সফলভাবে পাঠানো হয়েছে। আমরা শীঘ্রই যোগাযোগ করব।</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">আপনার নাম</label>
                  <input required type="text" placeholder="নাম লিখুন" className="w-full px-5 py-4 rounded-2xl border border-slate-200 outline-none focus:border-emerald-500 bg-slate-50 focus:bg-white transition-all" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">মোবাইল নম্বর</label>
                    <input required type="tel" placeholder="০১৭..." className="w-full px-5 py-4 rounded-2xl border border-slate-200 outline-none focus:border-emerald-500 bg-slate-50 focus:bg-white transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">ইমেইল (ঐচ্ছিক)</label>
                    <input type="email" placeholder="example@email.com" className="w-full px-5 py-4 rounded-2xl border border-slate-200 outline-none focus:border-emerald-500 bg-slate-50 focus:bg-white transition-all" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">আপনার বার্তা</label>
                  <textarea required rows={4} placeholder="বিস্তারিত লিখুন..." className="w-full px-5 py-4 rounded-2xl border border-slate-200 outline-none focus:border-emerald-500 bg-slate-50 focus:bg-white transition-all resize-none"></textarea>
                </div>

                <button type="submit" className="w-full bg-slate-900 hover:bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-emerald-200">
                  <Send size={20} /> বার্তা পাঠান
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
