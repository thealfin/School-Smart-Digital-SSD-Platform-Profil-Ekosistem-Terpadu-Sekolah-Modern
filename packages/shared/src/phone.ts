/**
 * Normalizes Indonesian mobile and WhatsApp numbers into standard international format without '+' prefix: '628...'
 * Handles prefixes: '08...', '+628...', '628...', or numbers with dashes/spaces.
 */
export function normalizeWa(input: string): string {
  const d = input.replace(/\D/g, '')
  if (d.startsWith('62')) return d
  if (d.startsWith('0')) return '62' + d.slice(1)
  return d
}
