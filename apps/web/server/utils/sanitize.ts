/**
 * Escapes CSV cell to prevent Spreadsheet Formula Injection (CSV Injection / RCE).
 * Prepends single quote (') to cells starting with =, +, -, @, \t, or \r.
 * Escapes internal double quotes by doubling them (" -> "") and wraps the cell in double quotes.
 *
 * Authoritative Oracle: tests/utils/test-helper.mjs (sanitizeCsvCellOracle)
 */
export function sanitizeCsvCell(val: unknown): string {
  if (val === null || val === undefined) return '""'
  let str = String(val)
  // Check formula injection prefix: =, +, -, @, \t, \r
  if (/^[=+\-@\t\r]/.test(str)) {
    str = "'" + str
  }
  // Escape internal double quotes by doubling them and wrap in double quotes
  return `"${str.replace(/"/g, '""')}"`
}
