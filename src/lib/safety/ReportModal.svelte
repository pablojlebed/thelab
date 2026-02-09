<script lang="ts">
    import {
        X,
        AlertTriangle,
        AlertCircle,
        XCircle,
        Send,
    } from "lucide-svelte";
    import { createEventDispatcher } from "svelte";
    import { fly, fade } from "svelte/transition";

    export let isOpen = false;
    export let type: "near-miss" | "minor" | "major" = "near-miss";

    const dispatch = createEventDispatcher();

    let title = "";
    let location = "";
    let description = "";
    let isSubmitting = false;

    function closeModal() {
        dispatch("close");
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
            dispatch("submit", {
                id: `INC-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
                title,
                location,
                description,
                severity: type,
                date: new Date().toISOString().split("T")[0],
                status: "open",
                reporter: "Current User", // In a real app, from auth context
            });
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
    }[type];
</script>

{#if isOpen}
    <div
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
        transition:fade={{ duration: 200 }}
        on:click|self={closeModal}
    >
        <div
            class="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden"
            transition:fly={{ y: 20, duration: 300 }}
        >
            <!-- Header -->
            <div
                class={`bg-${typeConfig.color}-50 p-6 border-b border-${typeConfig.color}-100 flex items-start justify-between`}
            >
                <div class="flex items-center gap-4">
                    <div
                        class={`w-12 h-12 rounded-xl bg-${typeConfig.color}-100 flex items-center justify-center`}
                    >
                        <svelte:component
                            this={typeConfig.icon}
                            class={`w-6 h-6 text-${typeConfig.color}-600`}
                        />
                    </div>
                    <div>
                        <h2
                            class={`text-lg font-bold text-${typeConfig.color}-900`}
                        >
                            {typeConfig.title}
                        </h2>
                        <p class={`text-sm text-${typeConfig.color}-700`}>
                            {typeConfig.desc}
                        </p>
                    </div>
                </div>
                <button
                    on:click={closeModal}
                    class="p-1 rounded-lg hover:bg-white/50 transition-colors text-slate-500 hover:text-slate-700"
                >
                    <X size={20} />
                </button>
            </div>

            <!-- Body -->
            <div class="p-6 space-y-4">
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-1"
                        >Incident Title</label
                    >
                    <input
                        type="text"
                        bind:value={title}
                        class="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        placeholder="Brief summary of what happened"
                    />
                </div>

                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-1"
                        >Location</label
                    >
                    <input
                        type="text"
                        bind:value={location}
                        class="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        placeholder="e.g., Lab 1, Storage B"
                    />
                </div>

                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-1"
                        >Description</label
                    >
                    <textarea
                        bind:value={description}
                        rows="4"
                        class="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                        placeholder="Detailed description of the event..."
                    ></textarea>
                </div>
            </div>

            <!-- Footer -->
            <div class="p-6 pt-0 flex justify-end gap-3">
                <button
                    on:click={closeModal}
                    class="px-4 py-2 rounded-lg text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                >
                    Cancel
                </button>
                <button
                    on:click={handleSubmit}
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
