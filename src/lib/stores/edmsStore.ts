import { writable } from 'svelte/store';
import type { LabDocument, DocumentRevision } from '../edms/types';

const initialDocuments: LabDocument[] = [
    {
        id: 'DOC-2024-001',
        title: 'ICP-MS Standard Operating Procedure',
        type: 'SOP',
        version: '2.3',
        status: 'approved',
        author: 'Dr. S. Chen',
        reviewer: 'Dr. M. Rousseau',
        approver: 'Lab Director',
        description: 'Complete operating procedure for the Inductively Coupled Plasma Mass Spectrometer (ICP-MS Omega). Covers instrument startup, calibration standards, sample preparation, analysis sequence, data validation, and shutdown routine.',
        tags: ['ICP-MS', 'spectrometry', 'calibration', 'elemental'],
        created_at: '2022-03-15',
        updated_at: '2024-01-10',
        effective_date: '2024-01-15',
        review_due: '2025-01-15',
    },
    {
        id: 'DOC-2024-002',
        title: 'Chemical Spill Containment Protocol',
        type: 'Protocol',
        version: '2.1',
        status: 'approved',
        author: 'Safety Committee',
        reviewer: 'Dr. A. Moreau',
        approver: 'Safety Officer',
        description: 'Emergency response protocol for chemical spills in the laboratory. Classifies spill severity (minor / moderate / major), specifies PPE requirements per hazard class, and provides step-by-step containment, neutralisation, and disposal procedures.',
        tags: ['safety', 'emergency', 'chemical', 'spill'],
        created_at: '2023-06-01',
        updated_at: '2024-02-01',
        effective_date: '2024-02-15',
        review_due: '2025-02-15',
    },
    {
        id: 'DOC-2024-003',
        title: 'Fume Hood Safety Inspection Form',
        type: 'Form',
        version: '1.0',
        status: 'under-review',
        author: 'T. Nakamura',
        reviewer: 'Dr. S. Chen',
        description: 'Monthly inspection checklist for all laboratory fume hoods. Covers face velocity measurements, sash position indicators, interior cleanliness, alarm functionality, and service history logging.',
        tags: ['fume hood', 'inspection', 'safety', 'monthly'],
        created_at: '2024-11-20',
        updated_at: '2024-11-20',
        review_due: '2025-11-20',
    },
    {
        id: 'DOC-2024-004',
        title: 'Calibration Log Template — General Instruments',
        type: 'Calibration Record',
        version: '1.2',
        status: 'approved',
        author: 'Quality Assurance',
        reviewer: 'Dr. M. Rousseau',
        approver: 'Quality Manager',
        description: 'Standardised template for recording instrument calibration data. Compliant with ISO 17025:2017 §6.4 requirements for equipment records. Includes fields for uncertainty of measurement, traceability references, and calibration interval justification.',
        tags: ['calibration', 'ISO 17025', 'template', 'quality'],
        created_at: '2023-01-05',
        updated_at: '2024-03-01',
        effective_date: '2024-03-10',
        review_due: '2025-03-10',
    },
    {
        id: 'DOC-2025-005',
        title: 'HPLC Analysis Work Instruction — Pesticide Residues',
        type: 'Work Instruction',
        version: '1.0',
        status: 'draft',
        author: 'P. Lambert',
        reviewer: 'Dr. S. Chen',
        description: 'Step-by-step work instruction for HPLC-based analysis of pesticide residues in water samples. Drafted following updated method validation data. Pending peer review by the analytical team prior to submission for approval.',
        tags: ['HPLC', 'pesticides', 'water', 'analysis', 'method validation'],
        created_at: '2025-01-15',
        updated_at: '2025-01-15',
    },
    {
        id: 'DOC-2023-006',
        title: 'Laboratory Access and Security Policy',
        type: 'Policy',
        version: '3.0',
        status: 'approved',
        author: 'Administration',
        reviewer: 'Safety Officer',
        approver: 'Lab Director',
        description: 'Policy governing access to laboratory facilities. Covers visitor management, keycard authorisation levels, out-of-hours access, contractor escort requirements, and security incident reporting procedures.',
        tags: ['access', 'security', 'policy', 'visitors'],
        created_at: '2021-09-01',
        updated_at: '2023-09-01',
        effective_date: '2023-09-15',
        review_due: '2026-03-15',
    },
    {
        id: 'DOC-2024-007',
        title: 'Ethanol 95% — Safety Data Sheet',
        type: 'Safety Data Sheet',
        version: '1.5',
        status: 'approved',
        author: 'Chemical Supplier (Ref)',
        reviewer: 'Safety Committee',
        description: 'Safety Data Sheet for Ethanol 95% as per GHS/REACH regulations. Includes hazard identification (H225, H319), first aid measures, firefighting procedures, accidental release handling, storage conditions, and disposal guidance.',
        tags: ['SDS', 'ethanol', 'reagent', 'GHS', 'flammable'],
        created_at: '2022-11-10',
        updated_at: '2024-04-01',
        effective_date: '2024-04-01',
        review_due: '2025-04-01',
    },
    {
        id: 'DOC-2026-010',
        title: 'CAPA Process — Corrective and Preventive Action',
        type: 'SOP',
        version: '1.0',
        status: 'approved',
        author: 'Quality Assurance',
        reviewer: 'Lab Manager',
        approver: 'Lab Director',
        description: 'Defines the five-stage CAPA workflow (Identified → Investigation → Action Plan → Verification → Closed), role responsibilities, priority guidance, and how the TheLab CAPA Kanban board is used to track corrective and preventive actions end-to-end.',
        tags: ['CAPA', 'corrective action', 'preventive action', 'quality', 'non-conformance', 'workflow'],
        created_at: '2026-02-18',
        updated_at: '2026-02-18',
        effective_date: '2026-02-18',
        review_due: '2027-02-18',
    },
    {
        id: 'DOC-2026-009',
        title: 'Document Management Process',
        type: 'Policy',
        version: '1.0',
        status: 'approved',
        author: 'Quality Assurance',
        reviewer: 'Lab Manager',
        approver: 'Lab Director',
        description: 'Defines the end-to-end lifecycle of controlled documents within TheLab EDMS — from initial drafting through peer review, formal approval, and eventual retirement. Specifies the responsibilities of Authors, Reviewers, and Approvers, versioning conventions, and audit trail requirements.',
        tags: ['EDMS', 'document control', 'process', 'policy', 'workflow', 'QA'],
        created_at: '2026-02-18',
        updated_at: '2026-02-18',
        effective_date: '2026-02-18',
        review_due: '2027-02-18',
    },
    {
        id: 'DOC-2023-008',
        title: 'Centrifuge Maintenance Protocol — Beckman Avanti J-26',
        type: 'Protocol',
        version: '1.1',
        status: 'obsolete',
        author: 'Dr. A. Moreau',
        description: 'Quarterly maintenance protocol for the Beckman Coulter Avanti J-26 centrifuge. Instrument was decommissioned in December 2023. Document retained for audit trail purposes.',
        tags: ['centrifuge', 'maintenance', 'decommissioned'],
        created_at: '2021-05-20',
        updated_at: '2023-12-01',
    },
];

const initialRevisions: DocumentRevision[] = [
    { id: 'REV-001', document_id: 'DOC-2024-001', version: '2.3', changed_by: 'Dr. S. Chen', changed_at: '2024-01-10', summary: 'Updated calibration frequency to daily for high-throughput mode. Added instrument startup checklist (Appendix A).' },
    { id: 'REV-002', document_id: 'DOC-2024-001', version: '2.2', changed_by: 'Dr. S. Chen', changed_at: '2023-06-15', summary: 'Revised sample preparation section to reduce cross-contamination risk. Updated internal standard concentrations.' },
    { id: 'REV-003', document_id: 'DOC-2024-001', version: '2.1', changed_by: 'Dr. M. Rousseau', changed_at: '2022-11-01', summary: 'Initial major revision following external ISO 17025 audit recommendations. Added measurement uncertainty annex.' },
    { id: 'REV-004', document_id: 'DOC-2024-002', version: '2.1', changed_by: 'Safety Committee', changed_at: '2024-02-01', summary: 'Added PPE requirements for concentrated acid spills. Updated emergency contact list and spill kit locations.' },
    { id: 'REV-005', document_id: 'DOC-2024-004', version: '1.2', changed_by: 'Quality Assurance', changed_at: '2024-03-01', summary: 'Added fields for expanded measurement uncertainty and calibration traceability chain per ISO 17025:2017 §6.4.6.' },
    { id: 'REV-006', document_id: 'DOC-2024-004', version: '1.1', changed_by: 'Quality Assurance', changed_at: '2023-04-10', summary: 'Corrected date format inconsistency in column headers. Added digital signature field for approver.' },
    { id: 'REV-007', document_id: 'DOC-2026-009', version: '1.0', changed_by: 'Quality Assurance', changed_at: '2026-02-18', summary: 'Initial release. Defines document lifecycle, roles, versioning rules, and audit trail requirements for the TheLab EDMS.' },
    { id: 'REV-008', document_id: 'DOC-2026-010', version: '1.0', changed_by: 'Quality Assurance', changed_at: '2026-02-18', summary: 'Initial release. Defines the five-stage CAPA workflow, role responsibilities, priority guidance, and integration with the TheLab Kanban board.' },
];

let docCounter = 11;

function createEdmsStore() {
    const { subscribe, update } = writable<LabDocument[]>(initialDocuments);
    const revStore = writable<DocumentRevision[]>(initialRevisions);

    return {
        subscribe,
        revisions: { subscribe: revStore.subscribe },

        addDocument: (doc: Omit<LabDocument, 'id' | 'created_at' | 'updated_at' | 'status'>) => {
            update(docs => {
                const year = new Date().getFullYear();
                const id = `DOC-${year}-${String(docCounter++).padStart(3, '0')}`;
                const today = new Date().toISOString().split('T')[0];
                const newDoc: LabDocument = {
                    ...doc,
                    id,
                    status: 'draft',
                    created_at: today,
                    updated_at: today,
                };
                return [newDoc, ...docs];
            });
        },

        updateDocument: (id: string, updates: Partial<LabDocument>, revisionSummary?: string) => {
            const today = new Date().toISOString().split('T')[0];
            update(docs => docs.map(d => {
                if (d.id !== id) return d;
                const updated = { ...d, ...updates, updated_at: today };
                if (revisionSummary) {
                    revStore.update(revs => [{
                        id: `REV-${Date.now()}`,
                        document_id: id,
                        version: updated.version,
                        changed_by: updated.author,
                        changed_at: today,
                        summary: revisionSummary,
                    }, ...revs]);
                }
                return updated;
            }));
        },

        submitForReview: (id: string) => {
            update(docs => docs.map(d =>
                d.id === id ? { ...d, status: 'under-review', updated_at: new Date().toISOString().split('T')[0] } : d
            ));
        },

        approve: (id: string, approver: string) => {
            const today = new Date().toISOString().split('T')[0];
            const reviewDue = new Date();
            reviewDue.setFullYear(reviewDue.getFullYear() + 1);
            update(docs => docs.map(d =>
                d.id === id
                    ? { ...d, status: 'approved', approver, effective_date: today, review_due: reviewDue.toISOString().split('T')[0], updated_at: today }
                    : d
            ));
        },

        requestChanges: (id: string) => {
            update(docs => docs.map(d =>
                d.id === id ? { ...d, status: 'draft', updated_at: new Date().toISOString().split('T')[0] } : d
            ));
        },

        markObsolete: (id: string) => {
            update(docs => docs.map(d =>
                d.id === id ? { ...d, status: 'obsolete', updated_at: new Date().toISOString().split('T')[0] } : d
            ));
        },

        getRevisions: (documentId: string): DocumentRevision[] => {
            let revs: DocumentRevision[] = [];
            revStore.subscribe(r => { revs = r.filter(rv => rv.document_id === documentId); })();
            return revs;
        },
    };
}

export const edmsStore = createEdmsStore();
export type { LabDocument, DocumentRevision };
