import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const DEFAULT_SITE_TITLE = 'কুড়িগ্রাম-১ জনসেবা ও অভিযোগ ব্যবস্থাপনা';
const DEFAULT_SHARE_DESCRIPTION =
  'কুড়িগ্রাম-১ এলাকার জনসেবা, অভিযোগ ব্যবস্থাপনা, উন্নয়নমূলক কাজ এবং স্বেচ্ছাসেবী কার্যক্রমের ডিজিটাল প্ল্যাটফর্ম।';
const DEFAULT_SHARE_IMAGE = '/favicon.svg';
const DEFAULT_SITE_URL = typeof window !== 'undefined' ? window.location.origin : '';
const SETTINGS_CACHE_KEY = 'kironvai_site_settings';

type AppSettingRow = {
  setting_key: string;
  setting_value: string | null;
};

type SiteSettings = {
  siteTitle: string;
  shareDescription: string;
  shareImage: string;
  siteUrl: string;
};

const defaultSettings: SiteSettings = {
  siteTitle: DEFAULT_SITE_TITLE,
  shareDescription: DEFAULT_SHARE_DESCRIPTION,
  shareImage: DEFAULT_SHARE_IMAGE,
  siteUrl: DEFAULT_SITE_URL,
};

const getCachedSettings = () => {
  if (typeof window === 'undefined') return defaultSettings;

  try {
    const cached = window.localStorage.getItem(SETTINGS_CACHE_KEY);
    if (!cached) return defaultSettings;

    return {
      ...defaultSettings,
      ...(JSON.parse(cached) as Partial<SiteSettings>),
    };
  } catch {
    return defaultSettings;
  }
};

export const useSiteSettings = () => {
  const [settings, setSettings] = useState(getCachedSettings);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    const { data, error } = await supabase
      .from('app_settings')
      .select('setting_key, setting_value')
      .in('setting_key', ['site_title', 'share_description', 'share_image', 'site_url'])
      .returns<AppSettingRow[]>();

    if (!error && data) {
      const rows = new Map(data.map((row) => [row.setting_key, row.setting_value?.trim() || '']));
      const nextSettings = {
        siteTitle: rows.get('site_title') || DEFAULT_SITE_TITLE,
        shareDescription: rows.get('share_description') || DEFAULT_SHARE_DESCRIPTION,
        shareImage: rows.get('share_image') || DEFAULT_SHARE_IMAGE,
        siteUrl: rows.get('site_url') || DEFAULT_SITE_URL,
      };

      setSettings(nextSettings);

      if (typeof window !== 'undefined') {
        window.localStorage.setItem(SETTINGS_CACHE_KEY, JSON.stringify(nextSettings));
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    loading,
    siteTitle: settings.siteTitle,
    shareDescription: settings.shareDescription,
    shareImage: settings.shareImage,
    siteUrl: settings.siteUrl,
    defaultSiteTitle: DEFAULT_SITE_TITLE,
    defaultShareDescription: DEFAULT_SHARE_DESCRIPTION,
    defaultShareImage: DEFAULT_SHARE_IMAGE,
    defaultSiteUrl: DEFAULT_SITE_URL,
    refetch: fetchSettings,
  };
};
