export type SiteMode = 'portal' | 'channel';

const mode: SiteMode = process.env.XIQIQI_SITE_MODE === 'channel' ? 'channel' : 'portal';
const channelId = String(process.env.XIQIQI_SITE_CHANNEL || '').trim();
const domain = String(process.env.XIQIQI_SITE_DOMAIN || 'xiqiqi.com').trim();

export function getSiteMode(): SiteMode {
  return mode;
}

export function getSiteChannel(): string | null {
  return mode === 'channel' && channelId ? channelId : null;
}

export function getSiteDomain(): string {
  return domain;
}

export function siteOrigin(targetDomain = domain): string {
  return `https://${targetDomain}`;
}
