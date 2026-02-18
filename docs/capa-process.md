# CAPA Process — Corrective and Preventive Action

## What is CAPA?

A **Corrective and Preventive Action (CAPA)** is a structured response to a non-conformance, deviation, near-miss, complaint, audit finding, or any situation where something went wrong or could go wrong. CAPAs ensure that root causes are properly identified, actions are taken to fix the issue, and measures are put in place so it does not recur.

- **Corrective Action** — addresses a problem that has already occurred.
- **Preventive Action** — addresses a potential problem before it occurs.

---

## The CAPA Board in TheLab

CAPAs in TheLab are tracked on a dedicated **Kanban board** accessible from the CAPA tab in the navigation. Each CAPA is represented as a card that moves through five stages from left to right. Cards can be dragged between columns or updated via the detail view.

Each CAPA card captures:
- **Title** — a short description of the issue
- **Owner** — the person responsible for driving the CAPA forward
- **Description** — full details of the non-conformance or potential risk
- **Priority** — Low / Medium / High / Critical
- **Due date** — target completion date
- **Comments** — threaded notes and updates added by any team member

---

## The Five Stages

### 1. Identified
**Column: Identified**
**Responsible: Reporter**

A new CAPA is opened as soon as a non-conformance, deviation, complaint, or risk is identified. The reporter creates a card with a clear title, a description of what happened (or what could happen), an assigned owner, a priority level, and a target due date.

Entry criteria: An event or risk has been observed and documented.
Exit criteria: The CAPA card is created and an owner is assigned.

---

### 2. Investigation
**Column: Investigation**
**Responsible: Owner (+ relevant team members)**

The owner investigates the root cause of the issue. Common tools include 5-Why analysis, fishbone (Ishikawa) diagrams, or fault tree analysis. The investigation findings are added to the card description or comments.

This stage answers the question: *Why did this happen?*

Entry criteria: Root cause investigation has started.
Exit criteria: Root cause is identified and documented in the card.

---

### 3. Action Plan
**Column: Action Plan**
**Responsible: Owner + Lab Manager**

Based on the root cause, the owner defines specific corrective and/or preventive actions. Actions should be SMART (Specific, Measurable, Achievable, Relevant, Time-bound). The plan is documented in the card and reviewed by the Lab Manager before execution begins.

This stage answers the question: *What are we going to do about it?*

Entry criteria: Root cause is confirmed and an action plan has been defined.
Exit criteria: Action plan is approved and execution is underway or complete.

---

### 4. Verification
**Column: Verification**
**Responsible: Reviewer / QA Officer**

The actions defined in the previous stage have been implemented. The reviewer independently checks that the actions were carried out as planned and that they are effective — i.e., the root cause has been addressed and the issue is unlikely to recur. Objective evidence (test results, records, re-audit) is documented in the comments.

This stage answers the question: *Did the actions actually work?*

Entry criteria: All planned actions have been implemented.
Exit criteria: Effectiveness verified with objective evidence.

---

### 5. Closed
**Column: Closed**
**Responsible: Lab Manager / QA Officer**

The CAPA is formally closed once verification is complete and satisfactory. If verification reveals that actions were insufficient, the card is moved back to Action Plan for revision. A closed CAPA remains visible on the board for reference and audit purposes.

Entry criteria: Verification is complete and effective.
Exit criteria: CAPA is closed and dated.

---

## Roles and Responsibilities Summary

| Role | Responsibilities |
|---|---|
| **Reporter** | Identifies the issue and opens the CAPA card with sufficient detail |
| **Owner** | Drives the CAPA through all stages; responsible for investigation and action implementation |
| **Lab Manager** | Reviews and approves the action plan; decides on closure |
| **Reviewer / QA Officer** | Independently verifies effectiveness before closure |
| **Team members** | Contribute to investigation and add comments/evidence throughout |

---

## Priority Guidance

| Priority | When to use |
|---|---|
| **Critical** | Immediate risk to safety, data integrity, or regulatory compliance |
| **High** | Significant impact on quality or operations; must be addressed within 2 weeks |
| **Medium** | Moderate impact; target resolution within 30 days |
| **Low** | Minor deviation or improvement opportunity; resolve within 90 days |

---

## Using the CAPA Board

1. **Open a new CAPA**: Click **+ New CAPA** in the top right of the CAPA tab. Fill in the title, owner, description, priority, and due date.
2. **Move a card**: Drag and drop a card to the next column when the stage is complete, or open the card and change its status.
3. **Add evidence and notes**: Click a card to open the detail view. Use the **Comments** section to log investigation findings, decisions, and evidence as the CAPA progresses.
4. **Filter the board**: Use the search bar or assignee filter at the top to focus on specific CAPAs.
5. **Close a CAPA**: Drag the card to **Closed** once verification is confirmed by the QA Officer or Lab Manager.

---

## Relationship with the EDMS

If a CAPA results in a new or revised controlled document (e.g., an updated SOP or protocol), the document change must be processed through the EDMS following the standard document management process. The CAPA card should reference the affected document ID in its description or comments.
