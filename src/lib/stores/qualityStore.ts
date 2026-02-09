import { writable } from 'svelte/store';

export type NonConformity = {
    id: string;
    title: string;
    description: string;
    source: "safety" | "audit" | "customer";
    severity: "minor" | "major" | "critical";
    status: "open" | "investigating" | "closed";
    dateOpened: string;
    assignedTo?: string;
};

// Mock initial data
const initialNCs: NonConformity[] = [
    {
        id: "NC-2026-001",
        title: "Balance #4 calibration expired",
        description: "Analytical balance missed scheduled calibration by 3 days.",
        source: "audit",
        severity: "minor",
        status: "open",
        dateOpened: "2026-02-05",
        assignedTo: "QA Manager"
    },
    {
        id: "NC-2026-002",
        title: "Reagent lot tracking error",
        description: "Lot number for Nitric Acid not recorded in LIMS for Batch B-492.",
        source: "audit",
        severity: "minor",
        status: "investigating",
        dateOpened: "2026-02-07",
        assignedTo: "Lab Supervisor"
    }
];

function createQualityStore() {
    const { subscribe, update, set } = writable<NonConformity[]>(initialNCs);

    return {
        subscribe,
        addNC: (nc: Omit<NonConformity, "id" | "dateOpened" | "status">) => {
            update(ncs => {
                const newNC: NonConformity = {
                    ...nc,
                    id: `NC-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
                    dateOpened: new Date().toISOString().split('T')[0],
                    status: "open"
                };
                return [newNC, ...ncs];
            });
        },
        resolveNC: (id: string, status: "closed" | "investigating" = "closed") => {
            update(ncs => ncs.map(nc =>
                nc.id === id ? { ...nc, status } : nc
            ));
        }
    };
}

export const qualityStore = createQualityStore();
