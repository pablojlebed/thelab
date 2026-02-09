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

<div class="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
    {#each contexts as ctx}
        <button
            class="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all {activeContext ===
            ctx.id
                ? 'bg-indigo-100 text-indigo-800 shadow-sm ring-2 ring-indigo-300 font-semibold'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}"
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
