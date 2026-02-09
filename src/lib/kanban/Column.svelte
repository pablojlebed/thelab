<script lang="ts">
    import { dndzone } from "svelte-dnd-action";
    import { flip } from "svelte/animate";
    import Card from "./Card.svelte";
    import type { Task } from "./types";
    import { MoreHorizontal } from "lucide-svelte";

    export let title: string;
    export let items: Task[];
    export let onDrop: (items: Task[]) => void;
    export let dragDisabled = false;
    export let commentCounts: Record<string, number> = {};
    export let wipLimit: number = 0; // 0 means no limit

    const flipDurationMs = 200;

    // Determine column accent color based on title
    function getColumnAccent(title: string): string {
        const t = title.toLowerCase();
        // Done/Closed states - green
        if (t === "done" || t === "closed") return "border-t-emerald-500";
        // In Progress/Active states - amber
        if (
            t === "in progress" ||
            t === "investigation" ||
            t === "evaluation" ||
            t === "execution"
        )
            return "border-t-amber-500";
        // Review/Verification states - blue
        if (
            t === "review" ||
            t === "verification" ||
            t === "action plan" ||
            t === "planning"
        )
            return "border-t-blue-500";
        // Impact/Analysis states - purple
        if (t === "impact analysis") return "border-t-purple-500";
        // Default/Backlog states - slate
        return "border-t-slate-300";
    }

    $: isAtCapacity = wipLimit > 0 && items.length >= wipLimit;
    $: columnAccent = getColumnAccent(title);

    function handleDndConsider(e: CustomEvent<any>) {
        items = e.detail.items;
    }

    function handleDndFinalize(e: CustomEvent<any>) {
        onDrop(e.detail.items);
    }
</script>

<div class="flex flex-col h-full min-w-[260px] w-72 mx-1.5">
    <div
        class="bg-white/60 backdrop-blur-md p-3 mb-3 rounded-xl border border-slate-200/60 border-t-4 {columnAccent} shadow-sm flex justify-between items-center group hover:border-slate-300 transition-colors"
    >
        <div class="flex items-center gap-2">
            <h2
                class="text-sm font-bold text-slate-700 uppercase tracking-wider"
            >
                {title}
            </h2>
            <div
                class="px-2 py-0.5 rounded-full text-[10px] font-bold {isAtCapacity
                    ? 'bg-orange-100 text-orange-700 border border-orange-300 animate-pulse'
                    : 'bg-slate-100 text-slate-500 border border-slate-200'}"
            >
                {items.length}{wipLimit > 0 ? `/${wipLimit}` : ""}
            </div>
        </div>
        <button
            class="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 opacity-0 group-hover:opacity-100 transition-all"
        >
            <MoreHorizontal size={16} />
        </button>
    </div>

    <div
        class="flex-1 overflow-y-auto px-1 py-1 rounded-xl bg-slate-100/50 min-h-[200px]"
        use:dndzone={{
            items,
            flipDurationMs,
            dragDisabled,
            dropTargetStyle: {},
        }}
        on:consider={handleDndConsider}
        on:finalize={handleDndFinalize}
    >
        {#each items as item (item.id)}
            <div animate:flip={{ duration: flipDurationMs }}>
                <Card
                    task={item}
                    commentCount={commentCounts[item.id] || 0}
                    on:edit
                    on:delete
                    on:openDetail
                />
            </div>
        {/each}
    </div>
</div>
