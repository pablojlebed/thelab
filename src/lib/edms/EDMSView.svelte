<script lang="ts">
    import { edmsStore } from "../stores/edmsStore";
    import { get } from "svelte/store";
    import type { LabDocument } from "./types";
    import DocumentModal from "./DocumentModal.svelte";
    import DocumentDetailModal from "./DocumentDetailModal.svelte";
    import { Plus, Search, FileText, Eye, BookOpen } from "lucide-svelte";
    import ProcessGuide from "./ProcessGuide.svelte";

    // Filter state
    let searchQuery = $state("");
    let filterType = $state("all");
    let filterStatus = $state("all");

    // Modal state
    let showCreateModal = $state(false);
    let showProcessGuide = $state(false);
    let showDetailModal = $state(false);
    let selectedDoc = $state<LabDocument | null>(null);
    let editingDoc = $state<LabDocument | null>(null);

    // Sync store into runes-compatible state
    let docs = $state<LabDocument[]>(get(edmsStore));
    $effect(() => edmsStore.subscribe((v) => (docs = v)));

    // Filtered document list
    let filteredDocs = $derived(
        docs.filter((doc) => {
            const q = searchQuery.toLowerCase();
            const matchesSearch =
                !q ||
                doc.title.toLowerCase().includes(q) ||
                doc.id.toLowerCase().includes(q) ||
                doc.author.toLowerCase().includes(q) ||
                doc.tags.some((t) => t.toLowerCase().includes(q));
            const matchesType =
                filterType === "all" || doc.type === filterType;
            const matchesStatus =
                filterStatus === "all" || doc.status === filterStatus;
            return matchesSearch && matchesType && matchesStatus;
        })
    );

    // Stats
    let stats = $derived({
        total: docs.length,
        approved: docs.filter((d) => d.status === "approved").length,
        pending: docs.filter(
            (d) => d.status === "draft" || d.status === "under-review"
        ).length,
        expiringSoon: docs.filter((d) => {
            if (!d.review_due || d.status !== "approved") return false;
            const days = Math.ceil(
                (new Date(d.review_due).getTime() - Date.now()) / 86400000
            );
            return days >= 0 && days <= 60;
        }).length,
    });

    // Lookup tables
    const statusConfig: Record<
        LabDocument["status"],
        { label: string; classes: string; dot: string }
    > = {
        approved: {
            label: "Approved",
            classes:
                "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800",
            dot: "bg-emerald-500",
        },
        "under-review": {
            label: "Under Review",
            classes:
                "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800",
            dot: "bg-amber-500",
        },
        draft: {
            label: "Draft",
            classes:
                "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-600",
            dot: "bg-slate-400",
        },
        obsolete: {
            label: "Obsolete",
            classes:
                "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800",
            dot: "bg-red-500",
        },
        superseded: {
            label: "Superseded",
            classes:
                "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800",
            dot: "bg-purple-500",
        },
    };

    const typeAbbr: Record<string, string> = {
        SOP: "SOP",
        Protocol: "PRO",
        "Work Instruction": "WI",
        "Safety Data Sheet": "SDS",
        "Calibration Record": "CAL",
        Form: "FRM",
        Certificate: "CRT",
        Policy: "POL",
    };

    const typeColors: Record<string, string> = {
        SOP: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
        Protocol:
            "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400",
        "Work Instruction":
            "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400",
        "Safety Data Sheet":
            "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
        "Calibration Record":
            "bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400",
        Form: "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400",
        Certificate:
            "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
        Policy:
            "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400",
    };

    function getDaysUntil(dateStr?: string): number | null {
        if (!dateStr) return null;
        return Math.ceil(
            (new Date(dateStr).getTime() - Date.now()) / 86400000
        );
    }

    function formatDate(dateStr?: string): string {
        if (!dateStr) return "—";
        return new Date(dateStr).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    }

    function openDetail(doc: LabDocument) {
        selectedDoc = doc;
        showDetailModal = true;
    }

    function openEdit(doc: LabDocument) {
        editingDoc = doc;
        showCreateModal = true;
    }

    function handleCreate() {
        editingDoc = null;
        showCreateModal = true;
    }

    function closeCreateModal() {
        showCreateModal = false;
        editingDoc = null;
    }

    function closeDetailModal() {
        showDetailModal = false;
        selectedDoc = null;
    }

    const selectClass =
        "text-sm rounded-md border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-500/30 focus:border-blue-400 transition-all";
</script>

<div class="space-y-5">
    <!-- Stats -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="card-pastel p-4">
            <p class="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                Total Documents
            </p>
            <p class="text-2xl font-bold text-slate-900 dark:text-white">
                {stats.total}
            </p>
        </div>
        <div class="card-pastel p-4">
            <p class="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                Approved
            </p>
            <p class="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {stats.approved}
            </p>
        </div>
        <div class="card-pastel p-4">
            <p class="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                Pending
            </p>
            <p class="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {stats.pending}
            </p>
        </div>
        <div class="card-pastel p-4">
            <p class="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                Expiring ≤ 60 days
            </p>
            <p
                class="text-2xl font-bold {stats.expiringSoon > 0
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-slate-900 dark:text-white'}"
            >
                {stats.expiringSoon}
            </p>
        </div>
    </div>

    <!-- Toolbar -->
    <div class="card-pastel p-3 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div class="relative flex-1 min-w-0">
            <Search
                class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
            />
            <input
                type="text"
                bind:value={searchQuery}
                placeholder="Search by title, ID, author or tag…"
                class="w-full pl-9 pr-3 py-2 text-sm rounded-md border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-500/30 focus:border-blue-400 transition-all"
            />
        </div>
        <div class="flex items-center gap-2 shrink-0 flex-wrap">
            <select bind:value={filterType} class={selectClass}>
                <option value="all">All Types</option>
                <option value="SOP">SOP</option>
                <option value="Protocol">Protocol</option>
                <option value="Work Instruction">Work Instruction</option>
                <option value="Safety Data Sheet">Safety Data Sheet</option>
                <option value="Calibration Record">Calibration Record</option>
                <option value="Form">Form</option>
                <option value="Certificate">Certificate</option>
                <option value="Policy">Policy</option>
            </select>
            <select bind:value={filterStatus} class={selectClass}>
                <option value="all">All Statuses</option>
                <option value="draft">Draft</option>
                <option value="under-review">Under Review</option>
                <option value="approved">Approved</option>
                <option value="obsolete">Obsolete</option>
                <option value="superseded">Superseded</option>
            </select>
            <button
                onclick={() => (showProcessGuide = true)}
                class="flex items-center gap-2 px-4 py-2 rounded-md border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
                title="How the document process works"
            >
                <BookOpen class="w-4 h-4" />
                How it works
            </button>
            <button
                onclick={handleCreate}
                class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
            >
                <Plus class="w-4 h-4" />
                New Document
            </button>
        </div>
    </div>

    <!-- Document List -->
    <div class="card-pastel overflow-hidden">
        <!-- Table header (desktop) -->
        <div
            class="hidden md:grid items-center gap-x-4 px-4 py-2.5 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60"
            style="grid-template-columns: 2.25rem 1fr 8rem 3.5rem 8.5rem 8rem 7rem 3rem"
        >
            <div></div>
            <p class="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Document</p>
            <p class="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Type</p>
            <p class="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Ver.</p>
            <p class="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Status</p>
            <p class="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Author</p>
            <p class="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Review Due</p>
            <div></div>
        </div>

        <!-- Rows -->
        {#if filteredDocs.length === 0}
            <div class="py-16 text-center">
                <FileText
                    class="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3"
                />
                <p class="text-sm font-medium text-slate-500 dark:text-slate-400">
                    No documents found
                </p>
                <p class="text-xs text-slate-400 dark:text-slate-500 mt-1">
                    Try adjusting your search or filters
                </p>
            </div>
        {:else}
            <div class="divide-y divide-slate-100 dark:divide-slate-700/60">
                {#each filteredDocs as doc (doc.id)}
                    {@const daysLeft = getDaysUntil(doc.review_due)}
                    {@const status = statusConfig[doc.status]}
                    {@const expiring =
                        daysLeft !== null &&
                        daysLeft >= 0 &&
                        daysLeft <= 60 &&
                        doc.status === "approved"}

                    <!-- Desktop row -->
                    <div
                        class="hidden md:grid items-center gap-x-4 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors group"
                        style="grid-template-columns: 2.25rem 1fr 8rem 3.5rem 8.5rem 8rem 7rem 3rem"
                    >
                        <!-- Type badge (icon box) -->
                        <div>
                            <div
                                class={`w-8 h-8 rounded-sm flex items-center justify-center text-[9px] font-bold tracking-wide ${typeColors[doc.type] ?? "bg-slate-100 text-slate-600"}`}
                            >
                                {typeAbbr[doc.type] ?? "DOC"}
                            </div>
                        </div>

                        <!-- Title + ID -->
                        <div class="min-w-0">
                            <button
                                class="text-left w-full min-w-0"
                                onclick={() => openDetail(doc)}
                            >
                                <p
                                    class="text-sm font-medium text-slate-900 dark:text-slate-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug"
                                >
                                    {doc.title}
                                </p>
                                <p
                                    class="text-xs font-mono text-slate-400 dark:text-slate-500 mt-0.5"
                                >
                                    {doc.id}
                                </p>
                            </button>
                        </div>

                        <!-- Type label -->
                        <div>
                            <span
                                class={`inline-block text-xs font-medium px-2 py-0.5 rounded-sm ${typeColors[doc.type] ?? ""}`}
                            >
                                {doc.type}
                            </span>
                        </div>

                        <!-- Version -->
                        <p
                            class="text-sm font-mono text-slate-500 dark:text-slate-400"
                        >
                            v{doc.version}
                        </p>

                        <!-- Status -->
                        <div>
                            <span
                                class={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-sm ${status.classes}`}
                            >
                                <span
                                    class={`w-1.5 h-1.5 rounded-full shrink-0 ${status.dot}`}
                                ></span>
                                {status.label}
                            </span>
                        </div>

                        <!-- Author -->
                        <p
                            class="text-sm text-slate-600 dark:text-slate-400 truncate"
                        >
                            {doc.author}
                        </p>

                        <!-- Review Due -->
                        <div>
                            {#if doc.review_due && doc.status !== "obsolete" && doc.status !== "superseded"}
                                <p
                                    class="text-sm {expiring
                                        ? 'text-red-600 dark:text-red-400 font-medium'
                                        : 'text-slate-500 dark:text-slate-400'}"
                                >
                                    {formatDate(doc.review_due)}
                                </p>
                                {#if expiring}
                                    <p
                                        class="text-xs text-red-400 dark:text-red-500 leading-none mt-0.5"
                                    >
                                        {daysLeft}d left
                                    </p>
                                {/if}
                            {:else}
                                <p
                                    class="text-sm text-slate-300 dark:text-slate-600"
                                >
                                    —
                                </p>
                            {/if}
                        </div>

                        <!-- View action -->
                        <div class="flex justify-end">
                            <button
                                onclick={() => openDetail(doc)}
                                class="p-1.5 rounded-md text-slate-300 dark:text-slate-600 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors opacity-0 group-hover:opacity-100"
                                title="View details"
                            >
                                <Eye class="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <!-- Mobile card -->
                    <div
                        class="md:hidden p-4 space-y-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                        <div class="flex items-start justify-between gap-2">
                            <button
                                class="text-left min-w-0 flex-1"
                                onclick={() => openDetail(doc)}
                            >
                                <p
                                    class="text-sm font-medium text-slate-900 dark:text-slate-100 leading-snug"
                                >
                                    {doc.title}
                                </p>
                                <p
                                    class="text-xs font-mono text-slate-400 mt-0.5"
                                >
                                    {doc.id}
                                </p>
                            </button>
                            <span
                                class={`shrink-0 inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-sm ${status.classes}`}
                            >
                                <span
                                    class={`w-1.5 h-1.5 rounded-full shrink-0 ${status.dot}`}
                                ></span>
                                {status.label}
                            </span>
                        </div>
                        <div
                            class="flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400"
                        >
                            <span
                                class={`font-medium px-1.5 py-0.5 rounded-sm ${typeColors[doc.type] ?? ""}`}
                                >{doc.type}</span
                            >
                            <span class="font-mono">v{doc.version}</span>
                            <span>{doc.author}</span>
                            {#if doc.review_due}
                                <span
                                    class={expiring
                                        ? "text-red-500 font-medium"
                                        : ""}
                                    >Due: {formatDate(doc.review_due)}</span
                                >
                            {/if}
                        </div>
                    </div>
                {/each}
            </div>
        {/if}

        <!-- Footer -->
        {#if filteredDocs.length > 0}
            <div
                class="px-4 py-2.5 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40"
            >
                <p class="text-xs text-slate-400 dark:text-slate-500">
                    {filteredDocs.length} of {docs.length} document{docs.length !==
                    1
                        ? "s"
                        : ""}
                </p>
            </div>
        {/if}
    </div>
</div>

<!-- Modals -->
{#if showProcessGuide}
    <ProcessGuide onclose={() => (showProcessGuide = false)} />
{/if}

{#if showCreateModal}
    <DocumentModal doc={editingDoc} onclose={closeCreateModal} />
{/if}

{#if showDetailModal && selectedDoc}
    <DocumentDetailModal
        doc={selectedDoc}
        onclose={closeDetailModal}
        onedit={() => {
            closeDetailModal();
            openEdit(selectedDoc!);
        }}
    />
{/if}
