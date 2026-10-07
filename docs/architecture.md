# Architecture

## Goal

BHH Reservation Med v2 provides a safer, clearer operational frontend for patient-specific medication reservation and fulfillment while continuing to use the existing Apps Script / Google Sheets backend.

## Runtime

```
Browser
  │
  ├─ static HTML/CSS/ES modules on GitHub Pages
  │
  └─ HTTPS request envelope
          │
          ▼
Existing Google Apps Script Web App
          │
          ├─ authentication/session
          ├─ authorization
          ├─ order workflow
          ├─ appointment/reminder
          ├─ email notification
          └─ audit/idempotency
                  │
                  ▼
             Google Sheets
```

## Repository boundary

This repository owns:
- frontend presentation and interaction
- status-to-user-language mapping
- responsive/accessibility behavior
- frontend validation before submission
- frontend test contracts
- GitHub Pages deployment

The original `BHH_Reservation_Med` repository owns:
- Apps Script source
- sheet schema
- server-side validation
- authorization
- business state transitions
- idempotency and version enforcement
- email/appointment jobs
- audit logs

## Security boundary

Frontend role-based visibility is convenience only. Server-side authorization remains authoritative.

Patient/order data must not be placed in persistent browser storage or embedded in static assets. Session storage is limited to the bounded non-patient identity/session contract already supported by the backend.
