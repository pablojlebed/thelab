<script lang="ts">
    import {
        ShieldAlert,
        AlertTriangle,
        AlertCircle,
        Clock,
        Calendar,
        MapPin,
        CheckCircle,
        XCircle,
        Flame,
        Glasses,
        ClipboardCheck,
        TrendingDown,
        FileText,
    } from "lucide-svelte";
    import ReportModal from "./ReportModal.svelte";
    import { qualityStore } from "../stores/qualityStore";
    import { exportToCSV } from "../utils/export";

    import { safetyStore, type Incident } from "../stores/safetyStore";

    // Subscribe to store
    $: recentIncidents = $safetyStore.filter((i) => i.status !== "draft");
    $: draftIncidents = $safetyStore.filter((i) => i.status === "draft");

    type ComplianceItem = {
        id: string;
        title: string;
        dueDate: Date;
        type: "audit" | "inspection" | "drill";
        icon: typeof ClipboardCheck;
    };

    // Compliance countdown items
    const complianceItems: ComplianceItem[] = [
        {
            id: "1",
            title: "ISO 17025 Internal Audit",
            dueDate: new Date("2026-03-15"),
            type: "audit",
            icon: ClipboardCheck,
        },
        {
            id: "2",
            title: "PPE Inspection",
            dueDate: new Date("2026-02-20"),
            type: "inspection",
            icon: Glasses,
        },
        {
            id: "3",
            title: "Fire Drill",
            dueDate: new Date("2026-02-28"),
            type: "drill",
            icon: Flame,
        },
    ];

    // Lab zones for heatmap
    const labZones = [
        {
            id: "lab1",
            name: "Lab 1 (Radium)",
            x: 20,
            y: 20,
            w: 120,
            h: 80,
            alertLevel: 0,
        },
        {
            id: "lab2",
            name: "Lab 2 (Analysis)",
            x: 160,
            y: 20,
            w: 100,
            h: 80,
            alertLevel: 0,
        },
        {
            id: "lab3",
            name: "Lab 3 (Synthesis)",
            x: 280,
            y: 20,
            w: 100,
            h: 80,
            alertLevel: 1,
        },
        {
            id: "storage-a",
            name: "Storage A",
            x: 20,
            y: 120,
            w: 80,
            h: 60,
            alertLevel: 0,
        },
        {
            id: "storage-b",
            name: "Storage B",
            x: 120,
            y: 120,
            w: 80,
            h: 60,
            alertLevel: 0,
        },
        {
            id: "office",
            name: "Offices",
            x: 220,
            y: 120,
            w: 160,
            h: 60,
            alertLevel: 0,
        },
    ];

    // Subscribe to store

    function getDaysUntil(date: Date): number {
        const now = new Date();
        const diff = date.getTime() - now.getTime();
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    }

    function getSeverityStyle(severity: Incident["severity"]) {
        switch (severity) {
            case "near-miss":
                return "bg-blue-100 text-blue-700 border-blue-200";
            case "minor":
                return "bg-amber-100 text-amber-700 border-amber-200";
            case "major":
            case "critical":
                return "bg-red-100 text-red-700 border-red-200";
        }
    }

    function getStatusStyle(status: Incident["status"]) {
        switch (status) {
            case "closed":
                return "text-emerald-600";
            case "investigating":
                return "text-amber-600";
            case "open":
            case "draft":
                return "text-red-600";
        }
    }

    function getZoneColor(alertLevel: number) {
        if (alertLevel === 0) return "fill-emerald-100 stroke-emerald-300";
        if (alertLevel === 1) return "fill-amber-100 stroke-amber-400";
        return "fill-red-100 stroke-red-400";
    }

    let selectedReportType: "near-miss" | "minor" | "major" | "critical" =
        "near-miss";
    let isReportModalOpen = false;

    function openReportModal(
        type: "near-miss" | "minor" | "major" | "critical",
    ) {
        selectedReportType = type;
        isReportModalOpen = true;
    }

    function handleReportSubmit(event: CustomEvent<Incident>) {
        const incident = event.detail;

        // Automatic NC generation for Major, Critical, or certain High-Risk Near Misses
        if (incident.severity === "major" || incident.severity === "critical") {
            qualityStore.addNC({
                title: `Safety Incident: ${incident.title}`,
                description: `Automatic NC generated from Safety Module. ${incident.description}`,
                severity: "major",
                source: "safety",
                assignedTo: "Safety Officer",
            });
        }

        // Add to safety store
        safetyStore.addIncident(incident);
    }

    function handleDraftSubmit(draft: Incident) {
        // Open modal with draft details
        selectedReportType = draft.severity;
        // We need to pass draft data to modal, but ReportModal might need updates or we handle it via a new prop or by pre-filling store
        // For now, let's assume ReportModal can accept initial data or we just simulate it
        // Simpler: Just resolve the draft directly for this MVP
        safetyStore.submitDraft(draft.id, {});

        // Trigger NC if needed
        if (draft.severity === "major" || draft.severity === "critical") {
            qualityStore.addNC({
                title: `Safety Incident: ${draft.title}`,
                description: `Automatic NC generated from Safety Module. ${draft.description}`,
                severity: "major",
                source: "safety",
                assignedTo: "Safety Officer",
            });
        }
    }
</script>

<ReportModal
    isOpen={isReportModalOpen}
    type={selectedReportType}
    on:close={() => (isReportModalOpen = false)}
    on:submit={handleReportSubmit}
/>

<div class="space-y-6">
    <!-- Header Actions -->
    <div class="flex justify-end gap-3">
        <button
            onclick={() => exportToCSV(recentIncidents, "safety_incidents")}
            class="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2"
        >
            <FileText size={16} />
            Export Data
        </button>
        <button
            onclick={() => openReportModal("near-miss")}
            class="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium shadow-sm hover:bg-indigo-700 shadow-indigo-200 transition-all"
        >
            New Entry
        </button>
    </div>

    <!-- Stats Row -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="card-pastel p-5 flex items-center gap-4">
            <div
                class="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center"
            >
                <ShieldAlert class="w-6 h-6 text-emerald-600" />
            </div>
            <div>
                <p class="text-sm text-slate-500">Safety Status</p>
                <p class="text-xl font-bold text-emerald-600">All Clear</p>
            </div>
        </div>
        <div class="card-pastel p-5 flex items-center gap-4">
            <div
                class="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center"
            >
                <TrendingDown class="w-6 h-6 text-blue-600" />
            </div>
            <div>
                <p class="text-sm text-slate-500">Days Since Incident</p>
                <p class="text-xl font-bold text-slate-800">42</p>
            </div>
        </div>
        <div class="card-pastel p-5 flex items-center gap-4">
            <div
                class="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center"
            >
                <AlertTriangle class="w-6 h-6 text-amber-600" />
            </div>
            <div>
                <p class="text-sm text-slate-500">Open Reports</p>
                <p class="text-xl font-bold text-slate-800">
                    {$safetyStore.filter((i) => i.status === "open").length}
                </p>
            </div>
        </div>
        <div class="card-pastel p-5 flex items-center gap-4">
            <div
                class="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center"
            >
                <Calendar class="w-6 h-6 text-indigo-600" />
            </div>
            <div>
                <p class="text-sm text-slate-500">Next Audit</p>
                <p class="text-xl font-bold text-slate-800">
                    {getDaysUntil(complianceItems[0].dueDate)} days
                </p>
            </div>
        </div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column: Reporting & Compliance -->
        <div class="space-y-6">
            <!-- Tiered Reporting -->
            <div class="card-pastel p-6">
                <h3
                    class="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-4"
                >
                    Report an Incident
                </h3>
                <div class="space-y-3">
                    <button
                        onclick={() => openReportModal("near-miss")}
                        class="w-full flex items-center gap-3 p-4 rounded-xl border-2 border-blue-200 bg-blue-50 hover:bg-blue-100 hover:border-blue-300 transition-all group"
                    >
                        <div
                            class="w-10 h-10 rounded-lg bg-blue-200 flex items-center justify-center group-hover:scale-110 transition-transform"
                        >
                            <AlertCircle class="w-5 h-5 text-blue-700" />
                        </div>
                        <div class="text-left">
                            <p class="font-semibold text-blue-800">Near Miss</p>
                            <p class="text-xs text-blue-600">
                                Close call, no harm occurred
                            </p>
                        </div>
                    </button>
                    <button
                        onclick={() => openReportModal("minor")}
                        class="w-full flex items-center gap-3 p-4 rounded-xl border-2 border-amber-200 bg-amber-50 hover:bg-amber-100 hover:border-amber-300 transition-all group"
                    >
                        <div
                            class="w-10 h-10 rounded-lg bg-amber-200 flex items-center justify-center group-hover:scale-110 transition-transform"
                        >
                            <AlertTriangle class="w-5 h-5 text-amber-700" />
                        </div>
                        <div class="text-left">
                            <p class="font-semibold text-amber-800">
                                Minor Incident
                            </p>
                            <p class="text-xs text-amber-600">
                                Small spill, minor injury
                            </p>
                        </div>
                    </button>
                    <button
                        onclick={() => openReportModal("major")}
                        class="w-full flex items-center gap-3 p-4 rounded-xl border-2 border-red-200 bg-red-50 hover:bg-red-100 hover:border-red-300 transition-all group"
                    >
                        <div
                            class="w-10 h-10 rounded-lg bg-red-200 flex items-center justify-center group-hover:scale-110 transition-transform"
                        >
                            <XCircle class="w-5 h-5 text-red-700" />
                        </div>
                        <div class="text-left">
                            <p class="font-semibold text-red-800">
                                Major Emergency
                            </p>
                            <p class="text-xs text-red-600">
                                Serious incident, evacuation
                            </p>
                        </div>
                    </button>
                </div>
            </div>

            <!-- Compliance Countdown -->
            <div class="card-pastel p-6">
                <h3
                    class="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-4"
                >
                    Compliance Countdown
                </h3>
                <div class="space-y-3">
                    {#each complianceItems as item}
                        {@const daysLeft = getDaysUntil(item.dueDate)}
                        <div
                            class="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100"
                        >
                            <div
                                class="w-10 h-10 rounded-lg {daysLeft <= 14
                                    ? 'bg-amber-100'
                                    : 'bg-slate-100'} flex items-center justify-center"
                            >
                                <svelte:component
                                    this={item.icon}
                                    class="w-5 h-5 {daysLeft <= 14
                                        ? 'text-amber-600'
                                        : 'text-slate-500'}"
                                />
                            </div>
                            <div class="flex-1 min-w-0">
                                <p
                                    class="font-medium text-slate-700 text-sm truncate"
                                >
                                    {item.title}
                                </p>
                                <p class="text-xs text-slate-500">
                                    {item.dueDate.toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                    })}
                                </p>
                            </div>
                            <div class="text-right">
                                <span
                                    class="text-lg font-bold {daysLeft <= 14
                                        ? 'text-amber-600'
                                        : 'text-slate-700'}"
                                >
                                    {daysLeft}
                                </span>
                                <p class="text-[10px] text-slate-400 uppercase">
                                    days
                                </p>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        </div>

        <!-- Center Column: Lab Heatmap -->
        <div class="card-pastel p-6">
            <h3
                class="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-4"
            >
                Lab Safety Heatmap
            </h3>
            <div class="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <svg viewBox="0 0 400 200" class="w-full h-auto">
                    <!-- Grid background -->
                    <defs>
                        <pattern
                            id="grid"
                            width="20"
                            height="20"
                            patternUnits="userSpaceOnUse"
                        >
                            <path
                                d="M 20 0 L 0 0 0 20"
                                fill="none"
                                stroke="#e2e8f0"
                                stroke-width="0.5"
                            />
                        </pattern>
                    </defs>
                    <rect width="400" height="200" fill="url(#grid)" />

                    <!-- Lab zones -->
                    {#each labZones as zone}
                        <g
                            class="cursor-pointer hover:opacity-80 transition-opacity"
                        >
                            <title
                                >{zone.name}: {zone.alertLevel === 0
                                    ? "Normal"
                                    : zone.alertLevel === 1
                                      ? "Caution"
                                      : "Alert"}</title
                            >
                            <rect
                                x={zone.x}
                                y={zone.y}
                                width={zone.w}
                                height={zone.h}
                                rx="8"
                                class={getZoneColor(zone.alertLevel)}
                                stroke-width="2"
                            />
                            <text
                                x={zone.x + zone.w / 2}
                                y={zone.y + zone.h / 2}
                                text-anchor="middle"
                                dominant-baseline="middle"
                                class="fill-slate-600 text-[10px] font-medium pointer-events-none"
                            >
                                {zone.name}
                            </text>
                        </g>
                    {/each}
                </svg>
            </div>
            <div class="mt-4 flex items-center justify-center gap-6 text-xs">
                <div class="flex items-center gap-2">
                    <span
                        class="w-3 h-3 rounded bg-emerald-200 border border-emerald-300"
                    ></span>
                    <span class="text-slate-500">Normal</span>
                </div>
                <div class="flex items-center gap-2">
                    <span
                        class="w-3 h-3 rounded bg-amber-200 border border-amber-400"
                    ></span>
                    <span class="text-slate-500">Caution</span>
                </div>
                <div class="flex items-center gap-2">
                    <span
                        class="w-3 h-3 rounded bg-red-200 border border-red-400"
                    ></span>
                    <span class="text-slate-500">Alert</span>
                </div>
            </div>
        </div>

        <!-- Right Column: Recent Incidents -->
        <div class="card-pastel p-6">
            <div class="flex items-center justify-between mb-4">
                <h3
                    class="text-sm font-semibold text-slate-700 uppercase tracking-wider"
                >
                    Recent Incidents
                </h3>
                <button
                    class="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
                >
                    <FileText class="w-3.5 h-3.5" />
                    View All
                </button>
            </div>

            {#if draftIncidents.length > 0}
                <div class="mb-4 space-y-3">
                    <h4
                        class="text-xs font-bold text-slate-500 uppercase tracking-wider"
                    >
                        Drafts ({draftIncidents.length})
                    </h4>
                    {#each draftIncidents as draft}
                        <div
                            class="p-3 rounded-lg border-2 border-dashed border-indigo-200 bg-indigo-50/50"
                        >
                            <div class="flex justify-between items-start">
                                <div>
                                    <span
                                        class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-200 text-slate-600 mb-1"
                                    >
                                        Draft
                                    </span>
                                    <p
                                        class="text-sm font-medium text-slate-800"
                                    >
                                        {draft.title}
                                    </p>
                                    <p class="text-xs text-slate-500 mt-1">
                                        {draft.description}
                                    </p>
                                </div>
                                <button
                                    onclick={() => handleDraftSubmit(draft)}
                                    class="px-3 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 shadow-sm shadow-indigo-200 transition-all"
                                >
                                    Review & Submit
                                </button>
                            </div>
                        </div>
                    {/each}
                </div>
            {/if}

            <div class="space-y-3">
                {#each recentIncidents as incident}
                    <div
                        class="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors"
                    >
                        <div
                            class="flex items-start justify-between gap-2 mb-2"
                        >
                            <span class="text-xs font-mono text-slate-400"
                                >{incident.id}</span
                            >
                            <span
                                class="px-2 py-0.5 text-[10px] font-bold uppercase rounded border {getSeverityStyle(
                                    incident.severity,
                                )}"
                            >
                                {incident.severity.replace("-", " ")}
                            </span>
                        </div>
                        <p class="text-sm font-medium text-slate-700 mb-2">
                            {incident.title}
                        </p>
                        <div
                            class="flex items-center gap-3 text-xs text-slate-500"
                        >
                            <span class="flex items-center gap-1">
                                <MapPin class="w-3 h-3" />
                                {incident.location}
                            </span>
                            <span class="flex items-center gap-1">
                                <Clock class="w-3 h-3" />
                                {incident.date}
                            </span>
                        </div>
                        <div
                            class="mt-2 flex items-center gap-1.5 {getStatusStyle(
                                incident.status,
                            )}"
                        >
                            <CheckCircle class="w-3.5 h-3.5" />
                            <span class="text-xs font-medium capitalize"
                                >{incident.status}</span
                            >
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    </div>
</div>
