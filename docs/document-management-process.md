# Document Management Process

## Overview

This document describes the lifecycle of controlled documents within TheLab's Electronic Document Management System (EDMS), from initial creation through approval and eventual retirement.

---

## Document Types

| Type | Description |
|---|---|
| SOP | Standard Operating Procedure — step-by-step instructions for routine tasks |
| Protocol | Experimental or study protocols defining scope and methodology |
| Work Instruction | Granular task-level guidance supporting SOPs |
| Safety Data Sheet | Hazard and safety information for chemicals and materials |
| Calibration Record | Records of instrument calibration and validation |
| Form | Templates for data collection and reporting |
| Certificate | Certificates of analysis, competency, or compliance |
| Policy | High-level organizational rules and directives |

---

## Roles and Responsibilities

| Role | Who | Responsibilities |
|---|---|---|
| **Author** | Scientist, technician, or process owner | Drafts the document, ensures technical accuracy, addresses review feedback |
| **Reviewer** | Peer or subject-matter expert | Reviews for technical correctness, completeness, and clarity; may request changes |
| **Approver** | Lab manager, QA officer, or department head | Gives final approval; accountable for the document's regulatory and operational compliance |

---

## Document Lifecycle

```
[Draft] → [Under Review] → [Approved] → [Obsolete]
                 ↓
          [Changes Requested] → back to Author → [Under Review]
```

### 1. Draft

- **Who**: Author
- **What**: The author creates the document in the EDMS, filling in the title, type, version, description, and relevant metadata (reviewer, review due date, tags).
- **Entry criteria**: A need for a new or revised document has been identified.
- **Exit criteria**: The author is satisfied the document is complete and ready for review.

### 2. Submit for Review

- **Who**: Author
- **What**: The author submits the document, changing its status to **Under Review**. The assigned reviewer is notified.
- **Note**: Once submitted, the document cannot be edited without the reviewer requesting changes first.

### 3. Under Review

- **Who**: Reviewer
- **What**: The reviewer reads the document and either:
  - **Approves it** (if they also hold approver rights), advancing it to *Approved*; or
  - **Requests changes**, returning it to the author with comments; or
  - **Escalates** to a designated Approver for final sign-off.
- **Target turnaround**: As defined by the review due date set at document creation.

### 4. Changes Requested

- **Who**: Author (acts on reviewer feedback)
- **What**: The author revises the document and re-submits for review. Each resubmission creates a new revision entry in the audit trail.

### 5. Approved

- **Who**: Approver
- **What**: The Approver formally approves the document. It becomes the current controlled version, effective immediately or on the specified effective date.
- **Effect**: The document is now active and must be followed. Any previous version of the same document is automatically marked **Superseded**.

### 6. Obsolete

- **Who**: Lab manager or QA officer
- **What**: When a document is no longer needed (superseded by a new version, process retired, etc.), it is marked **Obsolete**. It is retained in the system for audit and historical reference but is no longer in active use.

---

## Versioning

- New documents start at version **1.0**.
- Minor revisions (corrections, clarifications): increment the minor number (1.0 → 1.1).
- Major revisions (scope changes, significant process changes): increment the major number (1.0 → 2.0).
- Each version change that goes through the review cycle is recorded in the revision history with a summary of changes.

---

## Audit Trail

Every status change, edit, and approval is logged automatically in the revision history. Each entry records:

- Version number
- Who made the change
- Date and time
- Summary of what changed

This trail is read-only and cannot be altered.

---

## Quick Reference

| Action | Performed by |
|---|---|
| Create document | Author |
| Submit for review | Author |
| Request changes | Reviewer |
| Approve document | Approver |
| Mark as obsolete | Lab manager / QA officer |
