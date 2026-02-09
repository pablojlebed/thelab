<script lang="ts">
    import {
        X,
        AlertTriangle,
        AlertCircle,
        XCircle,
        Send,
    } from "lucide-svelte";

    import { fly, fade } from "svelte/transition";

    export let isOpen = false;
    export let type: "near-miss" | "minor" | "major" | "critical" = "near-miss";
    export let onclose: () => void = () => {};
    export let onsubmit: (detail: any) => void = () => {};

    let title = "";
    let location = "";
    let description = "";
    let isSubmitting = false;

    function closeModal() {
        if (onclose) onclose();
        resetForm();
    }

    function resetForm() {
        title = "";
        location = "";
        description = "";
    }

    function handleSubmit() {
        if (!title || !location || !description) return;

        isSubmitting = true;

        // Simulate API call
        setTimeout(() => {
            if (onsubmit) {
                onsubmit({
                    id: `INC-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
                    title,
                    location,
                    description,
                    severity: type,
                    date: new Date().toISOString().split("T")[0],
                    status: "open",
                    reporter: "Current User", // In a real app, from auth context
                });
            }
            isSubmitting = false;
            closeModal();
        }, 1000);
    }

    $: typeConfig = {
        "near-miss": {
            color: "blue",
            icon: AlertCircle,
            title: "Report Near Miss",
            desc: "A potential hazard or incident that did not result in injury or damage.",
        },
        minor: {
            color: "amber",
            icon: AlertTriangle,
            title: "Report Minor Incident",
            desc: "An event resulting in minor injury or small-scale damage.",
        },
        major: {
            color: "red",
            icon: XCircle,
            title: "Report Major Emergency",
            desc: "A critical situation requiring immediate attention and evacuation.",
        },
        critical: {
            color: "red",
            icon: XCircle,
            title: "Report Critical Incident",
            desc: "A life-threatening situation requiring immediate emergency response.",
        },
    }[type];
</script>

{#if isOpen}
    <div
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
        transition:fade={{ duration: 200 }}
        role="dialog"
        aria-modal="true"
        tabindex="-1"
        onclick={(e) => e.target === e.currentTarget && closeModal()}
        onkeydown={(e) => e.key === "Escape" && closeModal()}
    >
        <div
            class="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden"
            transition:fly={{ y: 20, duration: 300 }}
        >
            <!-- Header -->
            <div
                class={`bg-${typeConfig.color}-50 dark:bg-${typeConfig.color}-900/30 p-6 border-b border-${typeConfig.color}-100 dark:border-${typeConfig.color}-800/50 flex items-start justify-between`}
            >
                <div class="flex items-center gap-4">
                    <div
                        class={`w-12 h-12 rounded-xl bg-${typeConfig.color}-100 dark:bg-${typeConfig.color}-900/50 flex items-center justify-center`}
                    >
                        <svelte:component
                            this={typeConfig.icon}
                            class={`w-6 h-6 text-${typeConfig.color}-600 dark:text-${typeConfig.color}-400`}
                        />
                    </div>
                    <div>
                        <h2
                            class={`text-lg font-bold text-${typeConfig.color}-900 dark:text-${typeConfig.color}-100`}
                        >
                            {typeConfig.title}
                        </h2>
                        <p
                            class={`text-sm text-${typeConfig.color}-700 dark:text-${typeConfig.color}-300`}
                        >
                            {typeConfig.desc}
                        </p>
                    </div>
                </div>
                <button
                    onclick={closeModal}
                    class="p-1 rounded-lg hover:bg-white/50 dark:hover:bg-slate-700/50 transition-colors text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                >
                    <X size={20} />
                </button>
            </div>

            <!-- Body -->
            <div class="p-6 space-y-4">
                <div>
                    <label
                        for="incident-title"
                        class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                        >Incident Title</label
                    >
                    <input
                        id="incident-title"
                        type="text"
                        bind:value={title}
                        class="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        placeholder="Brief summary of what happened"
                    />
                </div>

                <div>
                    <label
                        for="incident-location"
                        class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                        >Location</label
                    >
                    <input
                        id="incident-location"
                        type="text"
                        bind:value={location}
                        class="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        placeholder="e.g., Lab 1, Storage B"
                    />
                </div>

                <div>
                    <label
                        for="incident-description"
                        class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                        >Description</label
                    >
                    <textarea
                        id="incident-description"
                        bind:value={description}
                        rows="4"
                        class="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                        placeholder="Detailed description of the event..."
                    ></textarea>
                </div>
            </div>

            <!-- Footer -->
            <div class="p-6 pt-0 flex justify-end gap-3">
                <button
                    onclick={closeModal}
                    class="px-4 py-2 rounded-lg text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                    Cancel
                </button>
                <button
                    onclick={handleSubmit}
                    disabled={isSubmitting ||
                        !title ||
                        !location ||
                        !description}
                    class={`px-6 py-2 rounded-lg text-white font-medium shadow-md transition-all flex items-center gap-2
                        ${isSubmitting || !title ? "opacity-50 cursor-not-allowed" : "hover:shadow-lg hover:-translate-y-0.5"}
                        bg-${typeConfig.color}-600 hover:bg-${typeConfig.color}-700 shadow-${typeConfig.color}-200`}
                >
                    {#if isSubmitting}
                        <span>Submitting...</span>
                    {:else}
                        <Send size={16} />
                        <span>Submit Report</span>
                    {/if}
                </button>
            </div>
        </div>
    </div>
{/if}
