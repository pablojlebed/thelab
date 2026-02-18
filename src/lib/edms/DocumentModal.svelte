<script lang="ts">
    import { fly, fade } from "svelte/transition";
    import { edmsStore } from "../stores/edmsStore";
    import type { LabDocument, DocumentType } from "./types";
    import { X, FilePlus } from "lucide-svelte";

    const { doc = null, onclose = () => {} }: { doc?: LabDocument | null; onclose?: () => void } = $props();

    let isEdit = $derived(doc !== null);

    let title = $state(doc?.title ?? "");
    let type = $state<DocumentType>(doc?.type ?? "SOP");
    let version = $state(doc?.version ?? "1.0");
    let author = $state(doc?.author ?? "");
    let reviewer = $state(doc?.reviewer ?? "");
    let description = $state(doc?.description ?? "");
    let tagsRaw = $state(doc?.tags.join(", ") ?? "");
    let review_due = $state(doc?.review_due ?? "");
    let isSubmitting = $state(false);

    const docTypes: DocumentType[] = [
        "SOP",
        "Protocol",
        "Work Instruction",
        "Safety Data Sheet",
        "Calibration Record",
        "Form",
        "Certificate",
        "Policy",
    ];

    let isValid = $derived(title.trim().length > 0 && author.trim().length > 0);

    const inputClass =
        "w-full px-3 py-2 text-sm rounded-md border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-500/30 focus:border-blue-400 dark:focus:border-blue-500 transition-all";

    const labelClass =
        "block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5";

    function handleSubmit(e: Event) {
        e.preventDefault();
        if (!isValid) return;
        isSubmitting = true;
        const tags = tagsRaw
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean);
        setTimeout(() => {
            if (isEdit && doc) {
                edmsStore.updateDocument(
                    doc.id,
                    { title, type, version, author, reviewer, description, tags, review_due: review_due || undefined },
                    "Document metadata updated."
                );
            } else {
                edmsStore.addDocument({
                    title,
                    type,
                    version,
                    author,
                    reviewer,
                    description,
                    tags,
                    review_due: review_due || undefined,
                });
            }
            isSubmitting = false;
            onclose();
        }, 350);
    }
</script>

<div
    class="fixed inset-0 z-50 flex items-center justify-center p-4"
    transition:fade={{ duration: 150 }}
    role="dialog"
    aria-modal="true"
    onclick={(e) => e.target === e.currentTarget && onclose()}
    onkeydown={(e) => e.key === "Escape" && onclose()}
    tabindex="-1"
>
    <div class="absolute inset-0 bg-slate-900/50 dark:bg-slate-950/70"></div>

    <div
        class="relative w-full max-w-lg bg-white dark:bg-slate-800 rounded-md shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
        transition:fly={{ y: 16, duration: 200 }}
    >
        <!-- Header -->
        <div
            class="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700"
        >
            <div class="flex items-center gap-3">
                <div
                    class="w-7 h-7 rounded-sm bg-blue-600 flex items-center justify-center shrink-0"
                >
                    <FilePlus class="w-4 h-4 text-white" />
                </div>
                <div>
                    <h2
                        class="text-sm font-semibold text-slate-900 dark:text-white"
                    >
                        {isEdit ? "Edit Document" : "New Document"}
                    </h2>
                    <p class="text-xs text-slate-400 dark:text-slate-500">
                        {isEdit
                            ? "Update document metadata"
                            : "Register a new controlled document"}
                    </p>
                </div>
            </div>
            <button
                onclick={onclose}
                class="p-1.5 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
                <X class="w-4 h-4" />
            </button>
        </div>

        <!-- Form -->
        <form
            onsubmit={handleSubmit}
            class="p-6 space-y-4 overflow-y-auto max-h-[72vh]"
        >
            <!-- Title -->
            <div>
                <label class={labelClass}>
                    Title <span class="text-red-500 normal-case tracking-normal">*</span>
                </label>
                <input
                    type="text"
                    bind:value={title}
                    placeholder="e.g. ICP-MS Standard Operating Procedure"
                    class={inputClass}
                />
            </div>

            <!-- Type + Version -->
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class={labelClass}>
                        Type <span class="text-red-500 normal-case tracking-normal">*</span>
                    </label>
                    <select bind:value={type} class={inputClass}>
                        {#each docTypes as dt}
                            <option value={dt}>{dt}</option>
                        {/each}
                    </select>
                </div>
                <div>
                    <label class={labelClass}>Version</label>
                    <input
                        type="text"
                        bind:value={version}
                        placeholder="1.0"
                        class="{inputClass} font-mono"
                    />
                </div>
            </div>

            <!-- Author + Reviewer -->
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class={labelClass}>
                        Author <span class="text-red-500 normal-case tracking-normal">*</span>
                    </label>
                    <input
                        type="text"
                        bind:value={author}
                        placeholder="Name or team"
                        class={inputClass}
                    />
                </div>
                <div>
                    <label class={labelClass}>Reviewer</label>
                    <input
                        type="text"
                        bind:value={reviewer}
                        placeholder="Name or team"
                        class={inputClass}
                    />
                </div>
            </div>

            <!-- Description -->
            <div>
                <label class={labelClass}>Description</label>
                <textarea
                    bind:value={description}
                    placeholder="Briefly describe the document's purpose and scope"
                    rows="3"
                    class="{inputClass} resize-none"
                ></textarea>
            </div>

            <!-- Tags + Review Due -->
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class={labelClass}>Tags</label>
                    <input
                        type="text"
                        bind:value={tagsRaw}
                        placeholder="tag1, tag2, tag3"
                        class={inputClass}
                    />
                </div>
                <div>
                    <label class={labelClass}>Review Due</label>
                    <input
                        type="date"
                        bind:value={review_due}
                        class={inputClass}
                    />
                </div>
            </div>

            <!-- Footer -->
            <div
                class="flex items-center justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-700"
            >
                <button
                    type="button"
                    onclick={onclose}
                    class="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={!isValid || isSubmitting}
                    class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
                >
                    {isSubmitting
                        ? "Saving…"
                        : isEdit
                          ? "Save Changes"
                          : "Create Document"}
                </button>
            </div>
        </form>
    </div>
</div>
