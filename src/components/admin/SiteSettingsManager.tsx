
import BasicSiteSettings from './settings/BasicSiteSettings';
import FooterSettings from './settings/FooterSettings';
import SocialLinksSettings from './settings/SocialLinksSettings';
import ColorThemeSettings from './settings/ColorThemeSettings';

const SiteSettingsManager = () => {
  return (
    <div className="space-y-6">
      <BasicSiteSettings />
      <FooterSettings />
      <SocialLinksSettings />
      <ColorThemeSettings />
    </div>
  );
};

export default SiteSettingsManager;
