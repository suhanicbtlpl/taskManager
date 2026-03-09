# Audit Log Conditions for bed.controller.js

This file lists the audit log branches added to `bed.controller.js`.

**createBed**
- **CREATE DENIED**: Clinic not found
  - entityType: CLINIC
  - action: CREATE
  - outcome: DENIED
  - userId: req.userId
  - clinicId: req.clinicId
  - attempt: req.body
  - metadata: { reason: 'Clinic not found' }
  - ipAddress: req.ipAddress

- **CREATE DENIED**: Duplicate bed in same Dept/Floor/Building
  - entityType: CLINIC
  - action: CREATE
  - outcome: DENIED
  - attempt: req.body
  - metadata: { reason: `Bed '<name>' already exists...` }
  - ipAddress: req.ipAddress

- **CREATE SUCCESS**: Bed created
  - entityType: CLINIC
  - action: CREATE
  - outcome: SUCCESS
  - userId: req.userId
  - clinicId: req.clinicId
  - entityId: doc._id
  - after: doc
  - attempt: req.body
  - ipAddress: req.ipAddress

- **CREATE FAILED**: Exception during create
  - entityType: CLINIC
  - action: CREATE
  - outcome: FAILED
  - userId: req.userId
  - clinicId: req.clinicId
  - attempt: req.body
  - metadata: { error: error.message }
  - ipAddress: req.ipAddress


**getBedListByRoomId**
- **VIEW DENIED**: Clinic not found
  - entityType: CLINIC
  - action: VIEW
  - outcome: DENIED
  - clinicId: req.clinicId
  - metadata: { reason: 'Clinic not found' }
  - ipAddress: req.ipAddress

- **VIEW SUCCESS**: Beds retrieved
  - entityType: CLINIC
  - action: VIEW
  - outcome: SUCCESS
  - userId: req.userId
  - clinicId: req.clinicId
  - metadata: { count: list.length }
  - ipAddress: req.ipAddress

- **VIEW DENIED**: Beds not found
  - entityType: CLINIC
  - action: VIEW
  - outcome: DENIED
  - metadata: { reason: 'Beds not found' }
  - ipAddress: req.ipAddress

- **VIEW FAILED**: Exception during retrieval
  - entityType: CLINIC
  - action: VIEW
  - outcome: FAILED
  - userId: req.userId
  - clinicId: req.clinicId
  - metadata: { error: error.message }
  - ipAddress: req.ipAddress


**getBedById**
- **VIEW DENIED**: Clinic not found
  - entityType: CLINIC
  - action: VIEW
  - outcome: DENIED
  - clinicId: req.clinicId
  - metadata: { reason: 'Clinic not found' }
  - ipAddress: req.ipAddress

- **VIEW DENIED**: Bed not found
  - entityType: CLINIC
  - action: VIEW
  - outcome: DENIED
  - metadata: { reason: 'Bed not found' }
  - ipAddress: req.ipAddress

- **VIEW SUCCESS**: Bed retrieved
  - entityType: CLINIC
  - action: VIEW
  - outcome: SUCCESS
  - userId: req.userId
  - clinicId: req.clinicId
  - entityId: doc._id
  - ipAddress: req.ipAddress

- **VIEW FAILED**: Exception during retrieval
  - entityType: CLINIC
  - action: VIEW
  - outcome: FAILED
  - userId: req.userId
  - clinicId: req.clinicId
  - metadata: { error: error.message }
  - ipAddress: req.ipAddress


**updateBed**
- **UPDATE DENIED**: Clinic not found
  - entityType: CLINIC
  - action: UPDATE
  - outcome: DENIED
  - attempt: req.body
  - clinicId: req.clinicId
  - metadata: { reason: 'Clinic not found' }
  - ipAddress: req.ipAddress

- **UPDATE DENIED**: Bed not found
  - entityType: CLINIC
  - action: UPDATE
  - outcome: DENIED
  - attempt: req.body
  - metadata: { reason: 'Bed not found' }
  - ipAddress: req.ipAddress

- **UPDATE DENIED**: Duplicate bed
  - entityType: CLINIC
  - action: UPDATE
  - outcome: DENIED
  - attempt: req.body
  - metadata: { reason: `Bed '<name>' already exists...` }
  - ipAddress: req.ipAddress

- **UPDATE SUCCESS**: Bed updated
  - entityType: CLINIC
  - action: UPDATE
  - outcome: SUCCESS
  - userId: req.userId
  - clinicId: req.clinicId
  - entityId: updated._id
  - before: existing
  - after: updated
  - attempt: req.body
  - ipAddress: req.ipAddress

- **UPDATE FAILED**: Exception during update
  - entityType: CLINIC
  - action: UPDATE
  - outcome: FAILED
  - userId: req.userId
  - clinicId: req.clinicId
  - attempt: req.body
  - metadata: { error: error.message }
  - ipAddress: req.ipAddress


**deleteBed**
- **UPDATE DENIED**: Clinic not found
  - entityType: CLINIC
  - action: UPDATE
  - outcome: DENIED
  - attempt: req.body
  - clinicId: req.clinicId
  - metadata: { reason: 'Clinic not found' }
  - ipAddress: req.ipAddress

- **UPDATE DENIED**: Bed not found
  - entityType: CLINIC
  - action: UPDATE
  - outcome: DENIED
  - attempt: req.body
  - metadata: { reason: 'Bed not found' }
  - ipAddress: req.ipAddress

- **UPDATE SUCCESS**: Bed soft-deleted
  - entityType: CLINIC
  - action: UPDATE
  - outcome: SUCCESS
  - userId: req.userId
  - clinicId: req.clinicId
  - entityId: softDeleted._id
  - before: doc
  - after: softDeleted
  - attempt: req.body
  - ipAddress: req.ipAddress

- **UPDATE FAILED**: Exception during delete
  - entityType: CLINIC
  - action: UPDATE
  - outcome: FAILED
  - userId: req.userId
  - clinicId: req.clinicId
  - attempt: req.body
  - metadata: { error: error.message }
  - ipAddress: req.ipAddress

---

Notes:
- `attempt: req.body` included for CREATE / UPDATE / FAILED branches only.
- `before` and `after` present on UPDATE SUCCESS; `after` and `entityId` present on CREATE SUCCESS.
- `userId`, `clinicId`, and `ipAddress` recorded from request context.
