import { siteConfig } from '@/config/site';

export function AnnouncementBar() {
  return (
    <div className="bg-primary text-primary-foreground">
      <p className="px-4 py-2 text-center text-[11px] font-medium uppercase tracking-[0.18em] sm:text-xs">
        {siteConfig.announcement}
      </p>
    </div>
  );
}
