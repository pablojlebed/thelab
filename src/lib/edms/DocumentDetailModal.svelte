<script lang="ts">
    import { fly, fade } from "svelte/transition";
    import { edmsStore } from "../stores/edmsStore";
    import { get } from "svelte/store";
    import type { LabDocument } from "./types";
    import {
        X,
        Edit2,
        CheckCircle,
        RotateCcw,
        Archive,
        SendHorizonal,
    } from "lucide-svelte";

    const { doc, onclose = () => {}, onedit = () => {} }: { doc: LabDocument; onclose?: () => void; onedit?: () => void } = $props();

    // Track live state so workflow actions reflect immediately
    let docs = $state<LabDocument[]>(get(edmsStore));
    $effect(() => edmsStore.subscribe((v) => (docs = v)));
    let liveDoc = $derived(docs.find((d) => d.id === doc.id) ?? doc);
    let revisions = $derived(edmsStore.getRevisions(doc.id));

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

    function formatDate(dateStr?: string): string {
        if (!dateStr) return "—";
        return new Date(dateStr).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    }

    let isActing = $state(false);

    function act(fn: () => void) {
        isActing = true;
        setTimeout(() => {
            fn();
            isActing = false;
        }, 350);
    }

    function submitForReview() {
        act(() => edmsStore.submitForReview(liveDoc.id));
    }
    function approve() {
        act(() => edmsStore.approve(liveDoc.id, "Lab Director"));
    }
    function requestChanges() {
        act(() => edmsStore.requestChanges(liveDoc.id));
    }
    function markObsolete() {
        act(() => edmsStore.markObsolete(liveDoc.id));
    }
</script>

<div
    class="fixed inset-0 z-50 flex items-center justify-center p-4"
    transition:fade={{ duration: 150 }}
    role="dialog"
    aria-modal="true"
    onclick={(e) => e.target === e.currentTarget && onclose()}
    onkeydown={(e) => e.key === "Escape" && onclose()}
    tabindex="-1"
>
    <div class="absolute inset-0 bg-slate-900/50 dark:bg-slate-950/70"></div>

    <div
        class="relative w-full max-w-2xl bg-white dark:bg-slate-800 rounded-md shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden max-h-[88vh] flex flex-col"
        transition:fly={{ y: 16, duration: 200 }}
    >
        <!-- Header -->
        <div
            class="flex items-start justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700 shrink-0"
        >
            <div class="flex items-start gap-3 min-w-0">
                <span
                    class={`mt-0.5 shrink-0 text-xs font-bold px-2 py-0.5 rounded-sm ${typeColors[liveDoc.type] ?? ""}`}
                >
                    {liveDoc.type}
                </span>
                <div class="min-w-0">
                    <h2
                        class="text-sm font-semibold text-slate-900 dark:text-white leading-snug"
                    >
                        {liveDoc.title}
                    </h2>
                    <p class="text-xs font-mono text-slate-400 dark:text-slate-500 mt-0.5">
                        {liveDoc.id} &middot; v{liveDoc.version}
                    </p>
                </div>
            </div>
            <div class="flex items-center gap-1 shrink-0 ml-4">
                <button
                    onclick={onedit}
                    class="p-1.5 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    title="Edit"
                >
                    <Edit2 class="w-4 h-4" />
                </button>
                <button
                    onclick={onclose}
                    class="p-1.5 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                    <X class="w-4 h-4" />
                </button>
            </div>
        </div>

        <!-- Scrollable Body -->
        <div class="flex-1 overflow-y-auto">
            <div class="p-6 space-y-6">
                <!-- Status + Workflow Actions -->
                <div class="flex items-center justify-between gap-4 flex-wrap">
                    <span
                        class={`text-xs font-medium px-2.5 py-1 rounded-sm flex items-center gap-1.5 ${statusConfig[liveDoc.status].classes}`}
                    >
                        <span
                            class={`w-1.5 h-1.5 rounded-full ${statusConfig[liveDoc.status].dot}`}
                        ></span>
                        {statusConfig[liveDoc.status].label}
                    </span>

                    <div class="flex items-center gap-2 flex-wrap">
                        {#if liveDoc.status === "draft"}
                            <button
                                onclick={submitForReview}
                                disabled={isActing}
                                class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-amber-500 hover:bg-amber-600 rounded-md transition-colors disabled:opacity-50"
                            >
                                <SendHorizonal class="w-3.5 h-3.5" />
                                Submit for Review
                            </button>
                        {:else if liveDoc.status === "under-review"}
                            <button
                                onclick={requestChanges}
                                disabled={isActing}
                                class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-md border border-slate-200 dark:border-slate-600 transition-colors disabled:opacity-50"
                            >
                                <RotateCcw class="w-3.5 h-3.5" />
                                Request Changes
                            </button>
                            <button
                                onclick={approve}
                                disabled={isActing}
                                class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-md transition-colors disabled:opacity-50"
                            >
                                <CheckCircle class="w-3.5 h-3.5" />
                                Approve
                            </button>
                        {:else if liveDoc.status === "approved"}
                            <button
                                onclick={markObsolete}
                                disabled={isActing}
                                class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-md border border-red-200 dark:border-red-500/30 transition-colors disabled:opacity-50"
                            >
                                <Archive class="w-3.5 h-3.5" />
                                Mark Obsolete
                            </button>
                        {/if}
                    </div>
                </div>

                <!-- Metadata Grid -->
                <div class="grid grid-cols-2 gap-x-8 gap-y-4">
                    <div>
                        <p class="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">Author</p>
                        <p class="text-sm text-slate-800 dark:text-slate-200">{liveDoc.author}</p>
                    </div>
                    {#if liveDoc.reviewer}
                        <div>
                            <p class="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">Reviewer</p>
                            <p class="text-sm text-slate-800 dark:text-slate-200">{liveDoc.reviewer}</p>
                        </div>
                    {/if}
                    {#if liveDoc.approver}
                        <div>
                            <p class="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">Approver</p>
                            <p class="text-sm text-slate-800 dark:text-slate-200">{liveDoc.approver}</p>
                        </div>
                    {/if}
                    <div>
                        <p class="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">Created</p>
                        <p class="text-sm text-slate-800 dark:text-slate-200">{formatDate(liveDoc.created_at)}</p>
                    </div>
                    <div>
                        <p class="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">Last Updated</p>
                        <p class="text-sm text-slate-800 dark:text-slate-200">{formatDate(liveDoc.updated_at)}</p>
                    </div>
                    {#if liveDoc.effective_date}
                        <div>
                            <p class="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">Effective Date</p>
                            <p class="text-sm text-slate-800 dark:text-slate-200">{formatDate(liveDoc.effective_date)}</p>
                        </div>
                    {/if}
                    {#if liveDoc.review_due}
                        <div>
                            <p class="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">Review Due</p>
                            <p class="text-sm text-slate-800 dark:text-slate-200">{formatDate(liveDoc.review_due)}</p>
                        </div>
                    {/if}
                </div>

                <!-- Description -->
                {#if liveDoc.description}
                    <div>
                        <p class="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Description</p>
                        <p class="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{liveDoc.description}</p>
                    </div>
                {/if}

                <!-- Tags -->
                {#if liveDoc.tags.length > 0}
                    <div>
                        <p class="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Tags</p>
                        <div class="flex flex-wrap gap-1.5">
                            {#each liveDoc.tags as tag}
                                <span
                                    class="text-xs px-2 py-0.5 rounded-sm bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 font-mono"
                                >
                                    {tag}
                                </span>
                            {/each}
                        </div>
                    </div>
                {/if}

                <!-- Revision History -->
                {#if revisions.length > 0}
                    <div>
                        <p class="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
                            Revision History
                        </p>
                        <div class="space-y-3">
                            {#each revisions as rev}
                                <div class="flex items-start gap-3">
                                    <span
                                        class="mt-0.5 shrink-0 text-xs font-mono font-bold px-1.5 py-0.5 rounded-sm bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-600"
                                    >
                                        v{rev.version}
                                    </span>
                                    <div class="min-w-0">
                                        <p class="text-sm text-slate-700 dark:text-slate-300 leading-snug">
                                            {rev.summary}
                                        </p>
                                        <p class="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                                            {rev.changed_by} &middot; {formatDate(rev.changed_at)}
                                        </p>
                                    </div>
                                </div>
                            {/each}
                        </div>
                    </div>
                {/if}
            </div>
        </div>
    </div>
</div>
