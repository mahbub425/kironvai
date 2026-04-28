import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const DEFAULT_SITE_TITLE = 'কুড়িগ্রাম-১ জনসেবা ও অভিযোগ ব্যবস্থাপনা';

type AppSettingRow = {
  setting_key: string;
  setting_value: string | null;
};

export const useSiteSettings = () => {
  const [siteTitle, setSiteTitle] = useState(DEFAULT_SITE_TITLE);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    const { data, error } = await supabase
      .from('app_settings')
      .select('setting_key, setting_value')
      .eq('setting_key', 'site_title')
      .maybeSingle<AppSettingRow>();

    if (!error && data?.setting_value?.trim()) {
      setSiteTitle(data.setting_value.trim());
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    loading,
    siteTitle,
    defaultSiteTitle: DEFAULT_SITE_TITLE,
    refetch: fetchSettings,
  };
};
