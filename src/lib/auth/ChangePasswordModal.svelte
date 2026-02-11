<script lang="ts">
    import { X, Lock, Eye, EyeOff, Check, AlertCircle } from "lucide-svelte";
    import { authStore } from "../stores/authStore";

    let { onclose }: { onclose: () => void } = $props();

    let newPassword = $state("");
    let confirmPassword = $state("");
    let showNewPassword = $state(false);
    let showConfirmPassword = $state(false);
    let isSubmitting = $state(false);
    let errorMessage = $state("");
    let successMessage = $state("");

    // Validation
    let passwordMinLength = $derived(newPassword.length >= 8);
    let passwordsMatch = $derived(
        newPassword === confirmPassword && confirmPassword.length > 0,
    );
    let isValid = $derived(passwordMinLength && passwordsMatch);

    async function handleSubmit(e: Event) {
        e.preventDefault();
        if (!isValid || isSubmitting) return;

        isSubmitting = true;
        errorMessage = "";
        successMessage = "";

        const result = await authStore.changePassword(newPassword);

        if (result.success) {
            successMessage = "Password changed successfully!";
            newPassword = "";
            confirmPassword = "";
            setTimeout(() => {
                onclose();
            }, 1500);
        } else {
            errorMessage = result.error || "Failed to change password";
        }

        isSubmitting = false;
    }

    function handleBackdropClick(e: MouseEvent) {
        if (e.target === e.currentTarget) {
            onclose();
        }
    }

    function handleKeydown(e: KeyboardEvent) {
        if (e.key === "Escape") {
            onclose();
        }
    }
</script>

<svelte:window onkeydown={handleKeydown} />

<!-- Backdrop -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
    class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in"
    onclick={handleBackdropClick}
>
    <!-- Modal -->
    <div
        class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden border border-slate-200 dark:border-slate-700 animate-scale-in"
    >
        <!-- Header -->
        <div
            class="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700"
        >
            <div class="flex items-center gap-3">
                <div
                    class="w-9 h-9 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center"
                >
                    <Lock
                        class="w-4 h-4 text-indigo-600 dark:text-indigo-400"
                    />
                </div>
                <h2
                    class="text-lg font-semibold text-slate-800 dark:text-slate-100"
                >
                    Change Password
                </h2>
            </div>
            <button
                onclick={onclose}
                class="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
                <X class="w-5 h-5" />
            </button>
        </div>

        <!-- Body -->
        <form onsubmit={handleSubmit} class="p-6 space-y-5">
            <!-- Success message -->
            {#if successMessage}
                <div
                    class="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-lg"
                >
                    <Check
                        class="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0"
                    />
                    <p
                        class="text-sm text-emerald-700 dark:text-emerald-300 font-medium"
                    >
                        {successMessage}
                    </p>
                </div>
            {/if}

            <!-- Error message -->
            {#if errorMessage}
                <div
                    class="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-lg"
                >
                    <AlertCircle
                        class="w-4 h-4 text-red-600 dark:text-red-400 shrink-0"
                    />
                    <p
                        class="text-sm text-red-700 dark:text-red-300 font-medium"
                    >
                        {errorMessage}
                    </p>
                </div>
            {/if}

            <!-- New Password -->
            <div>
                <label
                    for="new-password"
                    class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                >
                    New Password
                </label>
                <div class="relative">
                    <input
                        id="new-password"
                        type={showNewPassword ? "text" : "password"}
                        bind:value={newPassword}
                        placeholder="Enter new password"
                        class="w-full px-4 py-2.5 pr-10 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-500/50 focus:border-indigo-400 dark:focus:border-indigo-500 transition-all text-sm"
                        autocomplete="new-password"
                    />
                    <button
                        type="button"
                        onclick={() => (showNewPassword = !showNewPassword)}
                        class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    >
                        {#if showNewPassword}
                            <EyeOff class="w-4 h-4" />
                        {:else}
                            <Eye class="w-4 h-4" />
                        {/if}
                    </button>
                </div>
            </div>

            <!-- Confirm Password -->
            <div>
                <label
                    for="confirm-password"
                    class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                >
                    Confirm New Password
                </label>
                <div class="relative">
                    <input
                        id="confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        bind:value={confirmPassword}
                        placeholder="Confirm new password"
                        class="w-full px-4 py-2.5 pr-10 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-500/50 focus:border-indigo-400 dark:focus:border-indigo-500 transition-all text-sm"
                        autocomplete="new-password"
                    />
                    <button
                        type="button"
                        onclick={() =>
                            (showConfirmPassword = !showConfirmPassword)}
                        class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    >
                        {#if showConfirmPassword}
                            <EyeOff class="w-4 h-4" />
                        {:else}
                            <Eye class="w-4 h-4" />
                        {/if}
                    </button>
                </div>
            </div>

            <!-- Validation hints -->
            <div class="space-y-1.5">
                <div class="flex items-center gap-2">
                    <div
                        class={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${passwordMinLength ? "bg-emerald-100 dark:bg-emerald-500/20" : "bg-slate-100 dark:bg-slate-700"}`}
                    >
                        <Check
                            class={`w-2.5 h-2.5 transition-colors ${passwordMinLength ? "text-emerald-600 dark:text-emerald-400" : "text-slate-300 dark:text-slate-600"}`}
                        />
                    </div>
                    <span
                        class={`text-xs transition-colors ${passwordMinLength ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 dark:text-slate-500"}`}
                    >
                        At least 8 characters
                    </span>
                </div>
                <div class="flex items-center gap-2">
                    <div
                        class={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${passwordsMatch ? "bg-emerald-100 dark:bg-emerald-500/20" : "bg-slate-100 dark:bg-slate-700"}`}
                    >
                        <Check
                            class={`w-2.5 h-2.5 transition-colors ${passwordsMatch ? "text-emerald-600 dark:text-emerald-400" : "text-slate-300 dark:text-slate-600"}`}
                        />
                    </div>
                    <span
                        class={`text-xs transition-colors ${passwordsMatch ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 dark:text-slate-500"}`}
                    >
                        Passwords match
                    </span>
                </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center justify-end gap-3 pt-2">
                <button
                    type="button"
                    onclick={onclose}
                    class="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={!isValid || isSubmitting}
                    class="px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 dark:disabled:bg-indigo-800 disabled:cursor-not-allowed rounded-lg transition-all shadow-sm hover:shadow-md disabled:shadow-none flex items-center gap-2"
                >
                    {#if isSubmitting}
                        <div
                            class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
                        ></div>
                        Updating...
                    {:else}
                        <Lock class="w-4 h-4" />
                        Update Password
                    {/if}
                </button>
            </div>
        </form>
    </div>
</div>

<style>
    @keyframes fade-in {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
    @keyframes scale-in {
        from {
            opacity: 0;
            transform: scale(0.95);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
    .animate-fade-in {
        animation: fade-in 0.2s ease-out;
    }
    .animate-scale-in {
        animation: scale-in 0.2s ease-out;
    }
</style>
