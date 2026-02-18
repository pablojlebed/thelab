<script lang="ts">
    import type { Task } from "./types";
    import {
        Shield,
        Zap,
        Skull,
        Pencil,
        Trash2,
        MessageSquare,
        AlertCircle,
        CheckCircle2,
        Clock,
        Calendar,
    } from "lucide-svelte";
    import { onMount, onDestroy, createEventDispatcher } from "svelte";
    import VanillaTilt from "vanilla-tilt";

    export let task: Task;
    export let commentCount = 0;

    let cardElement: HTMLElement;
    let tiltInstance: any;
    const dispatch = createEventDispatcher();

    onMount(() => {
        if (cardElement) {
            VanillaTilt.init(cardElement, {
                max: 3,
                speed: 400,
                glare: false,
                scale: 1.01,
            });
            tiltInstance = (cardElement as any).vanillaTilt;
        }
    });

    onDestroy(() => {
        if (tiltInstance) {
            tiltInstance.destroy();
        }
    });

    function getPriorityColor(priority: string) {
        // Handle both legacy and new priorities
        const p = priority.toLowerCase();
        if (p === "critical" || p === "alpha")
            return "bg-rose-50 dark:bg-rose-900/30 border-rose-200 dark:border-rose-700 text-rose-700 dark:text-rose-300";
        if (p === "high" || p === "beta")
            return "bg-orange-50 dark:bg-orange-900/30 border-orange-200 dark:border-orange-700 text-orange-700 dark:text-orange-300";
        if (p === "medium" || p === "gamma")
            return "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300";
        if (p === "low")
            return "bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300";
        return "bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600";
    }

    function getIcon(priority: string) {
        const p = priority.toLowerCase();
        if (p === "critical" || p === "alpha") return Skull;
        if (p === "high" || p === "beta") return AlertCircle;
        if (p === "medium" || p === "gamma") return Clock;
        return CheckCircle2;
    }

    // Avatar color based on owner name
    function getAvatarColor(name: string): string {
        if (!name)
            return "bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400";
        const colors = [
            "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300",
            "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300",
            "bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300",
            "bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300",
            "bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300",
            "bg-cyan-100 dark:bg-cyan-900/50 text-cyan-700 dark:text-cyan-300",
        ];
        const hash = name.charCodeAt(0) % colors.length;
        return colors[hash];
    }

    // Date formatting and overdue check
    function formatDueDate(dateStr: string | undefined): {
        text: string;
        isOverdue: boolean;
    } {
        if (!dateStr) return { text: "", isOverdue: false };
        const date = new Date(dateStr);
        const now = new Date();
        const isOverdue = date < now;

        // Format as "Feb 9" or "Feb 9, 2027" if different year
        const sameYear = date.getFullYear() === now.getFullYear();
        const options: Intl.DateTimeFormatOptions = sameYear
            ? { month: "short", day: "numeric" }
            : { month: "short", day: "numeric", year: "numeric" };

        return {
            text: date.toLocaleDateString("en-US", options),
            isOverdue,
        };
    }

    $: dueInfo = formatDueDate(task.due_date);

    function handleCardClick() {
        dispatch("openDetail", task);
    }
</script>

<div
    bind:this={cardElement}
    class="card-pastel p-4 mb-3 cursor-pointer active:cursor-grabbing group hover:shadow-md relative"
    on:click={handleCardClick}
    on:keydown={(e) => e.key === "Enter" && handleCardClick()}
    role="button"
    tabindex="0"
>
    <!-- Actions (Visible on Hover) -->
    <div
        class="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
    >
        <button
            class="p-1.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-200 dark:hover:border-indigo-600 hover:shadow-sm transition-all"
            on:click|stopPropagation={() => dispatch("edit", task)}
            title="Edit Item"
        >
            <Pencil size={12} />
        </button>
        <button
            class="p-1.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-200 dark:hover:border-rose-600 hover:shadow-sm transition-all"
            on:click|stopPropagation={() => dispatch("delete", task.id)}
            title="Delete Item"
        >
            <Trash2 size={12} />
        </button>
    </div>

    <div class="flex justify-between items-start mb-2 pr-12">
        <h3
            class="font-semibold text-slate-800 dark:text-slate-100 text-sm leading-tight"
        >
            {task.title}
        </h3>
        <svelte:component
            this={getIcon(task.priority)}
            size={16}
            class="text-slate-400"
        />
    </div>

    <p class="text-xs text-slate-500 dark:text-slate-400 mb-3 line-clamp-2">
        {task.description}
    </p>

    <div
        class="flex items-center justify-between border-t border-slate-100 dark:border-slate-700 pt-2 mt-2"
    >
        <div class="flex items-center gap-3">
            <!-- Enhanced Owner Avatar -->
            <div class="flex items-center gap-1.5">
                <div
                    class="w-5 h-5 rounded-full {getAvatarColor(
                        task.owner,
                    )} flex items-center justify-center text-[9px] font-bold ring-1 ring-white dark:ring-slate-700 shadow-sm"
                >
                    {task.owner ? task.owner.charAt(0).toUpperCase() : "?"}
                </div>
                <span
                    class="text-xs font-medium text-slate-500 dark:text-slate-400 max-w-17.5 truncate"
                >
                    {task.owner}
                </span>
            </div>
            {#if commentCount > 0}
                <span class="flex items-center gap-1 text-xs text-slate-400">
                    <MessageSquare size={12} />
                    {commentCount}
                </span>
            {/if}
            {#if dueInfo.text}
                <span
                    class="flex items-center gap-1 text-xs {dueInfo.isOverdue
                        ? 'text-red-600 font-semibold'
                        : 'text-slate-400'}"
                >
                    <Calendar
                        size={12}
                        class={dueInfo.isOverdue ? "text-red-600" : ""}
                    />
                    {dueInfo.text}
                </span>
            {/if}
        </div>
        <div
            class="px-2 py-0.5 rounded text-[10px] font-bold uppercase border {getPriorityColor(
                task.priority,
            )}"
        >
            {task.priority}
        </div>
    </div>
</div>
