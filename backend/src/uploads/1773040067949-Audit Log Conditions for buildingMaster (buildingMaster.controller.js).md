# Audit Log Conditions for buildingMaster.controller.js

This file lists the audit log branches added to `buildingMaster.controller.js`.

**getBuildingMasterList**
- **VIEW DENIED**: Clinic not found
  - entityType: CLINIC
  - action: VIEW
  - outcome: DENIED
  - userId: req.userId
  - clinicId: clinicId
  - metadata: { reason: 'Clinic not found' }
  - ipAddress: req.ipAddress

- **VIEW SUCCESS**: Building list retrieved
  - entityType: CLINIC
  - action: VIEW
  - outcome: SUCCESS
  - userId: req.userId
  - clinicId: clinicId
  - metadata: { count: buildingMasterList.length }
  - ipAddress: req.ipAddress

- **VIEW DENIED**: Building list not found
  - entityType: CLINIC
  - action: VIEW
  - outcome: DENIED
  - userId: req.userId
  - clinicId: clinicId
  - metadata: { reason: 'Building Master list not found' }
  - ipAddress: req.ipAddress

- **VIEW FAILED**: Exception during retrieval
  - entityType: CLINIC
  - action: VIEW
  - outcome: FAILED
  - userId: req.userId
  - clinicId: req.clinicId
  - metadata: { error }
  - ipAddress: req.ipAddress


**createBuildingMaster**
- **CREATE DENIED**: Clinic not found
  - entityType: CLINIC
  - action: CREATE
  - outcome: DENIED
  - userId: req.userId
  - clinicId: clinicId
  - attempt: req.body
  - metadata: { reason: 'Clinic not found' }
  - ipAddress: req.ipAddress

- **CREATE DENIED**: Building name already exists
  - entityType: CLINIC
  - action: CREATE
  - outcome: DENIED
  - attempt: req.body
  - metadata: { reason: `Building with name '...' already exists.` }
  - ipAddress: req.ipAddress

- **CREATE DENIED**: Building code already exists
  - entityType: CLINIC
  - action: CREATE
  - outcome: DENIED
  - attempt: req.body
  - metadata: { reason: `Building with code '...' already exists.` }
  - ipAddress: req.ipAddress

- **CREATE SUCCESS**: Building created
  - entityType: CLINIC
  - action: CREATE
  - outcome: SUCCESS
  - userId: req.userId
  - clinicId: clinicId
  - entityId: buildingMasterData._id
  - after: buildingMasterData
  - attempt: req.body
  - ipAddress: req.ipAddress

- **CREATE FAILED**: Exception during create
  - entityType: CLINIC
  - action: CREATE
  - outcome: FAILED
  - userId: req.userId
  - clinicId: req.clinicId
  - attempt: req.body
  - metadata: { error }
  - ipAddress: req.ipAddress


**getBuildingMasterById**
- **VIEW DENIED**: Clinic not found
  - entityType: CLINIC
  - action: VIEW
  - outcome: DENIED
  - clinicId: Types.ObjectId(clinicId)
  - metadata: { reason: 'Clinic not found' }
  - ipAddress: req.ipAddress

- **VIEW DENIED**: Building Master not found
  - entityType: CLINIC
  - action: VIEW
  - outcome: DENIED
  - clinicId: clinicId
  - metadata: { reason: 'Building Master not found' }
  - ipAddress: req.ipAddress

- **VIEW SUCCESS**: Building retrieved
  - entityType: CLINIC
  - action: VIEW
  - outcome: SUCCESS
  - userId: req.userId
  - clinicId: clinicId
  - entityId: buildingMaster._id
  - ipAddress: req.ipAddress

- **VIEW FAILED**: Exception during retrieval
  - entityType: CLINIC
  - action: VIEW
  - outcome: FAILED
  - userId: req.userId
  - clinicId: req.clinicId
  - metadata: { error }
  - ipAddress: req.ipAddress


**updateBuildingMaster**
- **UPDATE DENIED**: Clinic not found
  - entityType: CLINIC
  - action: UPDATE
  - outcome: DENIED
  - attempt: req.body
  - clinicId: clinicId
  - metadata: { reason: 'Clinic not found' }
  - ipAddress: req.ipAddress

- **UPDATE DENIED**: Building Master not found
  - entityType: CLINIC
  - action: UPDATE
  - outcome: DENIED
  - attempt: req.body
  - clinicId: clinicId
  - metadata: { reason: 'Building Master not found' }
  - ipAddress: req.ipAddress

- **UPDATE DENIED**: Duplicate building name
  - entityType: CLINIC
  - action: UPDATE
  - outcome: DENIED
  - attempt: req.body
  - clinicId: clinicId
  - metadata: { reason: `Building with name '...' already exists.` }
  - ipAddress: req.ipAddress

- **UPDATE DENIED**: Duplicate building code
  - entityType: CLINIC
  - action: UPDATE
  - outcome: DENIED
  - attempt: req.body
  - clinicId: clinicId
  - metadata: { reason: `Building with code '...' already exists.` }
  - ipAddress: req.ipAddress

- **UPDATE SUCCESS**: Building updated
  - entityType: CLINIC
  - action: UPDATE
  - outcome: SUCCESS
  - userId: req.userId
  - clinicId: clinicId
  - entityId: updatedBuildingMaster._id
  - before: buildingMasterData
  - after: updatedBuildingMaster
  - attempt: req.body
  - ipAddress: req.ipAddress

- **UPDATE FAILED**: Exception during update
  - entityType: CLINIC
  - action: UPDATE
  - outcome: FAILED
  - userId: req.userId
  - clinicId: req.clinicId
  - attempt: req.body
  - metadata: { error }
  - ipAddress: req.ipAddress


**deleteBuildingMaster**
- **UPDATE DENIED**: Clinic not found
  - entityType: CLINIC
  - action: UPDATE
  - outcome: DENIED
  - attempt: req.body
  - clinicId: clinicId
  - metadata: { reason: 'Clinic not found' }
  - ipAddress: req.ipAddress

- **UPDATE DENIED**: Building Master not found
  - entityType: CLINIC
  - action: UPDATE
  - outcome: DENIED
  - attempt: req.body
  - clinicId: clinicId
  - metadata: { reason: 'Building Master not found' }
  - ipAddress: req.ipAddress

- **UPDATE SUCCESS**: Building soft-deleted
  - entityType: CLINIC
  - action: UPDATE
  - outcome: SUCCESS
  - userId: req.userId
  - clinicId: clinicId
  - entityId: updatedBuildingMaster._id
  - before: buildingMaster
  - after: updatedBuildingMaster
  - attempt: req.body
  - ipAddress: req.ipAddress

- **UPDATE FAILED**: Exception during delete
  - entityType: CLINIC
  - action: UPDATE
  - outcome: FAILED
  - userId: req.userId
  - clinicId: req.clinicId
  - attempt: req.body
  - metadata: { error }
  - ipAddress: req.ipAddress

---

Notes:
- `attempt: req.body` is included for CREATE / UPDATE / FAILED branches only.
- `before` and `after` are present on UPDATE SUCCESS; `after` and `entityId` are present on CREATE SUCCESS.
- `userId`, `clinicId`, and `ipAddress` are recorded from the request context.
