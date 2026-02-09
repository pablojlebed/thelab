<script lang="ts">
    import {
        FileText,
        BarChart2,
        Download,
        Calendar,
        Filter,
        PieChart,
        Activity,
        ShieldAlert,
    } from "lucide-svelte";
    import { exportToCSV } from "../utils/export";
    import { qualityStore } from "../stores/qualityStore";
    import { safetyStore } from "../stores/safetyStore";

    // Mock data for Utilization vs Cost
    const utilizationData = [
        { month: "Jan", utilization: 78, updates: 2, cost: 1200 },
        { month: "Feb", utilization: 82, updates: 1, cost: 800 },
        { month: "Mar", utilization: 75, updates: 3, cost: 1500 },
        { month: "Apr", utilization: 88, updates: 0, cost: 400 },
        { month: "May", utilization: 92, updates: 1, cost: 950 },
        { month: "Jun", utilization: 85, updates: 2, cost: 1100 },
    ];

    // Computed stats
    $: totalNCs = $qualityStore.filter((nc) => nc.status === "open").length;
    $: openIncidents = $safetyStore.filter((i) => i.status === "open").length;
    $: totalDrafts = $safetyStore.filter((i) => i.status === "draft").length;

    // Chart scaling
    const maxVal = Math.max(...utilizationData.map((d) => d.cost));
    const getHeight = (val: number) => (val / maxVal) * 100;
</script>

<div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
        <div>
            <h2
                class="text-lg font-semibold text-slate-800 dark:text-slate-100"
            >
                Operational Reports
            </h2>
            <p class="text-sm text-slate-500 dark:text-slate-400">
                Cross-module analytics and data export
            </p>
        </div>
        <div class="flex gap-2">
            <button
                class="px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600 flex items-center gap-2"
            >
                <Calendar size={16} />
                Last 6 Months
            </button>
            <button
                class="px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center gap-2"
            >
                <Download size={16} />
                Export Summary
            </button>
        </div>
    </div>

    <!-- Key Metrics -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="card-pastel p-5">
            <div class="flex items-center justify-between mb-2">
                <h3
                    class="text-sm font-medium text-slate-500 dark:text-slate-400"
                >
                    Quality Compliance
                </h3>
                <Activity size={18} class="text-indigo-500" />
            </div>
            <div class="flex items-baseline gap-2">
                <span
                    class="text-2xl font-bold text-slate-800 dark:text-slate-100"
                    >{totalNCs}</span
                >
                <span class="text-sm text-slate-500 dark:text-slate-400"
                    >Open NCs</span
                >
            </div>
            <div
                class="mt-2 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-2 py-1 rounded inline-block"
            >
                Action Required
            </div>
        </div>

        <div class="card-pastel p-5">
            <div class="flex items-center justify-between mb-2">
                <h3
                    class="text-sm font-medium text-slate-500 dark:text-slate-400"
                >
                    Safety Status
                </h3>
                <ShieldAlert size={18} class="text-red-500" />
            </div>
            <div class="flex items-baseline gap-2">
                <span
                    class="text-2xl font-bold text-slate-800 dark:text-slate-100"
                    >{openIncidents}</span
                >
                <span class="text-sm text-slate-500 dark:text-slate-400"
                    >Incidents</span
                >
            </div>
            <div class="mt-2 text-xs text-slate-500 dark:text-slate-400">
                {totalDrafts} Draft Reports Pending
            </div>
        </div>

        <div class="card-pastel p-5">
            <div class="flex items-center justify-between mb-2">
                <h3
                    class="text-sm font-medium text-slate-500 dark:text-slate-400"
                >
                    Instrument Health
                </h3>
                <Activity size={18} class="text-emerald-500" />
            </div>
            <div class="flex items-baseline gap-2">
                <span
                    class="text-2xl font-bold text-slate-800 dark:text-slate-100"
                    >92%</span
                >
                <span class="text-sm text-slate-500 dark:text-slate-400"
                    >Uptime</span
                >
            </div>
            <div
                class="mt-2 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded inline-block"
            >
                Optimal Performance
            </div>
        </div>
    </div>

    <!-- Main Chart Section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Chart -->
        <div class="lg:col-span-2 card-pastel p-6">
            <h3 class="font-semibold text-slate-800 dark:text-slate-100 mb-6">
                Instrument Utilization vs. Maintenance Costs
            </h3>

            <div class="h-64 flex items-end gap-4 px-2">
                {#each utilizationData as data}
                    <div
                        class="flex-1 flex flex-col items-center gap-2 group relative"
                    >
                        <!-- Tooltip -->
                        <div
                            class="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-xs rounded px-2 py-1 pointer-events-none whitespace-nowrap z-10"
                        >
                            Cost: ${data.cost} | Util: {data.utilization}%
                        </div>

                        <!-- Bars Container -->
                        <div
                            class="w-full flex items-end justify-center gap-1 h-full relative"
                        >
                            <!-- Utilization Bar (Background/Line implication) -->
                            <div
                                style="height: {data.utilization}%"
                                class="w-1/2 bg-indigo-200 dark:bg-indigo-900/50 rounded-t-sm transition-all group-hover:bg-indigo-300 dark:group-hover:bg-indigo-800"
                            ></div>
                            <!-- Cost Bar (Foreground) -->
                            <div
                                style="height: {getHeight(data.cost)}%"
                                class="w-1/2 bg-indigo-600 rounded-t-md transition-all group-hover:bg-indigo-700 shadow-sm"
                            ></div>
                        </div>

                        <span
                            class="text-xs font-medium text-slate-500 dark:text-slate-400"
                            >{data.month}</span
                        >
                    </div>
                {/each}
            </div>

            <div
                class="mt-6 flex items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400"
            >
                <div class="flex items-center gap-2">
                    <span
                        class="w-3 h-3 bg-indigo-200 dark:bg-indigo-900/50 rounded-sm"
                    ></span>
                    Utilization (%)
                </div>
                <div class="flex items-center gap-2">
                    <span class="w-3 h-3 bg-indigo-600 rounded-md"></span>
                    Maint. Cost ($)
                </div>
            </div>
        </div>

        <!-- Export Hub -->
        <div class="card-pastel p-6">
            <h3
                class="font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2"
            >
                <Download size={18} class="text-slate-400" />
                Data Export Hub
            </h3>
            <p class="text-sm text-slate-500 dark:text-slate-400 mb-6">
                Download aggregated reports and raw data logs.
            </p>

            <div class="space-y-3">
                <button
                    onclick={() =>
                        exportToCSV(
                            utilizationData,
                            "monthly_utilization_report",
                        )}
                    class="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-indigo-200 dark:hover:border-indigo-700 transition-all group"
                >
                    <div class="flex items-center gap-3">
                        <div
                            class="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform"
                        >
                            <BarChart2 size={16} />
                        </div>
                        <div class="text-left">
                            <span
                                class="block text-sm font-medium text-slate-700 dark:text-slate-200 group-hover:text-indigo-700 dark:group-hover:text-indigo-400"
                                >Utilization Report</span
                            >
                            <span class="block text-xs text-slate-400"
                                >CSV • 12 KB</span
                            >
                        </div>
                    </div>
                    <Download
                        size={16}
                        class="text-slate-300 group-hover:text-indigo-500"
                    />
                </button>

                <button
                    onclick={() => exportToCSV($qualityStore, "quality_nc_log")}
                    class="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-indigo-200 dark:hover:border-indigo-700 transition-all group"
                >
                    <div class="flex items-center gap-3">
                        <div
                            class="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-400 flex items-center justify-center group-hover:scale-110 transition-transform"
                        >
                            <Activity size={16} />
                        </div>
                        <div class="text-left">
                            <span
                                class="block text-sm font-medium text-slate-700 dark:text-slate-200 group-hover:text-indigo-700 dark:group-hover:text-indigo-400"
                                >Quality NC Log</span
                            >
                            <span class="block text-xs text-slate-400"
                                >CSV • Live Data</span
                            >
                        </div>
                    </div>
                    <Download
                        size={16}
                        class="text-slate-300 group-hover:text-indigo-500"
                    />
                </button>

                <button
                    onclick={() =>
                        exportToCSV($safetyStore, "safety_incident_log")}
                    class="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-indigo-200 dark:hover:border-indigo-700 transition-all group"
                >
                    <div class="flex items-center gap-3">
                        <div
                            class="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform"
                        >
                            <ShieldAlert size={16} />
                        </div>
                        <div class="text-left">
                            <span
                                class="block text-sm font-medium text-slate-700 dark:text-slate-200 group-hover:text-indigo-700 dark:group-hover:text-indigo-400"
                                >Safety Incidents</span
                            >
                            <span class="block text-xs text-slate-400"
                                >CSV • Full History</span
                            >
                        </div>
                    </div>
                    <Download
                        size={16}
                        class="text-slate-300 group-hover:text-indigo-500"
                    />
                </button>
            </div>
        </div>
    </div>
</div>
