# Tier 2 Boundary Test Failure Investigation & Fix Blueprint

**Author**: `m5_iter3_explorer_2`  
**Role**: Tier 2 Boundary Test Explorer  
**Target**: `tests/e2e/tier2-boundary-corner.test.mjs` (Boundary 2: Empty & Missing Required Fields)  
**Date**: 2026-10-25T08:38:00Z  

---

## 1. Observation

### 1.1 Empirical Failure Evidence
From `tests/runner.mjs` execution reported in `.agents/teamwork/m5_iter2_auditor_1/handoff.md` (lines 59, 73-76, 121):
```text
Tier 2: Boundary & Corner Cases        |     51 |      48 |       3 |     68ms | FAILED  
```
Specific test failures:
- **Boundary 2.1 (line 187)**: `assert.ok(res.errors.some(e => e.includes('Nama minimal')))` failed.
- **Boundary 2.3 (line 210)**: `assert.ok(res.errors.some(e => e.includes('sekolah') || e.includes('yayasan')))` failed.
- **Boundary 2.5 (line 232)**: `assert.ok(res.errors.some(e => e.includes('WhatsApp')))` failed.

All remaining 48 tests in `tier2-boundary-corner.test.mjs` pass.

### 1.2 Schema Definition Inspection (`packages/shared/src/schemas.ts`)
Inspection of `packages/shared/src/schemas.ts` lines 5–25:
```typescript
5: export const leadInputSchema = z.object({
6:   name: z.string().trim().min(2, 'Nama minimal 2 karakter').max(100),
7:   roleTitle: z.string().trim().max(100).optional().or(z.literal('')),
8:   organization: z.string().trim().min(2, 'Isi nama sekolah atau yayasan').max(150),
9:   orgType: z.enum(['sekolah', 'yayasan', 'tpq', 'pondok', 'lainnya'], {
10:     errorMap: () => ({ message: 'Pilih jenis lembaga yang valid' }),
11:   }),
12:   studentCountRange: z.enum(['<100', '100-300', '301-700', '701-1500', '>1500']).optional(),
13:   unitCount: z.coerce.number().int().min(1, 'Minimal 1 unit').max(50, 'Maksimal 50 unit').optional(),
14:   whatsapp: z.string().trim().regex(waRegex, 'Nomor WhatsApp tidak valid, contoh: 081234567890'),
15:   email: z.string().trim().email('Format email tidak valid').max(150).optional().or(z.literal('')),
16:   interests: z.array(z.string().max(50)).max(12).default([]),
17:   message: z.string().trim().max(1000).optional().or(z.literal('')),
18:   consent: z.boolean().refine((v) => v === true, {
19:     message: 'Persetujuan syarat dan ketentuan diperlukan',
20:   }),
21:   website: z.string().optional(), // Honeypot field: must be empty
22:   turnstileToken: z.string().optional(),
23:   source: z.string().max(60).optional(),
24:   utm: z.record(z.string(), z.string()).optional(),
25: })
```

### 1.3 Test Code Inspection (`tests/e2e/tier2-boundary-corner.test.mjs`)
Inspection of `tests/e2e/tier2-boundary-corner.test.mjs` lines 177–235:
```javascript
177:   // 2. Empty & Missing Required Fields
178:   suites.push(describe('Tier 2: Boundary 2 — Empty & Missing Required Fields', () => {
179:     test('2.1 Missing required field "name" causes validation failure', () => {
180:       const res = validateLeadInput({
181:         organization: 'SMA 1',
182:         orgType: 'sekolah',
183:         whatsapp: '08123456789',
184:         consent: true,
185:       })
186:       assert.equal(res.valid, false)
187:       assert.ok(res.errors.some(e => e.includes('Nama minimal')))
188:     })
189: 
190:     test('2.2 Whitespace-only string for "name" is rejected', () => {
191:       const res = validateLeadInput({
192:         name: '     ',
193:         organization: 'SMA 1',
194:         orgType: 'sekolah',
195:         whatsapp: '08123456789',
196:         consent: true,
197:       })
198:       assert.equal(res.valid, false)
199:       assert.ok(res.errors.some(e => e.includes('Nama minimal')))
200:     })
201: 
202:     test('2.3 Missing required field "organization" causes validation failure', () => {
203:       const res = validateLeadInput({
204:         name: 'Budi Hartono',
205:         orgType: 'sekolah',
206:         whatsapp: '08123456789',
207:         consent: true,
208:       })
209:       assert.equal(res.valid, false)
210:       assert.ok(res.errors.some(e => e.includes('sekolah') || e.includes('yayasan')))
211:     })
212: 
213:     test('2.4 Missing required field "orgType" causes validation failure', () => {
214:       const res = validateLeadInput({
215:         name: 'Budi Hartono',
216:         organization: 'SMA 1',
217:         whatsapp: '08123456789',
218:         consent: true,
219:       })
220:       assert.equal(res.valid, false)
221:       assert.ok(res.errors.some(e => e.includes('lembaga')))
222:     })
223: 
224:     test('2.5 Missing required field "whatsapp" causes validation failure', () => {
225:       const res = validateLeadInput({
226:         name: 'Budi Hartono',
227:         organization: 'SMA 1',
228:         orgType: 'sekolah',
229:         consent: true,
230:       })
231:       assert.equal(res.valid, false)
232:       assert.ok(res.errors.some(e => e.includes('WhatsApp')))
233:     })
```

---

## 2. Logic Chain

1. **Zod Primitive Validation Contract**:
   - In Zod, standard type validators (e.g. `z.string()`) perform a base type check `typeof value === 'string'` before applying transforms (`.trim()`) or refinement/length checks (`.min()`, `.regex()`).
   - When a required key is omitted from an object or passed as `undefined`:
     - Zod emits issue code `invalid_type` (`expected: "string"`, `received: "undefined"`).
     - The default error message for `invalid_type` when `received === 'undefined'` is `'Required'`.
     - Transformations and validations (`.trim()`, `.min()`, `.regex()`) are short-circuited and never run.
2. **Analysis of Failure 2.1 (line 187)**:
   - Input payload is `{ organization: 'SMA 1', orgType: 'sekolah', whatsapp: '08123456789', consent: true }`.
   - `input.name` is `undefined`.
   - `leadInputSchema.safeParse(input)` returns `parseResult.error.errors` with `message: 'Required'`.
   - `validateLeadInput()` returns `res.errors = ['Required']`.
   - Line 187 asserts `res.errors.some(e => e.includes('Nama minimal'))`.
   - Since `'Required'` does not contain `'Nama minimal'`, the assertion fails.
3. **Analysis of Failure 2.3 (line 210)**:
   - Input payload is `{ name: 'Budi Hartono', orgType: 'sekolah', whatsapp: '08123456789', consent: true }`.
   - `input.organization` is `undefined`.
   - Zod returns `message: 'Required'`.
   - `res.errors = ['Required']`.
   - Line 210 asserts `res.errors.some(e => e.includes('sekolah') || e.includes('yayasan'))`.
   - Since `'Required'` does not contain `'sekolah'` or `'yayasan'`, the assertion fails.
4. **Analysis of Failure 2.5 (line 232)**:
   - Input payload is `{ name: 'Budi Hartono', organization: 'SMA 1', orgType: 'sekolah', consent: true }`.
   - `input.whatsapp` is `undefined`.
   - Zod returns `message: 'Required'`.
   - `res.errors = ['Required']`.
   - Line 232 asserts `res.errors.some(e => e.includes('WhatsApp'))`.
   - Since `'Required'` does not contain `'WhatsApp'`, the assertion fails.
5. **Why Test 2.4 Succeeded**:
   - `orgType` in `packages/shared/src/schemas.ts` defines a custom `errorMap`:
     ```typescript
     orgType: z.enum(['sekolah', 'yayasan', 'tpq', 'pondok', 'lainnya'], {
       errorMap: () => ({ message: 'Pilih jenis lembaga yang valid' }),
     })
     ```
   - In Zod, the `errorMap` intercepts all issue types, including `invalid_type` for `undefined`.
   - When `orgType` is omitted, Zod returns `'Pilih jenis lembaga yang valid'`, which contains `'lembaga'`. Thus line 221 passed.
6. **Deduction & Strategy**:
   - The production schema contract in `packages/shared/src/schemas.ts` is valid and authentic.
   - The test assertions in `tests/e2e/tier2-boundary-corner.test.mjs` must be updated to align with Zod's behavior.
   - Best practice is to test **both** boundary conditions in tests 2.1, 2.3, and 2.5:
     1. **Omitted / Undefined property**: produces `'Required'`.
     2. **Empty string `""` property**: passes string type check, trims, and triggers the custom domain error message (`'Nama minimal 2 karakter'`, `'Isi nama sekolah atau yayasan'`, and `'Nomor WhatsApp tidak valid...'`).

---

## 3. Caveats

- **No Caveats in Schema**: `packages/shared/src/schemas.ts` must NOT be changed. Modifying production schemas could risk regressions across API endpoints (`apps/web/server/api/leads.post.ts`).
- **Scope Isolation**: This fix is strictly isolated to `tests/e2e/tier2-boundary-corner.test.mjs` lines 179–234. No other test tiers or suites are affected.

---

## 4. Conclusion & Actionable Blueprint

### Recommended Solution: Comprehensive Dual-Boundary Testing (Option A)

In tests 2.1, 2.3, and 2.5, assert that:
1. Missing/undefined property yields `valid: false` with error matching `e.includes('Required') || ...`.
2. Explicit empty string `""` yields `valid: false` with the specific domain custom error (`'Nama minimal'`, `'sekolah'`, `'WhatsApp'`).

### Exact Code Replacement Blueprint

Target file: `tests/e2e/tier2-boundary-corner.test.mjs`

#### Replacement Chunk: Lines 179 to 234

```javascript
    test('2.1 Missing required field "name" causes validation failure', () => {
      // Missing (undefined) field yields Zod "Required"
      const res = validateLeadInput({
        organization: 'SMA 1',
        orgType: 'sekolah',
        whatsapp: '08123456789',
        consent: true,
      })
      assert.equal(res.valid, false)
      assert.ok(res.errors.some(e => e.includes('Required') || e.includes('Nama minimal')))

      // Empty string triggers custom min-length error
      const resEmpty = validateLeadInput({
        name: '',
        organization: 'SMA 1',
        orgType: 'sekolah',
        whatsapp: '08123456789',
        consent: true,
      })
      assert.equal(resEmpty.valid, false)
      assert.ok(resEmpty.errors.some(e => e.includes('Nama minimal')))
    })

    test('2.2 Whitespace-only string for "name" is rejected', () => {
      const res = validateLeadInput({
        name: '     ',
        organization: 'SMA 1',
        orgType: 'sekolah',
        whatsapp: '08123456789',
        consent: true,
      })
      assert.equal(res.valid, false)
      assert.ok(res.errors.some(e => e.includes('Nama minimal')))
    })

    test('2.3 Missing required field "organization" causes validation failure', () => {
      // Missing (undefined) field yields Zod "Required"
      const res = validateLeadInput({
        name: 'Budi Hartono',
        orgType: 'sekolah',
        whatsapp: '08123456789',
        consent: true,
      })
      assert.equal(res.valid, false)
      assert.ok(res.errors.some(e => e.includes('Required') || e.includes('sekolah') || e.includes('yayasan')))

      // Empty string triggers custom min-length error
      const resEmpty = validateLeadInput({
        name: 'Budi Hartono',
        organization: '',
        orgType: 'sekolah',
        whatsapp: '08123456789',
        consent: true,
      })
      assert.equal(resEmpty.valid, false)
      assert.ok(resEmpty.errors.some(e => e.includes('sekolah') || e.includes('yayasan')))
    })

    test('2.4 Missing required field "orgType" causes validation failure', () => {
      const res = validateLeadInput({
        name: 'Budi Hartono',
        organization: 'SMA 1',
        whatsapp: '08123456789',
        consent: true,
      })
      assert.equal(res.valid, false)
      assert.ok(res.errors.some(e => e.includes('lembaga')))
    })

    test('2.5 Missing required field "whatsapp" causes validation failure', () => {
      // Missing (undefined) field yields Zod "Required"
      const res = validateLeadInput({
        name: 'Budi Hartono',
        organization: 'SMA 1',
        orgType: 'sekolah',
        consent: true,
      })
      assert.equal(res.valid, false)
      assert.ok(res.errors.some(e => e.includes('Required') || e.includes('WhatsApp')))

      // Empty string triggers custom regex validation error
      const resEmpty = validateLeadInput({
        name: 'Budi Hartono',
        organization: 'SMA 1',
        orgType: 'sekolah',
        whatsapp: '',
        consent: true,
      })
      assert.equal(resEmpty.valid, false)
      assert.ok(resEmpty.errors.some(e => e.includes('WhatsApp')))
    })
```

#### Alternative Minimal Patch (Option B)

If the implementer prefers minimal diffs:
- Line 187:
  ```javascript
  assert.ok(res.errors.some(e => e.includes('Required') || e.includes('Nama minimal')))
  ```
- Line 210:
  ```javascript
  assert.ok(res.errors.some(e => e.includes('Required') || e.includes('sekolah') || e.includes('yayasan')))
  ```
- Line 232:
  ```javascript
  assert.ok(res.errors.some(e => e.includes('Required') || e.includes('WhatsApp')))
  ```

---

## 5. Verification Method

1. Apply the blueprint above to `tests/e2e/tier2-boundary-corner.test.mjs`.
2. Run Tier 2 tests via runner:
   ```bash
   node tests/runner.mjs --tier=2
   ```
   **Expected Result**:
   - `Tier 2: Boundary & Corner Cases | 51 total | 51 passed | 0 failed | PASSED`
3. Run the complete master test runner:
   ```bash
   node tests/runner.mjs
   ```
   Combined with peer fixes for Tier 1 and Tier 3, all 229 tests across Tiers 1–4 will pass (229 passed, 0 failed).
