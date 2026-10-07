# Workflow v2

## User-facing workflow

The frontend presents a simplified operational journey:

1. **รับคำขอ** — request submitted / under review
2. **จัดหา / รอยา** — ordering, transfer or partial receipt under the current backend model
3. **ยาพร้อม** — medication received and ready for notification
4. **นัดรับยา** — notified, rescheduled, no-show or pickup follow-up
5. **เสร็จสิ้น** — patient received / completed / cancelled

These stages are presentation layers over the existing backend statuses. They do not create new backend status values.

## Current compatibility mapping

| Backend status | v2 label | v2 stage |
|---|---|---|
| SUBMITTED | รอตรวจสอบ | รับคำขอ |
| UNDER_REVIEW | กำลังตรวจสอบ | รับคำขอ |
| ORDERED | อยู่ระหว่างจัดหา | จัดหา / รอยา |
| PARTIALLY_RECEIVED | ยาเข้าไม่ครบ | จัดหา / รอยา |
| RECEIVED | ยาครบแล้ว | ยาพร้อม |
| NOTIFIED | แจ้งพร้อมรับแล้ว | นัดรับยา |
| APPOINTMENT_RESCHEDULED | เลื่อนนัดแล้ว | นัดรับยา |
| PATIENT_NO_SHOW | ไม่มาตามนัด | นัดรับยา |
| PATIENT_RECEIVED | รับยาแล้ว | เสร็จสิ้น |
| COMPLETED | ปิดเคส | เสร็จสิ้น |
| CANCEL_REQUESTED | รอพิจารณายกเลิก | รับคำขอ |
| CANCEL_REJECTED | ไม่อนุมัติยกเลิก | รับคำขอ |
| PARTIALLY_CANCELLED | ยกเลิกบางรายการ | จัดหา / รอยา |
| CANCELLED | ยกเลิกแล้ว | เสร็จสิ้น |
| REJECTED | ไม่รับดำเนินการ | เสร็จสิ้น |

## Future domain target

Future backend evolution should separate case, fulfillment, pickup, notification and cancellation state instead of extending one status field indefinitely. That change is intentionally not part of the initial v2 bootstrap.
