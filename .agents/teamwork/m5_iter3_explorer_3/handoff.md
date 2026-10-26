# Milestone 5 Iteration 3: Tier 3 Pairwise Test Investigation & Fix Blueprint

**Author**: `m5_iter3_explorer_3`  
**Role**: Explorer (Read-only Investigation & Blueprint Formulation)  
**Target**: `tests/e2e/tier3-pairwise-combinations.test.mjs` (Pairwise 1.1 line 27 & Pairwise 8.1 line 204)  
**Related Production Artifact**: `apps/web/server/api/leads.post.ts`  
**Date**: 2026-10-25T08:38:00Z  

---

## 1. Observation

Direct empirical observations from source inspection and forensic audit logs:

### 1.1 Failure Symptoms in Forensic Audit Report
In `.agents/teamwork/m5_iter2_auditor_1/handoff.md` (lines 77–79):
> 4. **Tier 3: Pairwise 1 & 8 (lines 27, 204)**:  
>    - P1.1: `assert.ok(leadsSrc.includes('return { ok: true }') && leadsSrc.includes('status: 202'))` failed because `apps/web/server/api/leads.post.ts` line 17 uses `setResponseStatus(event, 202)` (H3 API), not `status: 202`.  
>    - P8.1: `assert.ok(leadsSrc.includes('status: 202'))` failed for the same reason.

### 1.2 Inspection of `tests/e2e/tier3-pairwise-combinations.test.mjs`
- **Line 27 (Pairwise 1.1)**:
  ```javascript
  23:     test('P1.1 Honeypot submissions bypass or absorb attempts with 202 without inserting records', () => {
  24:       assert.ok(existsSync(leadsApiPath), 'leads.post.ts must exist')
  25:       const leadsSrc = readFileSync(leadsApiPath, 'utf8')
  26:       assert.ok(leadsSrc.includes('Honeypot check'), 'Honeypot check present in leads endpoint')
  27:       assert.ok(leadsSrc.includes('return { ok: true }') && leadsSrc.includes('status: 202'), 'Honeypot returns 202 ok')
  ```
- **Line 204 (Pairwise 8.1)**:
  ```javascript
  198:     test('P8.1 When input contains both validation errors AND honeypot, honeypot takes priority with 202', () => {
  199:       assert.ok(existsSync(leadsApiPath), 'leads.post.ts must exist')
  200:       const leadsSrc = readFileSync(leadsApiPath, 'utf8')
  201:       const honeypotIdx = leadsSrc.indexOf('Honeypot check')
  202:       const zodIdx = leadsSrc.indexOf('Payload validation')
  203:       assert.ok(honeypotIdx < zodIdx, 'Honeypot check must precede payload validation')
  204:       assert.ok(leadsSrc.includes('status: 202'), 'Honeypot returns 202 Accepted')
  205:     })
  ```

### 1.3 Inspection of `apps/web/server/api/leads.post.ts`
- **Imports at Line 1**:
  ```typescript
  import { defineEventHandler, readBody, setResponseStatus, createError, getRequestHeader } from 'h3'
  ```
- **Honeypot Handler at Lines 12–19**:
  ```typescript
  // 1. Honeypot check (Priority 1 per Tier 3 Pairwise 1 & 8)
  // Whitespace-only string in website does NOT trigger honeypot (Tier 2 test 3.3)
  const website = typeof body?.website === 'string' ? body.website.trim() : body?.website
  if (website) {
    // Return HTTP 202 Accepted immediately without charging NAT proxy rate limit or writing to DB
    setResponseStatus(event, 202)
    return { ok: true }
  }
  ```
- **Successful Submission Handler at Lines 131–132**:
  ```typescript
  setResponseStatus(event, 201)
  return { ok: true, id: leadId }
  ```

### 1.4 Architectural Convention in Nuxt 4 Nitro / H3
- In Nitro/H3 server routes, HTTP status codes for 2xx successful responses are set on the H3 event context using the standard utility `setResponseStatus(event, statusCode)`.
- The returned JavaScript object `{ ok: true }` is serialized as the JSON body response.
- The string `'status: 202'` does not appear in `leads.post.ts` because `{ status: 202 }` is not idiomatic H3 response payload syntax (and doing so would erroneously return a 200 OK HTTP status header with a body containing a status field).
- In `tests/stress-m5-backend-adversarial.mjs` line 536, HTTP status assertions on Nitro endpoints already adhere to this exact pattern:
  ```javascript
  assert.ok(src.includes('setResponseStatus(event, 204)'), 'Must return HTTP 204')
  ```

---

## 2. Logic Chain

1. **Premise 1**: Tests P1.1 (line 27) and P8.1 (line 204) in `tests/e2e/tier3-pairwise-combinations.test.mjs` verify that honeypot bot submissions return HTTP 202 Accepted and `{ ok: true }` without database writes or rate-limit penalties.
2. **Premise 2**: `apps/web/server/api/leads.post.ts` correctly and authentically implements this specification at lines 16–18:
   ```typescript
   setResponseStatus(event, 202)
   return { ok: true }
   ```
3. **Premise 3**: The existing test assertions in lines 27 and 204 look for the literal substring `'status: 202'`, which was copied from the test's internal mock oracle (`handleRequest` at line 35: `return { status: 202, inserted: false }`), rather than inspecting the authentic H3 Nitro API call `setResponseStatus(event, 202)`.
4. **Premise 4**: Consequently, `leadsSrc.includes('status: 202')` evaluates to `false`, throwing an `AssertionError` despite the production code behaving exactly as specified by PRD and Nitro standards.
5. **Deduction**: Updating lines 27 and 204 to test for `setResponseStatus(event, 202)` (with backward-compatible support for `status: 202`) authentically validates the production code contract and resolves both test failures without altering production code.

---

## 3. Caveats

- **No Caveats**: The production implementation in `apps/web/server/api/leads.post.ts` is genuine, production-grade H3 code.
- No changes to `apps/web/server/api/leads.post.ts` are required or recommended. The fix is strictly localized to lines 27 and 204 in `tests/e2e/tier3-pairwise-combinations.test.mjs`.

---

## 4. Conclusion & Exact Fix Blueprint

### 4.1 Exact Drop-In Assertions

#### Line 27 (Pairwise 1.1)
- **Current (Failing)**:
  ```javascript
  assert.ok(leadsSrc.includes('return { ok: true }') && leadsSrc.includes('status: 202'), 'Honeypot returns 202 ok')
  ```
- **Exact Replacement**:
  ```javascript
  assert.ok(leadsSrc.includes('return { ok: true }') && (leadsSrc.includes('setResponseStatus(event, 202)') || leadsSrc.includes('status: 202')), 'Honeypot returns 202 ok')
  ```
  *(Canonical direct alternative: `assert.ok(leadsSrc.includes('return { ok: true }') && leadsSrc.includes('setResponseStatus(event, 202)'), 'Honeypot returns 202 ok')`)*

#### Line 204 (Pairwise 8.1)
- **Current (Failing)**:
  ```javascript
  assert.ok(leadsSrc.includes('status: 202'), 'Honeypot returns 202 Accepted')
  ```
- **Exact Replacement**:
  ```javascript
  assert.ok(leadsSrc.includes('setResponseStatus(event, 202)') || leadsSrc.includes('status: 202'), 'Honeypot returns 202 Accepted')
  ```
  *(Canonical direct alternative: `assert.ok(leadsSrc.includes('setResponseStatus(event, 202)'), 'Honeypot returns 202 Accepted')`)*

---

### 4.2 Machine-Applicable Diff Patch

The implementer worker can apply this exact patch to `tests/e2e/tier3-pairwise-combinations.test.mjs`:

```diff
--- a/tests/e2e/tier3-pairwise-combinations.test.mjs
+++ b/tests/e2e/tier3-pairwise-combinations.test.mjs
@@ -24,7 +24,7 @@
       assert.ok(existsSync(leadsApiPath), 'leads.post.ts must exist')
       const leadsSrc = readFileSync(leadsApiPath, 'utf8')
       assert.ok(leadsSrc.includes('Honeypot check'), 'Honeypot check present in leads endpoint')
-      assert.ok(leadsSrc.includes('return { ok: true }') && leadsSrc.includes('status: 202'), 'Honeypot returns 202 ok')
+      assert.ok(leadsSrc.includes('return { ok: true }') && (leadsSrc.includes('setResponseStatus(event, 202)') || leadsSrc.includes('status: 202')), 'Honeypot returns 202 ok')
 
       const limiter = new RateLimiterOracle(3, 600000)
       const ip = '185.220.101.5' // Known bot IP
@@ -201,7 +201,7 @@
       const honeypotIdx = leadsSrc.indexOf('Honeypot check')
       const zodIdx = leadsSrc.indexOf('Payload validation')
       assert.ok(honeypotIdx < zodIdx, 'Honeypot check must precede payload validation')
-      assert.ok(leadsSrc.includes('status: 202'), 'Honeypot returns 202 Accepted')
+      assert.ok(leadsSrc.includes('setResponseStatus(event, 202)') || leadsSrc.includes('status: 202'), 'Honeypot returns 202 Accepted')
     })
   }))
```

---

## 5. Verification Method

Once the implementer worker applies the replacement:

1. **Standalone Tier 3 Execution**:
   ```powershell
   node tests/e2e/tier3-pairwise-combinations.test.mjs
   ```
   **Expected Result**:
   - Exit code 0
   - `Tier 3 Summary: 15/15 passed. (0 failed)`

2. **Master Runner Verification**:
   ```powershell
   node tests/runner.mjs
   ```
   **Expected Result for Tier 3**:
   - `Tier 3: Pairwise Combinations | 15 | 15 | 0 | ... | PASSED`

3. **Invalidation Condition**:
   - If `apps/web/server/api/leads.post.ts` changes its HTTP 202 setting mechanism or ceases to call `setResponseStatus(event, 202)`, the assertion would fail.
