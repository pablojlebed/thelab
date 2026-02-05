<script lang="ts">
    import { createEventDispatcher, onMount } from "svelte";
    import { supabase } from "../supabase.js";
    import type { Task, Comment } from "./types";
    import {
        X,
        Shield,
        Zap,
        Skull,
        MessageSquare,
        Send,
        Clock,
        AlertCircle,
        CheckCircle2,
    } from "lucide-svelte";

    export let show = false;
    export let task: Task | null = null;

    const dispatch = createEventDispatcher();

    let comments: Comment[] = [];
    let newComment = "";
    let loading = false;

    $: if (show && task) {
        fetchComments(task.id);
    }

    async function fetchComments(taskId: string) {
        loading = true;
        const { data, error } = await supabase
            .from("comments")
            .select("*")
            .eq("task_id", taskId)
            .order("created_at", { ascending: true });

        if (error) {
            console.error("Error fetching comments:", error);
        } else {
            comments = data || [];
        }
        loading = false;
    }

    async function addComment() {
        if (!newComment.trim() || !task) return;

        const { data, error } = await supabase
            .from("comments")
            .insert({ task_id: task.id, content: newComment.trim() })
            .select()
            .single();

        if (error) {
            console.error("Error adding comment:", error);
            return;
        }

        comments = [...comments, data];
        newComment = "";
        dispatch("commentAdded");
    }

    function close() {
        comments = [];
        newComment = "";
        dispatch("close");
    }

    function getPriorityColor(priority: string) {
        const p = priority.toLowerCase();
        if (p === "critical" || p === "alpha")
            return "bg-rose-50 text-rose-700 border-rose-200";
        if (p === "high" || p === "beta")
            return "bg-orange-50 text-orange-700 border-orange-200";
        if (p === "medium" || p === "gamma")
            return "bg-blue-50 text-blue-700 border-blue-200";
        if (p === "low") return "bg-slate-50 text-slate-700 border-slate-200";
        return "bg-slate-50 text-slate-700 border-slate-200";
    }

    function getIcon(priority: string) {
        const p = priority.toLowerCase();
        if (p === "critical" || p === "alpha") return Skull;
        if (p === "high" || p === "beta") return AlertCircle;
        if (p === "medium" || p === "gamma") return Clock;
        return CheckCircle2;
    }

    function formatDate(dateStr: string) {
        return new Date(dateStr).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    }
</script>

{#if show && task}
    <div
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
    >
        <div
            class="absolute inset-0 bg-slate-900/30 backdrop-blur-sm"
            on:click={close}
            on:keydown={(e) => e.key === "Escape" && close()}
            role="button"
            tabindex="0"
        ></div>

        <div
            class="relative w-full max-w-lg bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden animate-fade-in-up max-h-[80vh] flex flex-col"
        >
            <!-- Header -->
            <div class="p-6 border-b border-slate-100">
                <div class="flex justify-between items-start">
                    <div class="flex-1 pr-4">
                        <div class="flex items-center gap-2 mb-2">
                            <span
                                class="px-2 py-0.5 text-[10px] font-bold uppercase border rounded {getPriorityColor(
                                    task.priority,
                                )}"
                            >
                                {task.priority}
                            </span>
                            <svelte:component
                                this={getIcon(task.priority)}
                                size={14}
                                class="text-slate-400"
                            />
                        </div>
                        <h2 class="text-xl font-bold text-slate-800">
                            {task.title}
                        </h2>
                        <p
                            class="text-sm text-slate-500 mt-1 whitespace-pre-wrap"
                        >
                            {task.description}
                        </p>
                    </div>
                    <button
                        on:click={close}
                        class="text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>
                <div
                    class="mt-4 flex items-center gap-4 text-xs text-slate-500"
                >
                    <span
                        >Owner: <strong class="text-slate-700"
                            >{task.owner}</strong
                        ></span
                    >
                </div>
            </div>

            <!-- Comments Section -->
            <div class="flex-1 overflow-y-auto p-6 bg-slate-50/50">
                <div class="flex items-center gap-2 mb-4">
                    <MessageSquare size={16} class="text-slate-400" />
                    <h3 class="text-sm font-semibold text-slate-700">
                        Activity Log ({comments.length})
                    </h3>
                </div>

                {#if loading}
                    <p class="text-sm text-slate-400 text-center py-4">
                        Loading...
                    </p>
                {:else if comments.length === 0}
                    <p class="text-sm text-slate-400 text-center py-4">
                        No activity yet.
                    </p>
                {:else}
                    <div class="space-y-3">
                        {#each comments as comment}
                            <div
                                class="bg-white border border-slate-200 rounded-lg p-3 shadow-sm"
                            >
                                <p
                                    class="text-sm text-slate-700 whitespace-pre-wrap"
                                >
                                    {comment.content}
                                </p>
                                <p class="text-[10px] text-slate-400 mt-2">
                                    {formatDate(comment.created_at)}
                                </p>
                            </div>
                        {/each}
                    </div>
                {/if}
            </div>

            <!-- Add Comment -->
            <div class="p-4 border-t border-slate-100 bg-white">
                <div class="flex gap-2">
                    <input
                        bind:value={newComment}
                        placeholder="Add a comment..."
                        class="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        on:keydown={(e) => e.key === "Enter" && addComment()}
                    />
                    <button
                        on:click={addComment}
                        class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                    >
                        <Send size={14} />
                    </button>
                </div>
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
