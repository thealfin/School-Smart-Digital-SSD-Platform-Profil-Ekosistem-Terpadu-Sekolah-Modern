/**
 * Single Source of Truth for all Material Symbols Rounded icons used across the landing page.
 * Used to construct preconnect links, ensure alphabetical subsets, and validate icon references.
 */
export const REQUIRED_ICONS = [
  'account_balance_wallet',
  'arrow_downward',
  'arrow_forward',
  'arrow_upward',
  'badge',
  'check_circle',
  'close',
  'dashboard',
  'family_restroom',
  'help_outline',
  'how_to_reg',
  'info',
  'lock',
  'menu',
  'monitoring',
  'nfc',
  'qr_code_scanner',
  'schedule',
  'school',
  'security',
  'shield_lock',
  'storefront',
  'touch_app',
  'tv',
  'verified_user',
  'volunteer_activism',
] as const

export type RequiredIconName = typeof REQUIRED_ICONS[number]

/**
 * Generates Google Fonts icon_names URL parameter in sorted order
 */
export function getIconNamesParam(): string {
  return [...REQUIRED_ICONS].sort().join(',')
}
