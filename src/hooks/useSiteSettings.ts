import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const DEFAULT_SITE_TITLE = 'ভূরুঙ্গামারী জনসেবা ও অভিযোগ ব্যবস্থাপনা';
const DEFAULT_SHARE_DESCRIPTION = 'ভূরুঙ্গামারী বাসীর জনসেবা, অভিযোগ ব্যবস্থাপনা, উন্নয়নমূলক কাজ এবং স্বেচ্ছাসেবী কার্যক্রমের ডিজিটাল প্ল্যাটফর্ম।';
const DEFAULT_SHARE_IMAGE = '/favicon.svg';
const DEFAULT_SITE_URL = typeof window !== 'undefined' ? window.location.origin : '';

type AppSettingRow = {
  setting_key: string;
  setting_value: string | null;
};

export const useSiteSettings = () => {
  const [siteTitle, setSiteTitle] = useState(DEFAULT_SITE_TITLE);
  const [shareDescription, setShareDescription] = useState(DEFAULT_SHARE_DESCRIPTION);
  const [shareImage, setShareImage] = useState(DEFAULT_SHARE_IMAGE);
  const [siteUrl, setSiteUrl] = useState(DEFAULT_SITE_URL);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    const { data, error } = await supabase
      .from('app_settings')
      .select('setting_key, setting_value')
      .in('setting_key', ['site_title', 'share_description', 'share_image', 'site_url'])
      .returns<AppSettingRow[]>();

    if (!error && data) {
      const settings = new Map(data.map((row) => [row.setting_key, row.setting_value?.trim() || '']));
      const nextTitle = settings.get('site_title');
      const nextDescription = settings.get('share_description');
      const nextImage = settings.get('share_image');
      const nextSiteUrl = settings.get('site_url');

      setSiteTitle(nextTitle || DEFAULT_SITE_TITLE);
      setShareDescription(nextDescription || DEFAULT_SHARE_DESCRIPTION);
      setShareImage(nextImage || DEFAULT_SHARE_IMAGE);
      setSiteUrl(nextSiteUrl || DEFAULT_SITE_URL);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    loading,
    siteTitle,
    shareDescription,
    shareImage,
    siteUrl,
    defaultSiteTitle: DEFAULT_SITE_TITLE,
    defaultShareDescription: DEFAULT_SHARE_DESCRIPTION,
    defaultShareImage: DEFAULT_SHARE_IMAGE,
    defaultSiteUrl: DEFAULT_SITE_URL,
    refetch: fetchSettings,
  };
};
