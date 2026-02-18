<script lang="ts">
    import { X, ArrowRight } from "lucide-svelte";

    const { onclose = () => {} }: { onclose?: () => void } = $props();

    const stages = [
        {
            n: "1",
            col: "Identified",
            who: "Reporter",
            color: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-600",
            dot: "bg-slate-400",
            entry: "An event or risk has been observed and documented.",
            exit: "CAPA card is created and an owner is assigned.",
            text: "A new CAPA is opened as soon as a non-conformance, deviation, complaint, or risk is identified. The reporter creates a card with a clear title, description, assigned owner, priority, and target due date.",
        },
        {
            n: "2",
            col: "Investigation",
            who: "Owner + team",
            color: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 border border-blue-300 dark:border-blue-700",
            dot: "bg-blue-400",
            entry: "Root cause investigation has started.",
            exit: "Root cause identified and documented in the card.",
            text: "The owner investigates the root cause using tools such as 5-Why analysis or fishbone diagrams. Findings are added to the card description or comments. This stage answers: Why did this happen?",
        },
        {
            n: "3",
            col: "Action Plan",
            who: "Owner + Lab Manager",
            color: "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-700",
            dot: "bg-amber-400",
            entry: "Root cause is confirmed and an action plan is defined.",
            exit: "Action plan approved and execution is underway or complete.",
            text: "Based on the root cause, SMART corrective and/or preventive actions are defined. The plan is documented in the card and reviewed by the Lab Manager before execution. This stage answers: What are we going to do about it?",
        },
        {
            n: "4",
            col: "Verification",
            who: "Reviewer / QA Officer",
            color: "bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-400 border border-violet-300 dark:border-violet-700",
            dot: "bg-violet-400",
            entry: "All planned actions have been implemented.",
            exit: "Effectiveness verified with objective evidence.",
            text: "The reviewer independently confirms that actions were carried out and are effective. Objective evidence (test results, records, re-audit) is documented in comments. This stage answers: Did the actions actually work?",
        },
        {
            n: "5",
            col: "Closed",
            who: "Lab Manager / QA Officer",
            color: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700",
            dot: "bg-emerald-500",
            entry: "Verification is complete and effective.",
            exit: "CAPA is formally closed and dated.",
            text: "The CAPA is formally closed. If verification reveals that actions were insufficient, the card is moved back to Action Plan for revision. Closed CAPAs remain visible for reference and audit purposes.",
        },
    ];

    const roles = [
        { role: "Reporter", who: "Any lab member", duties: ["Identifies the issue and opens the CAPA card", "Provides sufficient detail for investigation"] },
        { role: "Owner", who: "Assigned team member", duties: ["Drives the CAPA through all stages", "Leads root cause investigation", "Implements the action plan"] },
        { role: "Lab Manager", who: "Lab manager", duties: ["Reviews and approves the action plan", "Decides on formal closure"] },
        { role: "Reviewer / QA", who: "QA officer or peer", duties: ["Independently verifies effectiveness", "Documents objective evidence before closure"] },
    ];

    const priorities = [
        { level: "Critical", color: "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-700", when: "Immediate risk to safety, data integrity, or compliance" },
        { level: "High", color: "bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-400 border border-orange-300 dark:border-orange-700", when: "Significant impact on quality or operations — resolve within 2 weeks" },
        { level: "Medium", color: "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-700", when: "Moderate impact — resolve within 30 days" },
        { level: "Low", color: "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-600", when: "Minor deviation or improvement opportunity — resolve within 90 days" },
    ];
</script>

<!-- Backdrop -->
<div
    class="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/60 backdrop-blur-sm overflow-y-auto py-8 px-4"
    role="dialog"
    aria-modal="true"
    aria-label="CAPA Process Guide"
>
    <div class="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-md shadow-xl border border-slate-200 dark:border-slate-700">

        <!-- Header -->
        <div class="flex items-center justify-between px-7 py-5 border-b border-slate-200 dark:border-slate-700">
            <div>
                <h2 class="text-lg font-semibold text-slate-900 dark:text-white tracking-tight">CAPA Process</h2>
                <p class="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Corrective and Preventive Action — from identification to closure</p>
            </div>
            <button
                onclick={onclose}
                class="p-2 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Close"
            >
                <X class="w-5 h-5" />
            </button>
        </div>

        <div class="px-7 py-6 space-y-8 text-sm text-slate-700 dark:text-slate-300">

            <!-- What is CAPA -->
            <section>
                <h3 class="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">What is CAPA?</h3>
                <p class="leading-relaxed text-slate-600 dark:text-slate-400">
                    A <strong class="text-slate-900 dark:text-white">Corrective Action</strong> addresses a problem that has already occurred.
                    A <strong class="text-slate-900 dark:text-white">Preventive Action</strong> addresses a potential problem before it occurs.
                    CAPAs ensure root causes are properly identified, fixed, and prevented from recurring.
                </p>
            </section>

            <!-- Workflow diagram -->
            <section>
                <h3 class="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4">Workflow</h3>
                <div class="flex flex-wrap items-center gap-2">
                    {#each stages as stage, i}
                        <span class={`px-3 py-1 rounded-sm text-xs font-semibold ${stage.color}`}>{stage.col}</span>
                        {#if i < stages.length - 1}
                            <ArrowRight class="w-4 h-4 text-slate-300 dark:text-slate-600 shrink-0" />
                        {/if}
                    {/each}
                </div>
                <p class="mt-3 text-xs text-slate-400 dark:text-slate-500">
                    If verification reveals actions were insufficient, the card returns to Action Plan for revision before being re-verified.
                </p>
            </section>

            <!-- Stage-by-stage -->
            <section>
                <h3 class="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4">Stages in detail</h3>
                <ol class="space-y-5">
                    {#each stages as stage}
                        <li class="flex gap-4">
                            <span class="shrink-0 w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">{stage.n}</span>
                            <div class="flex-1">
                                <div class="flex flex-wrap items-baseline gap-2 mb-1">
                                    <span class={`px-2 py-0.5 rounded-sm text-xs font-semibold ${stage.color}`}>{stage.col}</span>
                                    <span class="text-xs text-slate-400 dark:text-slate-500">{stage.who}</span>
                                </div>
                                <p class="text-slate-600 dark:text-slate-400 leading-relaxed mb-2">{stage.text}</p>
                                <div class="grid sm:grid-cols-2 gap-2">
                                    <div class="rounded-sm bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 px-3 py-2 text-xs">
                                        <span class="font-semibold text-slate-500 dark:text-slate-400">Entry: </span>{stage.entry}
                                    </div>
                                    <div class="rounded-sm bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 px-3 py-2 text-xs">
                                        <span class="font-semibold text-slate-500 dark:text-slate-400">Exit: </span>{stage.exit}
                                    </div>
                                </div>
                            </div>
                        </li>
                    {/each}
                </ol>
            </section>

            <!-- Roles -->
            <section>
                <h3 class="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4">Roles &amp; responsibilities</h3>
                <div class="grid sm:grid-cols-2 gap-3">
                    {#each roles as r}
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

            <!-- Priority -->
            <section>
                <h3 class="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4">Priority guidance</h3>
                <div class="space-y-2">
                    {#each priorities as p}
                        <div class="flex items-start gap-3">
                            <span class={`shrink-0 px-2 py-0.5 rounded-sm text-xs font-semibold ${p.color}`}>{p.level}</span>
                            <span class="text-xs text-slate-600 dark:text-slate-400 pt-0.5">{p.when}</span>
                        </div>
                    {/each}
                </div>
            </section>

            <!-- How to use the board -->
            <section>
                <h3 class="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4">Using the CAPA board</h3>
                <ol class="space-y-2">
                    {#each [
                        ["Open a new CAPA", "Click + New CAPA in the top right of the CAPA tab. Fill in the title, owner, description, priority, and due date."],
                        ["Move a card", "Drag and drop a card to the next column when the stage is complete, or open the card and update its status."],
                        ["Add evidence and notes", "Click a card to open the detail view. Use the Comments section to log investigation findings, decisions, and evidence."],
                        ["Filter the board", "Use the search bar or assignee filter at the top to focus on specific CAPAs."],
                        ["Close a CAPA", "Drag the card to Closed once verification is confirmed by the QA Officer or Lab Manager."],
                    ] as [title, desc]}
                        <li class="flex gap-3 text-xs">
                            <span class="shrink-0 font-bold text-blue-600 dark:text-blue-400 w-4 text-right">{title.charAt(0)}</span>
                            <span><strong class="text-slate-700 dark:text-slate-300">{title}</strong> — {desc}</span>
                        </li>
                    {/each}
                </ol>
                <p class="mt-4 text-xs text-slate-400 dark:text-slate-500">
                    If a CAPA results in a new or revised controlled document (e.g. an updated SOP), process the document change through the EDMS and reference the document ID in the CAPA card comments.
                </p>
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
