Audit Log Conditions for bpe (bpe.controller.js)

Audit Log Conditions for getBpeList

1. Missing patientId
Action: VIEW
Outcome: DENIED
Metadata: { reason: "PATIENT_ID_REQUIRED" }
userId: value
entityType: CLINICAL_RECORD

Sample Log:
{
  "entityType": "CLINICAL_RECORD",
  "action": "VIEW",
  "outcome": "DENIED",
  "metadata": { "reason": "PATIENT_ID_REQUIRED" },
  "ipAddress": req.ipAddress,
  "userId": req.userId
}

2. Clinic not found (list)
Action: VIEW
Outcome: DENIED
Metadata: { reason: "CLINIC_NOT_FOUND" }
userId: value
entityType: CLINICAL_RECORD

3. BPE list retrieved
Action: VIEW
Outcome: SUCCESS
Metadata: { count, patientId }
userId: value
entityType: CLINICAL_RECORD

4. No BPE found
Action: VIEW
Outcome: SUCCESS
Metadata: { count: 0, patientId }
userId: value
entityType: CLINICAL_RECORD

5. System error (list)
Action: VIEW
Outcome: FAILED
Metadata: { error }
userId: value
entityType: CLINICAL_RECORD

---

Audit Log Conditions for createBpe

1. Clinic not found (create)
Action: CREATE
Outcome: DENIED
attempt: req.body
Metadata: { reason: "CLINIC_NOT_FOUND" }
userId: value
entityType: CLINICAL_RECORD

2. BPE created successfully
Action: CREATE
Outcome: SUCCESS
attempt: req.body
after: created document
entityId: value
patientId: value
userId: value
entityType: CLINICAL_RECORD

3. System error (create)
Action: CREATE
Outcome: FAILED
attempt: req.body
Metadata: { error }
userId: value
entityType: CLINICAL_RECORD

---

Audit Log Conditions for getBpeById

1. Clinic not found (get)
Action: VIEW
Outcome: DENIED
Metadata: { reason: "CLINIC_NOT_FOUND" }
userId: value
entityType: CLINICAL_RECORD

2. BPE not found
Action: VIEW
Outcome: DENIED
Metadata: { reason: "BPE_NOT_FOUND", bpeId }
userId: value
entityType: CLINICAL_RECORD

3. BPE retrieved
Action: VIEW
Outcome: SUCCESS
Metadata: { bpeId }
patientId: value
entityId: value
userId: value
entityType: CLINICAL_RECORD

4. System error (get)
Action: VIEW
Outcome: FAILED
Metadata: { error }
userId: value
entityType: CLINICAL_RECORD

---

Audit Log Conditions for updateBpe

1. Clinic not found (update)
Action: UPDATE
Outcome: DENIED
entityId: bpeId
attempt: req.body
Metadata: { reason: "CLINIC_NOT_FOUND" }
userId: value
entityType: CLINICAL_RECORD

2. BPE not found (update)
Action: UPDATE
Outcome: DENIED
entityId: bpeId
attempt: req.body
Metadata: { reason: "BPE_NOT_FOUND" }
userId: value
entityType: CLINICAL_RECORD

3. BPE updated successfully
Action: UPDATE
Outcome: SUCCESS
entityId: bpeId
before: previous document
attempt: req.body
after: updated document
patientId: value
userId: value
entityType: CLINICAL_RECORD

4. System error (update)
Action: UPDATE
Outcome: FAILED
attempt: req.body
Metadata: { error }
userId: value
entityType: CLINICAL_RECORD

---

Audit Log Conditions for deleteBpe

1. Clinic not found (delete)
Action: DELETE
Outcome: DENIED
entityId: bpeId
attempt: {}
Metadata: { reason: "CLINIC_NOT_FOUND" }
userId: value
entityType: CLINICAL_RECORD

2. BPE not found (delete)
Action: DELETE
Outcome: DENIED
entityId: bpeId
attempt: {}
Metadata: { reason: "BPE_NOT_FOUND" }
userId: value
entityType: CLINICAL_RECORD

3. BPE soft-deleted
Action: DELETE
Outcome: SUCCESS
entityId: bpeId
before: previous document
attempt: {}
after: softDeleted document
patientId: value
userId: value
entityType: CLINICAL_RECORD

4. System error (delete)
Action: DELETE
Outcome: FAILED
attempt: {}
Metadata: { error }
userId: value
entityType: CLINICAL_RECORD
