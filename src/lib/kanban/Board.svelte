<script lang="ts">
    import { onMount, createEventDispatcher } from "svelte";
    import Column from "./Column.svelte";
    import MissionModal from "./MissionModal.svelte";
    import TaskDetailModal from "./TaskDetailModal.svelte";
    import type { Column as ColumnType, Task, Board } from "./types";
    import { supabase } from "../supabase.js";
    import { Plus } from "lucide-svelte";

    const dispatch = createEventDispatcher();

    export let context: "tasks" | "capa" | "ci" = "tasks";
    export let searchQuery = "";
    export let selectedAssignee = "";
    export let assignees: string[] = [];

    let showModal = false;
    let showDetailModal = false;
    let detailTask: Task | null = null;
    let commentCounts: Record<string, number> = {};
    let currentBoardId = "";

    $: dispatch("modalState", showModal || showDetailModal);

    // Dynamic Columns based on Context
    let columns: ColumnType[] = [];
    let allTasks: Task[] = [];

    $: {
        // Define columns based on context
        let colDefs: { id: string; title: string }[] = [];
        if (context === "tasks") {
            colDefs = [
                { id: "c1", title: "Backlog" },
                { id: "c2", title: "In Progress" },
                { id: "c3", title: "Review" },
                { id: "c4", title: "Done" },
            ];
        } else if (context === "capa") {
            colDefs = [
                { id: "c1", title: "Identified" },
                { id: "c2", title: "Investigation" },
                { id: "c3", title: "Action Plan" },
                { id: "c4", title: "Verification" },
                { id: "c5", title: "Closed" },
            ];
        } else if (context === "ci") {
            colDefs = [
                { id: "c1", title: "New Idea" },
                { id: "c2", title: "Evaluation" },
                { id: "c3", title: "Planning" },
                { id: "c4", title: "Execution" },
                { id: "c5", title: "Impact Analysis" },
            ];
        }

        // Apply filters
        const filteredTasks = allTasks.filter((t) => {
            const matchesSearch =
                t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                t.description
                    ?.toLowerCase()
                    .includes(searchQuery.toLowerCase());
            const matchesAssignee = selectedAssignee
                ? t.owner === selectedAssignee
                : true;
            return matchesSearch && matchesAssignee;
        });

        columns = colDefs.map((col) => ({
            ...col,
            items: filteredTasks.filter((t) => t.status === col.id),
        }));

        // Extract unique assignees
        const owners = new Set(allTasks.map((t) => t.owner).filter(Boolean));
        assignees = Array.from(owners);
    }

    // React to context changes
    $: if (context) refreshBoard();

    async function refreshBoard() {
        if (!context) return;
        await ensureBoardExists();
        await fetchTasks();
    }

    async function ensureBoardExists() {
        // Find board by name matching context
        const boardName =
            context === "tasks"
                ? "Tasks Board"
                : context === "capa"
                  ? "CAPA Register"
                  : "CI Initiatives";

        const { data, error } = await supabase
            .from("boards")
            .select("id")
            .eq("name", boardName)
            .single();

        if (data) {
            currentBoardId = data.id;
        } else {
            // Create if not exists
            const { data: newBoard, error: createError } = await supabase
                .from("boards")
                .insert({ name: boardName })
                .select()
                .single();

            if (createError) {
                console.error("Error creating board:", createError);
                return;
            }
            currentBoardId = newBoard.id;
        }
    }

    async function fetchTasks() {
        if (!currentBoardId) return;

        const { data, error } = await supabase
            .from("tasks")
            .select("*")
            .eq("board_id", currentBoardId)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching tasks:", error);
            return;
        }

        // Distribute tasks to columns
        // Map DB fields to TS types if needed (though we rely on direct mapping mostly)
        // Note: DB has superhero/mission. We map to owner/description in UI but keep DB structure for now?
        // Let's just use the raw data and cast if types match, or map.
        // For simplicity, we'll map on the fly if needed, but if TS types use 'owner' and DB uses 'superhero', we have a mismatch.
        // I will update the Type definition to match DB or Map it.
        // Let's stick to DB structure for 'Card' props to minimize friction, OR map here.
        // Let's Map here.

        const mappedTasks = data.map((t: any) => ({
            ...t,
            owner: t.superhero,
            description: t.mission,
            // standard fields
        }));

        allTasks = mappedTasks;

        if (mappedTasks.length > 0) {
            fetchCommentCounts(mappedTasks.map((t: any) => t.id));
        }
    }

    async function handleDrop(colId: string, newItems: Task[]) {
        // Optimistic update
        const colIdx = columns.findIndex((c) => c.id === colId);
        columns[colIdx].items = newItems;
        // Optimistic update
        const taskIndex = allTasks.findIndex((t) => t.id === newItems[0]?.id); // This optimistic logic is a bit complex with full list.
        // Simplified: Just update the items in allTasks that are in newItems to have new status
        // But drag and drop might change order.
        // For simplicity, let's just update the status in allTasks and let the reactivity handle column distribution.

        // Wait, dndzone returns the NEW items list for that column.
        // We need to update allTasks to reflect this order + status.
        // This is tricky with a derived store pattern.
        // Actually, dnd-action needs immediate visual feedback on 'columns'.
        // So we MUST update 'columns' directly for DnD to work smoothly ?
        // If 'columns' is derived reactive block, updating it might be overwritten by the reactive block if 'allTasks' doesn't change?
        // No, 'columns = ...' in the reactive block sets it.
        // If we mutually bind or update, we risk cycles.

        // Let's stick to updating allTasks and let the reactive block regenerate columns.
        // BUT dnd requires 'consider' handler to update the visual list immediately.
        // If we rely on allTasks -> columns derivation, it might be too slow or cause jitter?
        // Let's try: Update allTasks.

        // Actually, simpler approach for now to satisfy Types + Feature requirement:
        // Update allTasks statuses.

        const idsInNewCol = new Set(newItems.map((i) => i.id));

        // Update status locallly
        allTasks = allTasks.map((t) => {
            if (idsInNewCol.has(t.id)) {
                return { ...t, status: colId };
            }
            return t;
        });

        // Loop for DB update
        for (const item of newItems) {
            if (item.status !== colId) {
                item.status = colId;
                await supabase
                    .from("tasks")
                    .update({ status: colId })
                    .eq("id", item.id);
            }
        }
    }

    async function handleCreate(e: CustomEvent) {
        const newTask = e.detail;

        if (!currentBoardId) return;

        // DB Mapping: owner -> superhero, description -> mission
        const dbTask = {
            title: newTask.title,
            superhero: newTask.owner,
            mission: newTask.description,
            priority: newTask.priority,
            status: newTask.status || columns[0].id,
            board_id: currentBoardId,
        };

        const { data, error } = await supabase
            .from("tasks")
            .insert(dbTask)
            .select()
            .single();

        if (error) {
            console.error("Error creating task:", error);
            return;
        }

        const mappedTask = {
            ...data,
            owner: data.superhero,
            description: data.mission,
        };

        // Add to column locally
        const colIdx = columns.findIndex((c) => c.id === mappedTask.status);
        if (colIdx >= 0) {
            columns[colIdx].items = [mappedTask, ...columns[colIdx].items];
            columns = [...columns];
        }

        showModal = false;
    }

    export function createTask() {
        editingTask = null;
        showModal = true;
    }

    let editingTask: Task | null = null;

    async function handleUpdate(e: CustomEvent) {
        const updatedTask = e.detail;

        // Optimistic update
        const colIdx = columns.findIndex((c) => c.id === updatedTask.status);
        if (colIdx >= 0) {
            const taskIdx = columns[colIdx].items.findIndex(
                (t) => t.id === updatedTask.id,
            );
            if (taskIdx >= 0) {
                columns[colIdx].items[taskIdx] = updatedTask;
                columns = [...columns];
            }
        }

        showModal = false;

        const { error } = await supabase
            .from("tasks")
            .update({
                title: updatedTask.title,
                superhero: updatedTask.owner,
                mission: updatedTask.description,
                priority: updatedTask.priority,
            })
            .eq("id", updatedTask.id);

        if (error) console.error("Error updating task:", error);
    }

    async function handleDelete(e: CustomEvent) {
        const taskId = e.detail;

        // Optimistic delete
        columns = columns.map((col) => ({
            ...col,
            items: col.items.filter((t) => t.id !== taskId),
        }));

        const { error } = await supabase
            .from("tasks")
            .delete()
            .eq("id", taskId);

        if (error) console.error("Error deleting task:", error);
    }

    function openEditModal(e: CustomEvent) {
        editingTask = e.detail;
        showModal = true;
    }

    function openDetailModal(e: CustomEvent) {
        detailTask = e.detail;
        showDetailModal = true;
    }

    async function fetchCommentCounts(taskIds: string[]) {
        if (taskIds.length === 0) return;

        const { data, error } = await supabase
            .from("comments")
            .select("task_id")
            .in("task_id", taskIds);

        if (error) {
            console.error("Error fetching comment counts:", error);
            return;
        }

        const counts: Record<string, number> = {};
        data.forEach((c: any) => {
            counts[c.task_id] = (counts[c.task_id] || 0) + 1;
        });
        commentCounts = counts;
    }
</script>

<div class="flex flex-col h-full">
    {#if !currentBoardId}
        <div class="flex-1 flex items-center justify-center">
            <div
                class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"
            ></div>
        </div>
    {:else}
        <div
            class="flex h-full overflow-x-auto p-2 md:p-6 items-start justify-start gap-4"
        >
            {#each columns as column (column.id)}
                <Column
                    title={column.title}
                    items={column.items}
                    {commentCounts}
                    onDrop={(newItems) => handleDrop(column.id, newItems)}
                    on:edit={openEditModal}
                    on:delete={handleDelete}
                    on:openDetail={openDetailModal}
                />
            {/each}

            <!-- Collapsed Add Column Button (Settings-like) -->
            <div class="shrink-0 mx-1.5">
                <button
                    class="w-10 h-10 border border-dashed border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-center text-slate-300 dark:text-slate-600 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-200 dark:hover:border-indigo-700 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/30 transition-all"
                    title="Add Column"
                >
                    <Plus size={18} />
                </button>
            </div>
        </div>
    {/if}

    <MissionModal
        bind:show={showModal}
        task={editingTask}
        {context}
        on:close={() => (showModal = false)}
        on:create={handleCreate}
        on:update={handleUpdate}
    />

    <TaskDetailModal
        bind:show={showDetailModal}
        task={detailTask}
        on:close={() => (showDetailModal = false)}
        on:commentAdded={() => context && fetchTasks()}
    />
</div>
