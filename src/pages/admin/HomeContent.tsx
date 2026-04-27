import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import {
  Loader2,
  Save,
  CheckCircle2,
  AlertCircle,
  Home,
  User,
  BarChart3,
  Phone,
  Share2,
  FileText,
  Megaphone,
  Image as ImageIcon,
  Type,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Upload,
  Link as LinkIcon,
  X
} from 'lucide-react';

interface ContentItem {
  id: string;
  section_key: string;
  content: string;
  image_url: string | null;
  updated_at: string;
}

interface FieldDef {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'image';
  placeholder: string;
}

interface SectionDef {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  fields: FieldDef[];
}

const SECTIONS: SectionDef[] = [
  {
    id: 'hero',
    title: 'হিরো সেকশন (Hero Section)',
    icon: <Home size={20} />,
    color: 'emerald',
    fields: [
      { key: 'hero_tag', label: 'ট্যাগ (Tag Line)', type: 'text', placeholder: 'যেমন: উন্নয়ন ও সেবার অঙ্গীকারে' },
      { key: 'hero_title', label: 'শিরোনাম (Hero Title)', type: 'text', placeholder: 'মূল হেডলাইন' },
      { key: 'hero_subtitle', label: 'উপশিরোনাম (Subtitle)', type: 'textarea', placeholder: 'হিরো সাবটাইটেল' },
      { key: 'hero_image', label: 'হিরো ছবি', type: 'image', placeholder: 'https://...' },
    ],
  },
  {
    id: 'about',
    title: 'পরিচিতি সেকশন (About Section)',
    icon: <User size={20} />,
    color: 'blue',
    fields: [
      { key: 'about_name', label: 'নাম', type: 'text', placeholder: 'পূর্ণ নাম' },
      { key: 'about_designation', label: 'পদবি / পরিচয়', type: 'text', placeholder: 'যেমন: সমাজসেবক ও জননেতা' },
      { key: 'about_description', label: 'বিবরণ', type: 'textarea', placeholder: 'সংক্ষিপ্ত পরিচিতি...' },
      { key: 'about_image', label: 'পরিচিতি ছবি', type: 'image', placeholder: 'https://...' },
    ],
  },
  {
    id: 'stats',
    title: 'ইমপ্যাক্ট কাউন্টার (Impact Statistics)',
    icon: <BarChart3 size={20} />,
    color: 'purple',
    fields: [
      { key: 'stat_resolved_complaints', label: 'সমাধানকৃত অভিযোগ সংখ্যা', type: 'text', placeholder: 'যেমন: ১,২৫০+' },
      { key: 'stat_resolved_label', label: 'সমাধান লেবেল', type: 'text', placeholder: 'যেমন: সমাধানকৃত অভিযোগ' },
      { key: 'stat_total_projects', label: 'প্রকল্প সংখ্যা', type: 'text', placeholder: 'যেমন: ৫০+' },
      { key: 'stat_projects_label', label: 'প্রকল্প লেবেল', type: 'text', placeholder: 'যেমন: উন্নয়নমূলক প্রকল্প' },
      { key: 'stat_people_served', label: 'সেবাগ্রহীতা সংখ্যা', type: 'text', placeholder: 'যেমন: ১০,০০০+' },
      { key: 'stat_people_label', label: 'সেবাগ্রহীতা লেবেল', type: 'text', placeholder: 'যেমন: সেবা পেয়েছেন' },
      { key: 'stat_areas_covered', label: 'এলাকা সংখ্যা', type: 'text', placeholder: 'যেমন: ২৫+' },
      { key: 'stat_areas_label', label: 'এলাকা লেবেল', type: 'text', placeholder: 'যেমন: এলাকা কভারেজ' },
    ],
  },
  {
    id: 'contact',
    title: 'যোগাযোগ তথ্য (Contact Information)',
    icon: <Phone size={20} />,
    color: 'amber',
    fields: [
      { key: 'contact_address', label: 'ঠিকানা', type: 'text', placeholder: 'অফিসের ঠিকানা' },
      { key: 'contact_phone_1', label: 'ফোন নম্বর ১', type: 'text', placeholder: '+880 1XXX-XXXXXX' },
      { key: 'contact_phone_2', label: 'ফোন নম্বর ২', type: 'text', placeholder: '+880 1XXX-XXXXXX' },
      { key: 'contact_email', label: 'ইমেইল', type: 'text', placeholder: 'email@example.com' },
      { key: 'contact_office_hours', label: 'অফিস সময়', type: 'text', placeholder: 'শনিবার - বৃহস্পতিবার...' },
      { key: 'contact_office_closed', label: 'ছুটির দিন', type: 'text', placeholder: 'শুক্রবার: বন্ধ' },
    ],
  },
  {
    id: 'social',
    title: 'সোশ্যাল মিডিয়া (Social Media Links)',
    icon: <Share2 size={20} />,
    color: 'sky',
    fields: [
      { key: 'social_facebook', label: 'Facebook URL', type: 'text', placeholder: 'https://facebook.com/...' },
      { key: 'social_twitter', label: 'Twitter / X URL', type: 'text', placeholder: 'https://twitter.com/...' },
      { key: 'social_youtube', label: 'YouTube URL', type: 'text', placeholder: 'https://youtube.com/...' },
      { key: 'social_instagram', label: 'Instagram URL', type: 'text', placeholder: 'https://instagram.com/...' },
      { key: 'social_linkedin', label: 'LinkedIn URL', type: 'text', placeholder: 'https://linkedin.com/...' },
    ],
  },
  {
    id: 'footer',
    title: 'ফুটার কন্টেন্ট (Footer Content)',
    icon: <FileText size={20} />,
    color: 'slate',
    fields: [
      { key: 'footer_description', label: 'ফুটার বিবরণ', type: 'textarea', placeholder: 'সাইটের সংক্ষিপ্ত বিবরণ...' },
      { key: 'footer_address', label: 'ফুটার ঠিকানা', type: 'text', placeholder: 'ঠিকানা...' },
      { key: 'footer_phone', label: 'ফুটার ফোন', type: 'text', placeholder: 'ফোন নম্বর' },
      { key: 'footer_email', label: 'ফুটার ইমেইল', type: 'text', placeholder: 'ইমেইল' },
      { key: 'footer_copyright', label: 'কপিরাইট টেক্সট', type: 'text', placeholder: '© ২০২৬...' },
    ],
  },
  {
    id: 'cta',
    title: 'CTA সেকশন (Call To Action)',
    icon: <Megaphone size={20} />,
    color: 'rose',
    fields: [
      { key: 'cta_title', label: 'CTA শিরোনাম', type: 'text', placeholder: 'আপনার এলাকার কোনো সমস্যা আছে?...' },
      { key: 'cta_subtitle', label: 'CTA উপশিরোনাম', type: 'text', placeholder: 'আমরা প্রতিটি অভিযোগ...' },
    ],
  },
];

const colorMap: Record<string, { bg: string; text: string; border: string; light: string; ring: string }> = {
  emerald: { bg: 'bg-emerald-500', text: 'text-emerald-600', border: 'border-emerald-200', light: 'bg-emerald-50', ring: 'focus:border-emerald-500 focus:ring-emerald-100' },
  blue:    { bg: 'bg-blue-500',    text: 'text-blue-600',    border: 'border-blue-200',    light: 'bg-blue-50',    ring: 'focus:border-blue-500 focus:ring-blue-100' },
  purple:  { bg: 'bg-purple-500',  text: 'text-purple-600',  border: 'border-purple-200',  light: 'bg-purple-50',  ring: 'focus:border-purple-500 focus:ring-purple-100' },
  amber:   { bg: 'bg-amber-500',   text: 'text-amber-600',   border: 'border-amber-200',   light: 'bg-amber-50',   ring: 'focus:border-amber-500 focus:ring-amber-100' },
  sky:     { bg: 'bg-sky-500',     text: 'text-sky-600',     border: 'border-sky-200',     light: 'bg-sky-50',     ring: 'focus:border-sky-500 focus:ring-sky-100' },
  slate:   { bg: 'bg-slate-700',   text: 'text-slate-600',   border: 'border-slate-200',   light: 'bg-slate-50',   ring: 'focus:border-slate-500 focus:ring-slate-100' },
  rose:    { bg: 'bg-rose-500',    text: 'text-rose-600',    border: 'border-rose-200',    light: 'bg-rose-50',    ring: 'focus:border-rose-500 focus:ring-rose-100' },
};

// ─── Image Upload Field Component ────────────────────────────────────────────
interface ImageFieldProps {
  fieldKey: string;
  label: string;
  value: string;
  onChange: (key: string, value: string) => void;
  accentBg: string;
}

const ImageField: React.FC<ImageFieldProps> = ({ fieldKey, label, value, onChange, accentBg }) => {
  const [mode, setMode] = useState<'upload' | 'url'>(value ? 'upload' : 'upload');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    setUploading(true);
    setUploadError('');
    const ext = file.name.split('.').pop();
    const fileName = `home_${fieldKey}_${Date.now()}.${ext}`;
    const { data, error } = await supabase.storage.from('images').upload(fileName, file, { upsert: true });
    if (data) {
      const { data: urlData } = supabase.storage.from('images').getPublicUrl(fileName);
      onChange(fieldKey, urlData.publicUrl);
    }
    if (error) setUploadError('আপলোড ব্যর্থ হয়েছে: ' + error.message);
    setUploading(false);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
        <ImageIcon size={14} className="text-slate-400" />
        {label}
      </label>

      {/* Mode Toggle */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMode('upload')}
          className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all border ${
            mode === 'upload' ? `${accentBg} text-white border-transparent` : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
          }`}
        >
          <Upload size={13} /> ফাইল আপলোড
        </button>
        <button
          type="button"
          onClick={() => setMode('url')}
          className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all border ${
            mode === 'url' ? `${accentBg} text-white border-transparent` : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
          }`}
        >
          <LinkIcon size={13} /> URL দিন
        </button>
      </div>

      {/* Upload Input */}
      {mode === 'upload' ? (
        <div
          onClick={() => fileRef.current?.click()}
          className="relative border-2 border-dashed border-slate-200 rounded-xl p-6 text-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/30 transition-all group"
        >
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => { if (e.target.files?.[0]) handleUpload(e.target.files[0]); }}
          />
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="animate-spin text-emerald-500" size={28} />
              <p className="text-sm text-slate-500 font-medium">আপলোড হচ্ছে...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 bg-slate-100 group-hover:bg-emerald-100 rounded-full flex items-center justify-center transition-colors">
                <Upload size={20} className="text-slate-400 group-hover:text-emerald-500 transition-colors" />
              </div>
              <p className="text-sm font-semibold text-slate-600">ক্লিক করুন অথবা ছবি টেনে আনুন</p>
              <p className="text-xs text-slate-400">PNG, JPG, WebP • সর্বোচ্চ 5MB</p>
            </div>
          )}
        </div>
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(fieldKey, e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 bg-slate-50 focus:bg-white transition-all text-slate-800"
        />
      )}

      {uploadError && (
        <p className="text-xs text-red-500 font-medium flex items-center gap-1">
          <AlertCircle size={12} /> {uploadError}
        </p>
      )}

      {/* Preview */}
      {value && (
        <div className="relative w-full h-40 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 group/preview">
          <img
            src={value}
            alt="preview"
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
          <button
            type="button"
            onClick={() => onChange(fieldKey, '')}
            className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover/preview:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
          >
            <X size={14} />
          </button>
          <div className="absolute bottom-2 left-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-full font-medium">
            প্রিভিউ
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const AdminHomeContent = () => {
  const [contentMap, setContentMap] = useState<Record<string, ContentItem>>({});
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({ hero: true });

  const fetchContent = async () => {
    setLoading(true);
    const { data, error: fetchError } = await supabase
      .from('home_content')
      .select('*');

    if (fetchError) {
      setError('ডেটা লোড করতে সমস্যা হয়েছে: ' + fetchError.message);
      setLoading(false);
      return;
    }

    if (data) {
      const map: Record<string, ContentItem> = {};
      const form: Record<string, string> = {};
      data.forEach((item: ContentItem) => {
        map[item.section_key] = item;
        // For image fields, image_url takes priority
        form[item.section_key] = item.image_url || item.content || '';
      });
      setContentMap(map);
      setFormData(form);
    }
    setLoading(false);
  };

  useEffect(() => { fetchContent(); }, []);

  const handleFieldChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSection = async (sectionId: string) => {
    const section = SECTIONS.find(s => s.id === sectionId);
    if (!section) return;

    setSaving(sectionId);
    setError(null);

    try {
      for (const field of section.fields) {
        const value = formData[field.key] || '';
        const existingItem = contentMap[field.key];

        const isImageField = field.type === 'image';
        const updatePayload: any = {
          updated_at: new Date().toISOString(),
          content: isImageField ? value : value,
          ...(isImageField && { image_url: value }),
        };

        if (existingItem) {
          const { error: updateError } = await supabase
            .from('home_content')
            .update(updatePayload)
            .eq('section_key', field.key);
          if (updateError) throw updateError;
        } else {
          const { error: insertError } = await supabase
            .from('home_content')
            .insert([{ section_key: field.key, ...updatePayload }]);
          if (insertError) throw insertError;
        }
      }

      setSuccess(sectionId);
      setTimeout(() => setSuccess(null), 3000);
      await fetchContent();
    } catch (err: any) {
      setError(`সংরক্ষণে ত্রুটি: ${err.message}`);
    } finally {
      setSaving(null);
    }
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="animate-spin text-emerald-500" size={48} />
        <p className="text-slate-500 font-bold">কন্টেন্ট লোড হচ্ছে...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">হোমপেজ কন্টেন্ট ম্যানেজমেন্ট</h1>
          <p className="text-slate-500 font-medium">
            হোমপেজ, যোগাযোগ, ফুটার ও সোশ্যাল মিডিয়ার সকল কন্টেন্ট এখান থেকে পরিবর্তন করুন
          </p>
        </div>
        <button
          onClick={fetchContent}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-all"
        >
          <RefreshCw size={18} /> রিফ্রেশ
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl flex items-center gap-3 font-medium">
          <AlertCircle size={20} /> {error}
        </div>
      )}

      {/* Sections */}
      <div className="space-y-4">
        {SECTIONS.map((section) => {
          const colors = colorMap[section.color] || colorMap.emerald;
          const isExpanded = !!expandedSections[section.id];
          const isSaving = saving === section.id;
          const isSuccess = success === section.id;

          return (
            <div
              key={section.id}
              className={`bg-white rounded-2xl border transition-all overflow-hidden ${
                isExpanded ? `shadow-lg ${colors.border}` : 'border-slate-100 shadow-sm'
              }`}
            >
              {/* Section Header */}
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 ${colors.light} ${colors.text} rounded-xl flex items-center justify-center`}>
                    {section.icon}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">{section.title}</h2>
                    <p className="text-xs text-slate-400 mt-0.5">{section.fields.length}টি ফিল্ড</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {isSuccess && (
                    <span className="text-emerald-500 flex items-center gap-1 text-sm font-bold">
                      <CheckCircle2 size={16} /> সংরক্ষিত!
                    </span>
                  )}
                  {isExpanded ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
                </div>
              </button>

              {/* Section Body */}
              {isExpanded && (
                <div className="px-6 pb-6 border-t border-slate-100 pt-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                    {section.fields.map((field) => {
                      const isFullWidth = field.type === 'image' || field.type === 'textarea';
                      return (
                        <div key={field.key} className={isFullWidth ? 'md:col-span-2' : ''}>
                          {field.type === 'image' ? (
                            <ImageField
                              fieldKey={field.key}
                              label={field.label}
                              value={formData[field.key] || ''}
                              onChange={handleFieldChange}
                              accentBg={colors.bg}
                            />
                          ) : field.type === 'textarea' ? (
                            <div className="space-y-2">
                              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                <Type size={14} className="text-slate-400" /> {field.label}
                              </label>
                              <textarea
                                rows={3}
                                value={formData[field.key] || ''}
                                onChange={(e) => handleFieldChange(field.key, e.target.value)}
                                placeholder={field.placeholder}
                                className={`w-full px-4 py-3 rounded-xl border border-slate-200 outline-none ${colors.ring} focus:ring-2 bg-slate-50 focus:bg-white transition-all resize-none text-slate-800`}
                              />
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                <Type size={14} className="text-slate-400" /> {field.label}
                              </label>
                              <input
                                type="text"
                                value={formData[field.key] || ''}
                                onChange={(e) => handleFieldChange(field.key, e.target.value)}
                                placeholder={field.placeholder}
                                className={`w-full px-4 py-3 rounded-xl border border-slate-200 outline-none ${colors.ring} focus:ring-2 bg-slate-50 focus:bg-white transition-all text-slate-800`}
                              />
                            </div>
                          )}

                          {contentMap[field.key]?.updated_at && (
                            <p className="text-[10px] text-slate-400 ml-1 mt-1">
                              সর্বশেষ আপডেট: {new Date(contentMap[field.key].updated_at).toLocaleString('bn-BD')}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Save Button */}
                  <div className="pt-4 flex justify-end">
                    <button
                      onClick={() => handleSaveSection(section.id)}
                      disabled={isSaving}
                      className={`px-8 py-3 rounded-xl font-bold text-white ${colors.bg} hover:opacity-90 shadow-lg transition-all flex items-center gap-2 disabled:opacity-60`}
                    >
                      {isSaving ? (
                        <><Loader2 className="animate-spin" size={18} /> সংরক্ষণ হচ্ছে...</>
                      ) : isSuccess ? (
                        <><CheckCircle2 size={18} /> সংরক্ষিত!</>
                      ) : (
                        <><Save size={18} /> সংরক্ষণ করুন</>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminHomeContent;
