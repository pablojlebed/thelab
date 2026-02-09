import { writable } from 'svelte/store';

export type IncidentSeverity = "near-miss" | "minor" | "major" | "critical";
export type IncidentStatus = "open" | "investigating" | "closed" | "draft";

export type Incident = {
    id: string;
    title: string;
    location: string;
    description: string;
    severity: IncidentSeverity;
    date: string;
    status: IncidentStatus;
    reportedBy: string;
    isAutomated?: boolean; // Flag for system-generated reports
};

// Initial mock data
const initialIncidents: Incident[] = [
    {
        id: "1",
        title: "Glassware breakage",
        location: "Prep Room",
        description: "Beaker slipped during cleaning.",
        severity: "minor",
        date: "2024-02-08",
        status: "closed",
        reportedBy: "S. Chen"
    },
    {
        id: "2",
        title: "Chemical Spill",
        location: "Lab 3",
        description: "Large acid spill",
        severity: "major",
        date: "2026-02-09",
        status: "open",
        reportedBy: "System Test"
    }
];

function createSafetyStore() {
    const { subscribe, update, set } = writable<Incident[]>(initialIncidents);

    return {
        subscribe,
        addIncident: (incident: Omit<Incident, "id" | "date" | "status">) => {
            update(incidents => {
                const newIncident: Incident = {
                    ...incident,
                    id: `INC-${Date.now()}`,
                    date: new Date().toISOString().split('T')[0],
                    status: "open"
                };
                return [newIncident, ...incidents];
            });
        },
        addDraft: (draft: Partial<Incident>) => {
            update(incidents => {
                const newDraft: Incident = {
                    id: `DRAFT-${Date.now()}`,
                    title: draft.title || "Untitled Incident",
                    location: draft.location || "",
                    description: draft.description || "",
                    severity: draft.severity || "near-miss",
                    date: new Date().toISOString().split('T')[0],
                    status: "draft",
                    reportedBy: "System Automation",
                    isAutomated: true,
                    ...draft
                };
                return [newDraft, ...incidents];
            });
        },
        updateIncident: (id: string, updates: Partial<Incident>) => {
            update(incidents => incidents.map(inc =>
                inc.id === id ? { ...inc, ...updates } : inc
            ));
        },
        submitDraft: (id: string, updates: Partial<Incident>) => {
            update(incidents => incidents.map(inc => {
                if (inc.id === id) {
                    return {
                        ...inc,
                        ...updates,
                        status: "open", // Move from draft to open
                        isAutomated: false // No longer just a system generated draft
                    };
                }
                return inc;
            }));
        },
        resolveIncident: (id: string) => {
            update(incidents => incidents.map(inc =>
                inc.id === id ? { ...inc, status: "closed" } : inc
            ));
        }
    };
}

export const safetyStore = createSafetyStore();
