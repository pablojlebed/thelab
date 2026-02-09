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
            class="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium shadow-sm"
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
                        class="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-3"
                    >
                        <FileText class="w-6 h-6 text-emerald-600" />
                    </div>
                    <span class="text-2xl font-bold text-slate-800">98%</span>
                    <span class="text-sm text-slate-500">Document Control</span>
                </div>
                <div
                    class="card-pastel p-6 flex flex-col items-center justify-center text-center"
                >
                    <div
                        class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3"
                    >
                        <Scale class="w-6 h-6 text-blue-600" />
                    </div>
                    <span class="text-2xl font-bold text-slate-800">100%</span>
                    <span class="text-sm text-slate-500"
                        >Calibration Status</span
                    >
                </div>
                <div
                    class="card-pastel p-6 flex flex-col items-center justify-center text-center"
                >
                    <div
                        class="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-3"
                    >
                        <AlertTriangle class="w-6 h-6 text-amber-600" />
                    </div>
                    <span class="text-2xl font-bold text-slate-800"
                        >{openNCsCount}</span
                    >
                    <span class="text-sm text-slate-500">Open NCs</span>
                </div>
            </div>

            <div class="card-pastel p-6">
                <h3
                    class="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2"
                >
                    <AlertTriangle class="w-5 h-5 text-amber-500" />
                    Non-Conformities (NC)
                </h3>
                <div class="overflow-x-auto">
                    <table class="w-full text-sm text-left">
                        <thead
                            class="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100"
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
                        <tbody class="divide-y divide-slate-100">
                            {#each $qualityStore as nc (nc.id)}
                                <tr class="hover:bg-slate-50 transition-colors">
                                    <td
                                        class="px-4 py-3 font-mono text-slate-500"
                                        >{nc.id}</td
                                    >
                                    <td class="px-4 py-3">
                                        <div class="font-medium text-slate-900">
                                            {nc.title}
                                        </div>
                                        <div
                                            class="text-xs text-slate-500 truncate max-w-xs"
                                        >
                                            {nc.description}
                                        </div>
                                    </td>
                                    <td class="px-4 py-3">
                                        <span
                                            class={`px-2 py-0.5 rounded-full text-xs font-medium capitalize
                                            ${
                                                nc.severity === "critical"
                                                    ? "bg-red-100 text-red-700"
                                                    : nc.severity === "major"
                                                      ? "bg-orange-100 text-orange-700"
                                                      : "bg-yellow-100 text-yellow-700"
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
                                                    ? "bg-red-50 text-red-600 border border-red-100"
                                                    : nc.status ===
                                                        "investigating"
                                                      ? "bg-blue-50 text-blue-600 border border-blue-100"
                                                      : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                                            }`}
                                        >
                                            {nc.status}
                                        </span>
                                    </td>
                                    <td class="px-4 py-3 text-slate-500"
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
                    class="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-4"
                >
                    Quick Actions
                </h3>
                <div class="space-y-3">
                    <button
                        class="w-full flex items-center gap-3 p-3 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors text-sm font-medium"
                    >
                        <div
                            class="w-8 h-8 rounded-lg bg-indigo-200 flex items-center justify-center"
                        >
                            <ClipboardCheck size={16} />
                        </div>
                        New Audit
                    </button>
                    <button
                        class="w-full flex items-center gap-3 p-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors text-sm font-medium"
                    >
                        <div
                            class="w-8 h-8 rounded-lg bg-emerald-200 flex items-center justify-center"
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
