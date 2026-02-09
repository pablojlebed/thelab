<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { ListTodo, ShieldAlert, TrendingUp } from "lucide-svelte";

    export let activeContext: "tasks" | "capa" | "ci" = "tasks";

    const dispatch = createEventDispatcher();

    const contexts = [
        {
            id: "tasks",
            label: "Tasks",
            icon: ListTodo,
            color: "text-blue-600",
            bg: "bg-blue-50",
        },
        {
            id: "capa",
            label: "CAPA",
            icon: ShieldAlert,
            color: "text-amber-600",
            bg: "bg-amber-50",
        },
        {
            id: "ci",
            label: "Continuous Improvement",
            icon: TrendingUp,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
        },
    ] as const;

    function selectContext(id: typeof activeContext) {
        activeContext = id;
        dispatch("change", id);
    }
</script>

<div
    class="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700"
>
    {#each contexts as ctx}
        <button
            class="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all {activeContext ===
            ctx.id
                ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200 shadow-sm ring-2 ring-indigo-300 dark:ring-indigo-600 font-semibold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50'}"
            on:click={() => selectContext(ctx.id)}
        >
            <ctx.icon
                size={16}
                class={activeContext === ctx.id ? ctx.color : "text-current"}
            />
            {ctx.label}
        </button>
    {/each}
</div>
