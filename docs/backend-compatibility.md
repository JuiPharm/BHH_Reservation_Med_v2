# Backend compatibility contract

## Source of truth

Backend source of truth: `JuiPharm/BHH_Reservation_Med`.

BHH Reservation Med v2 must remain compatible with the currently deployed Apps Script API until a separately approved backend migration is released.

## Request envelope

The frontend preserves the existing envelope:

```json
{
  "action": "ACTION_NAME",
  "requestId": "opaque-id",
  "sessionToken": "opaque-session-token",
  "payload": {}
}
```

GET actions continue to send `action`, `requestId`, and serialized `payload` in the query string where supported by the existing backend.

## Compatibility rules

1. Do not rename an existing backend action from this repository alone.
2. Do not add a required request field unless the old backend already accepts it.
3. Do not remove fields that the backend validation requires.
4. Do not invent new backend status values in frontend code.
5. User-facing Thai labels may change without changing raw backend status values.
6. Backend authorization is authoritative even when navigation is hidden in the frontend.
7. Ambiguous network failures must preserve mutation request IDs for safe retry where the current flow already supports idempotency.
8. No patient-identifying values may be persisted in browser local storage.

## Existing action families used by the v2 client

- authentication/session
- staff dashboard
- order create/update/detail/change log/cancel
- admin dashboard
- purchase/fulfillment receiving
- email notification/retry
- appointment response
- reschedule reference/submission
- user administration
- master data

The exact action strings are covered by the frontend contract tests and existing modules.

## Change process

If v2 needs a new capability:
1. document it in `docs/migration-plan.md`;
2. add backward-compatible backend support in the original repository;
3. deploy/version-test the backend;
4. add frontend support here;
5. only then make the new behavior required.
