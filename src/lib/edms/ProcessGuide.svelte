<script lang="ts">
    import { X, ArrowRight } from "lucide-svelte";

    const { onclose = () => {} }: { onclose?: () => void } = $props();
</script>

<!-- Backdrop -->
<div
    class="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/60 backdrop-blur-sm overflow-y-auto py-8 px-4"
    role="dialog"
    aria-modal="true"
    aria-label="Document Management Process Guide"
>
    <!-- Panel -->
    <div class="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-md shadow-xl border border-slate-200 dark:border-slate-700">

        <!-- Header -->
        <div class="flex items-center justify-between px-7 py-5 border-b border-slate-200 dark:border-slate-700">
            <div>
                <h2 class="text-lg font-semibold text-slate-900 dark:text-white tracking-tight">Document Management Process</h2>
                <p class="text-sm text-slate-500 dark:text-slate-400 mt-0.5">How documents are created, reviewed, and approved</p>
            </div>
            <button
                onclick={onclose}
                class="p-2 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Close"
            >
                <X class="w-5 h-5" />
            </button>
        </div>

        <!-- Body -->
        <div class="px-7 py-6 space-y-8 text-sm text-slate-700 dark:text-slate-300">

            <!-- Lifecycle diagram -->
            <section>
                <h3 class="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4">Lifecycle at a glance</h3>
                <div class="flex flex-wrap items-center gap-2">
                    {#each [
                        { label: "Draft", color: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-600" },
                        null,
                        { label: "Under Review", color: "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-700" },
                        null,
                        { label: "Approved", color: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700" },
                        null,
                        { label: "Obsolete", color: "bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-700" },
                    ] as step}
                        {#if step === null}
                            <ArrowRight class="w-4 h-4 text-slate-300 dark:text-slate-600 shrink-0" />
                        {:else}
                            <span class={`px-3 py-1 rounded-sm text-xs font-semibold ${step.color}`}>{step.label}</span>
                        {/if}
                    {/each}
                </div>
                <p class="mt-3 text-xs text-slate-400 dark:text-slate-500">
                    If the reviewer requests changes, the document returns to the author and re-enters the review cycle after resubmission.
                </p>
            </section>

            <!-- Roles -->
            <section>
                <h3 class="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4">Roles &amp; responsibilities</h3>
                <div class="grid sm:grid-cols-3 gap-3">
                    {#each [
                        {
                            role: "Author",
                            who: "Scientist, technician, or process owner",
                            duties: ["Creates and drafts the document", "Ensures technical accuracy", "Addresses feedback and resubmits"]
                        },
                        {
                            role: "Reviewer",
                            who: "Peer or subject-matter expert",
                            duties: ["Checks technical correctness and completeness", "Requests changes or escalates to Approver"]
                        },
                        {
                            role: "Approver",
                            who: "Lab manager or QA officer",
                            duties: ["Gives final sign-off", "Accountable for regulatory and operational compliance", "Can mark documents obsolete"]
                        }
                    ] as r}
                        <div class="rounded-md border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-800/50">
                            <p class="font-semibold text-slate-900 dark:text-white">{r.role}</p>
                            <p class="text-xs text-slate-400 dark:text-slate-500 mt-0.5 mb-3">{r.who}</p>
                            <ul class="space-y-1.5">
                                {#each r.duties as d}
                                    <li class="flex items-start gap-2 text-xs">
                                        <span class="mt-0.5 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0"></span>
                                        {d}
                                    </li>
                                {/each}
                            </ul>
                        </div>
                    {/each}
                </div>
            </section>

            <!-- Step-by-step -->
            <section>
                <h3 class="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4">Step-by-step process</h3>
                <ol class="space-y-4">
                    {#each [
                        {
                            n: "1",
                            title: "Create a draft",
                            who: "Author",
                            text: "The author creates the document in the EDMS, filling in the title, type, version, description, reviewer, and review due date. The document starts in Draft status."
                        },
                        {
                            n: "2",
                            title: "Submit for review",
                            who: "Author",
                            text: "When the author is satisfied the document is complete, they submit it. The status changes to Under Review. The document cannot be edited while under review."
                        },
                        {
                            n: "3",
                            title: "Review",
                            who: "Reviewer",
                            text: "The reviewer checks the document for technical correctness and completeness. They either approve it (if they hold approver rights), request changes from the author, or escalate to a designated Approver."
                        },
                        {
                            n: "4",
                            title: "Request changes (if needed)",
                            who: "Author",
                            text: "If changes are requested, the document is returned to the author. The author revises it and resubmits. Each cycle is recorded in the revision history."
                        },
                        {
                            n: "5",
                            title: "Approve",
                            who: "Approver",
                            text: "The Approver formally approves the document. It becomes the current controlled version. Any previous version of the same document is automatically marked Superseded."
                        },
                        {
                            n: "6",
                            title: "Mark as obsolete",
                            who: "Lab manager / QA officer",
                            text: "When a document is no longer needed, it is marked Obsolete. It is retained for audit and historical reference but is not in active use."
                        }
                    ] as step}
                        <li class="flex gap-4">
                            <span class="shrink-0 w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">{step.n}</span>
                            <div>
                                <div class="flex items-baseline gap-2 mb-1">
                                    <p class="font-semibold text-slate-900 dark:text-white">{step.title}</p>
                                    <span class="text-xs text-slate-400 dark:text-slate-500">{step.who}</span>
                                </div>
                                <p class="text-slate-600 dark:text-slate-400 leading-relaxed">{step.text}</p>
                            </div>
                        </li>
                    {/each}
                </ol>
            </section>

            <!-- Versioning & audit -->
            <section class="grid sm:grid-cols-2 gap-4">
                <div class="rounded-md border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-800/50">
                    <p class="font-semibold text-slate-900 dark:text-white mb-2">Versioning</p>
                    <ul class="space-y-1.5 text-xs">
                        <li class="flex items-start gap-2"><span class="mt-0.5 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0"></span>New documents start at <strong>v1.0</strong></li>
                        <li class="flex items-start gap-2"><span class="mt-0.5 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0"></span>Minor edits (corrections, clarifications): 1.0 → 1.1</li>
                        <li class="flex items-start gap-2"><span class="mt-0.5 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0"></span>Major changes (scope, process): 1.0 → 2.0</li>
                    </ul>
                </div>
                <div class="rounded-md border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-800/50">
                    <p class="font-semibold text-slate-900 dark:text-white mb-2">Audit trail</p>
                    <ul class="space-y-1.5 text-xs">
                        <li class="flex items-start gap-2"><span class="mt-0.5 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0"></span>Every change, review, and approval is logged automatically</li>
                        <li class="flex items-start gap-2"><span class="mt-0.5 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0"></span>Records who made each change and when</li>
                        <li class="flex items-start gap-2"><span class="mt-0.5 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0"></span>The trail is read-only and cannot be altered</li>
                    </ul>
                </div>
            </section>

        </div>

        <!-- Footer -->
        <div class="px-7 py-4 border-t border-slate-200 dark:border-slate-700 flex justify-end">
            <button
                onclick={onclose}
                class="px-4 py-2 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
                Close
            </button>
        </div>
    </div>
</div>
