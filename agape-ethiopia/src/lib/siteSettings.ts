export const PUBLIC_SITE_SETTING_KEYS = [
  "daily_announcement",
  "homepage_hero_title",
  "homepage_hero_subtitle",
  "homepage_visit_us",
  "homepage_social_links",
  "homepage_beneficiary_count",
  "homepage_partner_count",
  "about_title",
  "about_mission",
  "about_vision",
  "about_content",
  "site_name",
  "site_email",
  "site_phone",
  "donation_bank_accounts",
  "donation_purposes",
] as const;

export const PUBLIC_SITE_SETTING_SET = new Set<string>(PUBLIC_SITE_SETTING_KEYS as readonly string[]);

export function filterPublicSiteSettings(
  settings: Array<{ key?: string | null; value?: string | null }>
): Array<{ key: string; value: string }> {
  return (settings ?? [])
    .filter((setting) => {
      const key = setting?.key ?? "";
      return PUBLIC_SITE_SETTING_SET.has(key);
    })
    .map((setting) => ({
      key: String(setting.key ?? ""),
      value: String(setting.value ?? ""),
    }));
}
