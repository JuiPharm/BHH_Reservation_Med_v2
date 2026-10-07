# Migration plan

## Phase 0 — Bootstrap frontend-only repository
- preserve old backend and data
- copy tested v2 frontend
- add independent CI
- deploy separate GitHub Pages site

## Phase 1 — UAT with existing backend
Test:
- STAFF and ADMIN login
- create multi-item request
- edit/version conflict
- dashboard filters/search
- purchase/receiving
- partial receipt and complete receipt
- email notification
- cancellation approve/reject
- appointment response
- no-show/reschedule
- mobile/tablet/desktop

## Phase 2 — Backward-compatible backend extensions
Implement in the original backend repository first:
- Drug Master identifiers/search support
- clearer date fields
- fulfillment/source fields
- reservation/allocation quantities
- more granular pharmacy roles

During this phase the old frontend should continue to function where practical.

## Phase 3 — v2 domain activation
After backend support is deployed and tested:
- enable new v2 controls
- derive operational queues from structured fulfillment data
- introduce Need action / Waiting supply / Ready / Pickup today / Overdue views
- add SLA and operational KPI reporting

## Phase 4 — Backend architecture refactor
Only after the domain stabilizes:
- split large OrderService responsibilities
- preserve audit and idempotency
- improve operational logging
- improve quota/reminder monitoring

Refactoring before domain stabilization is intentionally avoided.
