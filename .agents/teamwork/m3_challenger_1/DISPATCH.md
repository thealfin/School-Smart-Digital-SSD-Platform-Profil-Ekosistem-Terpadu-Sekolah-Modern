# DISPATCH — m3_challenger_1

**Agent**: `m3_challenger_1`  
**Role**: `teamwork_preview_challenger` (Backend API Security & Data Validation Stress Challenger)  
**Parent / Dispatcher**: `orchestrator_1` (`1ff91f96-3422-4423-9647-7ab08609ae2d`)  
**Working Directory**: `d:\All Project Website\Web School Smart Digital\.agents\teamwork\m3_challenger_1`  

## Objective
Author and execute an empirical adversarial stress test suite targeting Milestone 3 backend APIs, security boundaries, and data sanitization logic.

## Mandatory Input Documents (READ FIRST)
1. `d:\All Project Website\Web School Smart Digital\ORIGINAL_REQUEST.md` (Mandatory - read first!)
2. `d:\All Project Website\Web School Smart Digital\.agents\teamwork\orchestrator_1\PROJECT.md`
3. `d:\All Project Website\Web School Smart Digital\TEST_READY.md`
4. `d:\All Project Website\Web School Smart Digital\.agents\teamwork\m3_worker_2\handoff.md`

## Testing Scope & Instructions
Author and run a dedicated empirical stress script (e.g., `tests/stress-m3-backend.mjs`):
1. **Honeypot Bot Trap**:
   - Verify that submitting a lead payload with a non-empty `website` field triggers immediate HTTP 202 Accepted, bypasses database write, and does NOT consume the client's rate limit quota.
2. **IP Rate Limiter Sliding Window**:
   - Verify that 3 consecutive requests from the same IP succeed (or fail only on validation), but the 4th request within 10 minutes strictly receives HTTP 429 Too Many Requests.
   - Verify that different IPs (different hash salts) have independent quotas.
3. **CSV Formula Injection Sanitization**:
   - Test `sanitizeCsvCell` with malicious payloads:
     - `=cmd|' /C calc'!A0` -> starts with `'=`
     - `+1+2` -> starts with `'+`
     - `-10` -> starts with `'-`
     - `@SUM(A1:A10)` -> starts with `'@`
     - `\tTAB` -> starts with `'\t`
     - `\rRETURN` -> starts with `'\r`
     - Double quote escaping: `John "The Boss"` -> `"John ""The Boss"""`
4. **Anti-Enumeration Timing & Scrypt Security**:
   - Verify constant-time dummy verification behavior when querying non-existent email addresses.
   - Verify invalid password rejection with uniform error message.
5. **Phone Normalization Parity**:
   - Test `normalizeWa` with diverse inputs: `08123456789`, `+62 812 3456 789`, `62-812-3456-789` -> all normalize to `628123456789`. Invalid lengths (< 10 digits or non-Indonesian) must fail validation.
6. Verify master test runner `node tests/runner.mjs` remains 100% passing.

## Output Requirements
Write `handoff.md` in your working directory (`d:\All Project Website\Web School Smart Digital\.agents\teamwork\m3_challenger_1\handoff.md`) with:
- **Verdict**: Explicit `APPROVE` or `REJECT`
- **Observation**: Test code written, test assertions executed, pass/fail counts
- **Logic Chain**: Security evaluation reasoning
- **Conclusion**: Summary statement

Deliver by sending a message to parent `1ff91f96-3422-4423-9647-7ab08609ae2d` when complete.

## 2026-10-25T06:33:51Z
You are m3_challenger_1, an API security and data validation stress challenger for Milestone 3.
Your working directory is: d:\All Project Website\Web School Smart Digital\.agents\teamwork\m3_challenger_1
Read d:\All Project Website\Web School Smart Digital\.agents\teamwork\m3_challenger_1\DISPATCH.md for your full task.

MANDATORY INPUT DOCUMENTS (READ FIRST):
1. d:\All Project Website\Web School Smart Digital\ORIGINAL_REQUEST.md
2. d:\All Project Website\Web School Smart Digital\.agents\teamwork\orchestrator_1\PROJECT.md
3. d:\All Project Website\Web School Smart Digital\TEST_READY.md
4. d:\All Project Website\Web School Smart Digital\.agents\teamwork\m3_worker_2\handoff.md

Empirically stress-test:
1. Honeypot bot trap (HTTP 202 on populated website, 0 DB insert, 0 rate limit cost).
2. IP rate limiter sliding window (3 req / 10 min window; 4th request receives 429).
3. CSV formula injection escaping (=, +, -, @, \t, \r).
4. Anti-enumeration timing defense & scrypt password verification.
5. Phone normalization with normalizeWa.

Write a stress test script, run it, verify edge cases, and deliver your verdict (APPROVE or REJECT) in d:\All Project Website\Web School Smart Digital\.agents\teamwork\m3_challenger_1\handoff.md. Send a message back to parent 1ff91f96-3422-4423-9647-7ab08609ae2d.
