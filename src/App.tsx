import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import SubmitComplaint from './pages/SubmitComplaint';
import TrackComplaint from './pages/TrackComplaint';
import DevelopmentWorks from './pages/DevelopmentWorks';
import SocialWorks from './pages/SocialWorks';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminComplaints from './pages/admin/Complaints';
import AdminNewComplaint from './pages/admin/AdminNewComplaint';
import AdminResolvedComplaints from './pages/admin/AdminResolvedComplaints';
import AdminLocations from './pages/admin/Locations';
import AdminCategories from './pages/admin/Categories';
import AdminDevelopment from './pages/admin/Development';
import AdminSocialCategories from './pages/admin/SocialCategories';
import AdminSocialWorks from './pages/admin/SocialWorks';
import AdminSettings from './pages/admin/Settings';
import AdminHomeContent from './pages/admin/HomeContent';
import ProtectedRoute from './components/admin/ProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';
import { useLayoutEffect } from 'react';
import { useSiteSettings } from './hooks/useSiteSettings';

const setMetaContent = (selector: string, content: string) => {
  const element = document.head.querySelector<HTMLMetaElement>(selector);
  if (element) {
    element.content = content;
  }
};

const setLinkHref = (selector: string, href: string) => {
  const element = document.head.querySelector<HTMLLinkElement>(selector);
  if (element) {
    element.href = href;
  }
};

const toAbsoluteUrl = (url: string) => {
  try {
    return new URL(url, window.location.origin).href;
  } catch {
    return url;
  }
};

function App() {
  const { siteTitle, shareDescription, shareImage, siteUrl } = useSiteSettings();

  useLayoutEffect(() => {
    const absoluteShareImage = toAbsoluteUrl(shareImage);
    const canonicalUrl = toAbsoluteUrl(siteUrl || window.location.origin);

    document.title = siteTitle;
    setMetaContent('meta[name="title"]', siteTitle);
    setMetaContent('meta[property="og:site_name"]', siteTitle);
    setMetaContent('meta[property="og:title"]', siteTitle);
    setMetaContent('meta[name="twitter:title"]', siteTitle);
    setMetaContent('meta[name="description"]', shareDescription);
    setMetaContent('meta[property="og:description"]', shareDescription);
    setMetaContent('meta[name="twitter:description"]', shareDescription);
    setMetaContent('meta[property="og:url"]', canonicalUrl);
    setMetaContent('meta[property="og:image"]', absoluteShareImage);
    setMetaContent('meta[name="twitter:image"]', absoluteShareImage);
    setLinkHref('link[rel="canonical"]', canonicalUrl);
  }, [siteTitle, shareDescription, shareImage, siteUrl]);

  return (
    <Routes>
      {/* Public Routes */}
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/submit-complaint" element={<Layout><SubmitComplaint /></Layout>} />
        <Route path="/track-complaint" element={<Layout><TrackComplaint /></Layout>} />
        <Route path="/development-works" element={<Layout><DevelopmentWorks /></Layout>} />
        <Route path="/social-works" element={<Layout><SocialWorks /></Layout>} />
        <Route path="/gallery" element={<Layout><Gallery /></Layout>} />
        <Route path="/contact" element={<Layout><Contact /></Layout>} />

        {/* Admin Routes */}
        <Route path="/admin">
          <Route index element={<AdminLogin />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="complaints" element={<AdminComplaints />} />
              <Route path="complaints/new" element={<AdminNewComplaint />} />
              <Route path="complaints/resolved" element={<AdminResolvedComplaints />} />
              <Route path="locations" element={<AdminLocations />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="development" element={<AdminDevelopment />} />
              <Route path="social-categories" element={<AdminSocialCategories />} />
              <Route path="social" element={<AdminSocialWorks />} />
              <Route path="home-content" element={<AdminHomeContent />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Route>
        </Route>
      </Routes>
  );
}

export default App;
