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
            return "bg-rose-50 border-rose-200 text-rose-700";
        if (p === "high" || p === "beta")
            return "bg-orange-50 border-orange-200 text-orange-700";
        if (p === "medium" || p === "gamma")
            return "bg-blue-50 border-blue-200 text-blue-700";
        if (p === "low") return "bg-slate-50 border-slate-200 text-slate-600";
        return "bg-slate-50 border-slate-200";
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
        if (!name) return "bg-slate-200 text-slate-500";
        const colors = [
            "bg-indigo-100 text-indigo-700",
            "bg-emerald-100 text-emerald-700",
            "bg-amber-100 text-amber-700",
            "bg-rose-100 text-rose-700",
            "bg-purple-100 text-purple-700",
            "bg-cyan-100 text-cyan-700",
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
            class="p-1.5 bg-white border border-slate-200 rounded-md text-slate-400 hover:text-indigo-600 hover:border-indigo-200 hover:shadow-sm transition-all"
            on:click|stopPropagation={() => dispatch("edit", task)}
            title="Edit Item"
        >
            <Pencil size={12} />
        </button>
        <button
            class="p-1.5 bg-white border border-slate-200 rounded-md text-slate-400 hover:text-rose-600 hover:border-rose-200 hover:shadow-sm transition-all"
            on:click|stopPropagation={() => dispatch("delete", task.id)}
            title="Delete Item"
        >
            <Trash2 size={12} />
        </button>
    </div>

    <div class="flex justify-between items-start mb-2 pr-12">
        <h3 class="font-semibold text-slate-800 text-sm leading-tight">
            {task.title}
        </h3>
        <svelte:component
            this={getIcon(task.priority)}
            size={16}
            class="text-slate-400"
        />
    </div>

    <p class="text-xs text-slate-500 mb-3 line-clamp-2">{task.description}</p>

    <div
        class="flex items-center justify-between border-t border-slate-100 pt-2 mt-2"
    >
        <div class="flex items-center gap-3">
            <!-- Enhanced Owner Avatar -->
            <div class="flex items-center gap-1.5">
                <div
                    class="w-5 h-5 rounded-full {getAvatarColor(
                        task.owner,
                    )} flex items-center justify-center text-[9px] font-bold ring-1 ring-white shadow-sm"
                >
                    {task.owner ? task.owner.charAt(0).toUpperCase() : "?"}
                </div>
                <span
                    class="text-xs font-medium text-slate-500 max-w-[70px] truncate"
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
