<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { Save, Plus, X } from "lucide-svelte";
    import { supabase } from "../supabase.js";
    import type { Task } from "./types.js";

    export let show = false;
    export let task: Task | null = null;
    export let context: "tasks" | "capa" | "ci" = "tasks";

    const dispatch = createEventDispatcher();
    const priorities = ["Low", "Medium", "High", "Critical"];

    let title = "";
    let owner = "";
    let description = "";
    let priority: string = "Medium";

    // Reactively update fields when task changes or modal opens
    $: if (show && task) {
        title = task.title;
        owner = task.owner;
        description = task.description;
        priority = task.priority;
    } else if (show && !task) {
        // Reset for new task
        title = "";
        owner = "";
        description = "";
        priority = "Medium";
    }

    function close() {
        dispatch("close");
    }

    function submit() {
        if (!title) return;

        const payload = {
            title,
            owner,
            description,
            priority,
            status: task ? task.status : "", // handled by parent if empty
            // board_id handled by parent
        };

        if (task) {
            dispatch("update", { ...payload, id: task.id });
        } else {
            dispatch("create", payload);
        }

        // Reset form
        title = "";
        owner = "";
        description = "";
        priority = "Medium";
        show = false;
    }

    // Dynamic Labels based on Context
    $: labels = {
        title:
            context === "capa"
                ? "Issue Title"
                : context === "ci"
                  ? "Idea Title"
                  : "Task Name",
        owner:
            context === "capa"
                ? "Responsibility"
                : context === "ci"
                  ? "Champion"
                  : "Assignee",
        description:
            context === "capa"
                ? "Problem Description"
                : context === "ci"
                  ? "Proposal Details"
                  : "Description",
    };
</script>

{#if show}
    <div
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
    >
        <div
            class="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
            on:click={close}
            on:keydown={(e) => e.key === "Escape" && close()}
            role="button"
            tabindex="0"
        ></div>

        <div
            class="relative w-full max-w-md bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden animate-fade-in-up"
        >
            <div class="p-6">
                <div class="flex justify-between items-center mb-6">
                    <h2
                        class="text-lg font-bold text-slate-800 flex items-center gap-2"
                    >
                        {#if task}
                            <Save size={18} class="text-indigo-500" />
                            Update {context.toUpperCase()} Item
                        {:else}
                            <Plus size={18} class="text-indigo-500" />
                            New {context.toUpperCase()} Item
                        {/if}
                    </h2>
                    <button
                        on:click={close}
                        class="text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div class="space-y-4">
                    <div>
                        <label
                            for="item-title"
                            class="block text-xs font-semibold text-slate-500 mb-1 uppercase"
                            >{labels.title}</label
                        >
                        <input
                            id="item-title"
                            bind:value={title}
                            class="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-400"
                            placeholder="e.g. Server Maintenance"
                        />
                    </div>

                    <div>
                        <label
                            for="assignee"
                            class="block text-xs font-semibold text-slate-500 mb-1 uppercase"
                            >{labels.owner}</label
                        >
                        <input
                            id="assignee"
                            bind:value={owner}
                            class="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-400"
                            placeholder="e.g. John Doe"
                        />
                    </div>

                    <div>
                        <label
                            for="description"
                            class="block text-xs font-semibold text-slate-500 mb-1 uppercase"
                            >{labels.description}</label
                        >
                        <textarea
                            id="description"
                            bind:value={description}
                            rows="3"
                            class="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none placeholder:text-slate-400"
                            placeholder="Details..."
                        ></textarea>
                    </div>

                    <div>
                        <fieldset>
                            <legend
                                class="block text-xs font-semibold text-slate-500 mb-2 uppercase"
                                >Priority Level</legend
                            >
                            <div class="flex gap-2">
                                {#each priorities as p}
                                    <button
                                        class="flex-1 py-2 text-xs font-medium border rounded-lg transition-all
                                        {priority === p
                                            ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-bold'
                                            : 'border-slate-200 text-slate-500 hover:bg-slate-50'}"
                                        on:click={() => (priority = p)}
                                        type="button"
                                    >
                                        {p}
                                    </button>
                                {/each}
                            </div>
                        </fieldset>
                    </div>
                </div>

                <button
                    on:click={submit}
                    class="w-full mt-6 bg-indigo-600 text-white font-semibold py-2.5 rounded-lg shadow-sm hover:bg-indigo-700 transition-all duration-200"
                >
                    {task ? "Update" : "Create"}
                </button>
            </div>
        </div>
    </div>
{/if}

<style>
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(10px) scale(0.98);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }
    .animate-fade-in-up {
        animation: fadeInUp 0.2s ease-out forwards;
    }
</style>
