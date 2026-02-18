export type DocumentType =
    | 'SOP'
    | 'Protocol'
    | 'Work Instruction'
    | 'Safety Data Sheet'
    | 'Calibration Record'
    | 'Form'
    | 'Certificate'
    | 'Policy';

export type DocumentStatus =
    | 'draft'
    | 'under-review'
    | 'approved'
    | 'obsolete'
    | 'superseded';

export type LabDocument = {
    id: string;             // e.g. DOC-2024-001
    title: string;
    type: DocumentType;
    version: string;        // e.g. "1.0", "2.3"
    status: DocumentStatus;
    author: string;
    reviewer?: string;
    approver?: string;
    description: string;
    tags: string[];
    created_at: string;     // ISO date string YYYY-MM-DD
    updated_at: string;
    effective_date?: string;
    review_due?: string;
};

export type DocumentRevision = {
    id: string;
    document_id: string;
    version: string;
    changed_by: string;
    changed_at: string;
    summary: string;
};
