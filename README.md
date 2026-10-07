# BHH Reservation Med v2

Frontend v2 for **Bangkok Hospital Hat Yai Medication Reservation & Fulfillment**.

## Architecture

This repository is intentionally **frontend-only**. It uses the existing Google Apps Script Web App and Google Sheets backend from `JuiPharm/BHH_Reservation_Med`.

```
BHH_Reservation_Med_v2
  └─ Frontend / UX / workflow presentation
          │
          │ existing API contract
          ▼
BHH_Reservation_Med
  └─ Google Apps Script backend + Google Sheets
```

The original repository remains the backend source of truth. Do not copy or independently modify backend source in this repository.

## Current v2 scope

- BHH/BDMS-aligned responsive frontend
- Staff medication-reservation work queue
- Thai user-facing workflow/status labels
- Request create/edit/detail workflow
- Pharmacy operations and receiving workflow
- Appointment response and reschedule workflow
- Frontend contract, responsive, accessibility and storage-policy tests
- GitHub Pages deployment

## Backend compatibility

The v2 frontend initially preserves the current action names, request envelopes and backend data fields. See [docs/backend-compatibility.md](docs/backend-compatibility.md).

## Local checks

```bash
for file in frontend/js/*.js; do node --check "$file"; done
node --test tests/frontend/*.test.js
```

## Deployment

GitHub Pages publishes only `frontend/`. The workflow can use repository variable `APPS_SCRIPT_URL`; if absent, it falls back to the existing BHH backend deployment configured in the workflow.

## Development rule

Frontend UX can evolve independently. Any change that requires a new backend action, field, status, permission or sheet column must first be documented as a compatibility change and implemented in the original backend repository.
