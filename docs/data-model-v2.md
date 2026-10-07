# Data model v2 direction

## Current phase

The frontend continues to consume the existing backend order model. No Google Sheets schema change is required for the initial v2 release.

## Target model for a future backward-compatible backend phase

### Reservation case
- case/order identifier
- patient snapshot
- requester and requesting department
- ward/clinic
- priority
- need-by date
- version
- lifecycle timestamps

### Medication item
- stable drug/master identifier when available
- requested medication snapshot
- requested quantity and unit
- prescriber
- fulfillment source
- fulfillment state

### Fulfillment
Future quantities should be explicit:
- requested quantity
- reserved quantity
- ready/fulfilled quantity
- dispensed quantity
- remaining quantity

Potential fulfillment sources:
- IN_STOCK
- TRANSFER
- SPECIAL_PURCHASE
- BORROW
- OTHER / UNAVAILABLE

### Date semantics
The current `RequiredDate` should eventually be split into:
- NeedByDate
- ExpectedArrivalDate
- ReadyDate
- PickupAppointmentDate
- ActualPickupAt

## Important

These fields are design targets only. The initial v2 frontend must not require them until the original backend supports them.
