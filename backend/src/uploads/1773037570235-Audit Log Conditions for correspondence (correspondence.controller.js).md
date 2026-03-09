Audit Log Conditions for getCorrespondence (correspondence.controller.js)

1. Validation Failure - patientId missing
Action: VIEW
Outcome: DENIED
Metadata: { reason: "PATIENT_ID_REQUIRED" }
userId: req.userId or SYSTEM
entityType: CORRESPONDENCE

Sample Log:
{
  "userId": "<req.userId>",
  "clinicId": "<req.clinicId>",
  "entityType": "CORRESPONDENCE",
  "action": "VIEW",
  "outcome": "DENIED",
  "metadata": { "reason": "PATIENT_ID_REQUIRED" },
  "ipAddress": "<req.ipAddress>"
}

2. Clinic Not Found
Action: VIEW
Outcome: DENIED
Metadata: { reason: "CLINIC_NOT_FOUND" }
userId: req.userId or SYSTEM
entityType: CLINIC

Sample Log:
{
  "userId": "<req.userId>",
  "clinicId": "<req.clinicId>",
  "entityType": "CLINIC",
  "action": "VIEW",
  "outcome": "DENIED",
  "metadata": { "reason": "CLINIC_NOT_FOUND" },
  "ipAddress": "<req.ipAddress>"
}

3. View Success
Action: VIEW
Outcome: SUCCESS
Metadata: { count: <number>, totalRecords: <number> }
userId: req.userId
entityType: CORRESPONDENCE

Sample Log:
{
  "userId": "<req.userId>",
  "clinicId": "<clinicId>",
  "entityType": "CORRESPONDENCE",
  "action": "VIEW",
  "outcome": "SUCCESS",
  "metadata": { "count": 5, "totalRecords": 12 },
  "ipAddress": "<req.ipAddress>"
}

4. View Failed (catch)
Action: VIEW
Outcome: FAILED
Metadata: { error: error.message }
userId: req.userId or SYSTEM
entityType: CORRESPONDENCE

Sample Log:
{
  "userId": "<req.userId>",
  "clinicId": "<req.clinicId>",
  "entityType": "CORRESPONDENCE",
  "action": "VIEW",
  "outcome": "FAILED",
  "metadata": { "error": "<error.message>" },
  "ipAddress": "<req.ipAddress>"
}
