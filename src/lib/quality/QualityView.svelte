<script lang="ts">
    import {
        ClipboardCheck,
        Scale,
        AlertTriangle,
        FileText,
        CheckCircle,
    } from "lucide-svelte";
    import { qualityStore } from "../stores/qualityStore";
    import { exportToCSV } from "../utils/export";

    function handleExport() {
        const data = $qualityStore.map((nc) => ({
            ID: nc.id,
            Title: nc.title,
            Description: nc.description,
            Severity: nc.severity,
            Status: nc.status,
            Date: nc.dateOpened,
            Source: nc.source,
        }));
        exportToCSV(data, "quality_non_conformities");
    }

    $: openNCsCount = $qualityStore.filter(
        (nc) => nc.status !== "closed",
    ).length;
</script>

<div class="h-full">
    <!-- Header Actions -->
    <div class="flex justify-end mb-6">
        <button
            on:click={handleExport}
            class="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors text-sm font-medium shadow-sm"
        >
            <FileText size={16} />
            Export Data
        </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Compliance Overview -->
        <div class="lg:col-span-2 space-y-6">
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div
                    class="card-pastel p-6 flex flex-col items-center justify-center text-center"
                >
                    <div
                        class="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center mb-3"
                    >
                        <FileText
                            class="w-6 h-6 text-emerald-600 dark:text-emerald-400"
                        />
                    </div>
                    <span
                        class="text-2xl font-bold text-slate-800 dark:text-slate-100"
                        >98%</span
                    >
                    <span class="text-sm text-slate-500 dark:text-slate-400"
                        >Document Control</span
                    >
                </div>
                <div
                    class="card-pastel p-6 flex flex-col items-center justify-center text-center"
                >
                    <div
                        class="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mb-3"
                    >
                        <Scale
                            class="w-6 h-6 text-blue-600 dark:text-blue-400"
                        />
                    </div>
                    <span
                        class="text-2xl font-bold text-slate-800 dark:text-slate-100"
                        >100%</span
                    >
                    <span class="text-sm text-slate-500 dark:text-slate-400"
                        >Calibration Status</span
                    >
                </div>
                <div
                    class="card-pastel p-6 flex flex-col items-center justify-center text-center"
                >
                    <div
                        class="w-12 h-12 bg-amber-100 dark:bg-amber-900/50 rounded-full flex items-center justify-center mb-3"
                    >
                        <AlertTriangle
                            class="w-6 h-6 text-amber-600 dark:text-amber-400"
                        />
                    </div>
                    <span
                        class="text-2xl font-bold text-slate-800 dark:text-slate-100"
                        >{openNCsCount}</span
                    >
                    <span class="text-sm text-slate-500 dark:text-slate-400"
                        >Open NCs</span
                    >
                </div>
            </div>

            <div class="card-pastel p-6">
                <h3
                    class="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2"
                >
                    <AlertTriangle class="w-5 h-5 text-amber-500" />
                    Non-Conformities (NC)
                </h3>
                <div class="overflow-x-auto">
                    <table class="w-full text-sm text-left">
                        <thead
                            class="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-700 border-b border-slate-100 dark:border-slate-600"
                        >
                            <tr>
                                <th class="px-4 py-3 font-medium">ID</th>
                                <th class="px-4 py-3 font-medium"
                                    >Description</th
                                >
                                <th class="px-4 py-3 font-medium">Severity</th>
                                <th class="px-4 py-3 font-medium">Status</th>
                                <th class="px-4 py-3 font-medium">Date</th>
                            </tr>
                        </thead>
                        <tbody
                            class="divide-y divide-slate-100 dark:divide-slate-700"
                        >
                            {#each $qualityStore as nc (nc.id)}
                                <tr
                                    class="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                                >
                                    <td
                                        class="px-4 py-3 font-mono text-slate-500 dark:text-slate-400"
                                        >{nc.id}</td
                                    >
                                    <td class="px-4 py-3">
                                        <div
                                            class="font-medium text-slate-900 dark:text-slate-100"
                                        >
                                            {nc.title}
                                        </div>
                                        <div
                                            class="text-xs text-slate-500 dark:text-slate-400 truncate max-w-xs"
                                        >
                                            {nc.description}
                                        </div>
                                    </td>
                                    <td class="px-4 py-3">
                                        <span
                                            class={`px-2 py-0.5 rounded-full text-xs font-medium capitalize
                                            ${
                                                nc.severity === "critical"
                                                    ? "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300"
                                                    : nc.severity === "major"
                                                      ? "bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300"
                                                      : "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300"
                                            }`}
                                        >
                                            {nc.severity}
                                        </span>
                                    </td>
                                    <td class="px-4 py-3">
                                        <span
                                            class={`px-2 py-0.5 rounded-full text-xs font-medium capitalize
                                            ${
                                                nc.status === "open"
                                                    ? "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 border border-red-100 dark:border-red-700"
                                                    : nc.status ===
                                                        "investigating"
                                                      ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 border border-blue-100 dark:border-blue-700"
                                                      : "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-700"
                                            }`}
                                        >
                                            {nc.status}
                                        </span>
                                    </td>
                                    <td
                                        class="px-4 py-3 text-slate-500 dark:text-slate-400"
                                        >{nc.dateOpened}</td
                                    >
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Right Column: Quick Actions & Audit Trail -->
        <div class="space-y-6">
            <div class="card-pastel p-6">
                <h3
                    class="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-4"
                >
                    Quick Actions
                </h3>
                <div class="space-y-3">
                    <button
                        class="w-full flex items-center gap-3 p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 transition-colors text-sm font-medium"
                    >
                        <div
                            class="w-8 h-8 rounded-lg bg-indigo-200 dark:bg-indigo-800 flex items-center justify-center"
                        >
                            <ClipboardCheck size={16} />
                        </div>
                        New Audit
                    </button>
                    <button
                        class="w-full flex items-center gap-3 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 transition-colors text-sm font-medium"
                    >
                        <div
                            class="w-8 h-8 rounded-lg bg-emerald-200 dark:bg-emerald-800 flex items-center justify-center"
                        >
                            <CheckCircle size={16} />
                        </div>
                        Log CAPA
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
