<script lang="ts">
    import { Beaker, Mail, Lock, AlertCircle, Loader2 } from "lucide-svelte";
    import { authStore, isDev } from "../stores/authStore";
    import { fade, fly } from "svelte/transition";

    let email = $state("");
    let password = $state("");
    let isLoading = $state(false);
    let error = $state("");
    let showDevBypass = $state(isDev);

    async function handleSubmit(e: Event) {
        e.preventDefault();
        if (!email || !password) {
            error = "Please enter both email and password";
            return;
        }

        isLoading = true;
        error = "";

        const success = await authStore.login(email, password);

        if (!success) {
            error = "Invalid email or password";
        }

        isLoading = false;
    }

    function handleDevBypass() {
        authStore.devLogin();
    }
</script>

<div
    class="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 via-indigo-50/30 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-4"
    transition:fade={{ duration: 300 }}
>
    <div
        class="w-full max-w-md"
        transition:fly={{ y: 20, duration: 400, delay: 100 }}
    >
        <!-- Logo & Header -->
        <div class="text-center mb-8">
            <div
                class="w-16 h-16 rounded-2xl bg-linear-to-tr from-indigo-500 to-purple-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200 dark:shadow-indigo-900/50"
            >
                <Beaker class="w-8 h-8 text-white" />
            </div>
            <h1
                class="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300"
            >
                RadioAnalysis Lab
            </h1>
            <p class="text-slate-500 dark:text-slate-400 mt-2">
                Sign in to access the control center
            </p>
        </div>

        <!-- Login Card -->
        <div
            class="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-200/60 dark:border-slate-700/60 p-8"
        >
            <form onsubmit={handleSubmit} class="space-y-5">
                <!-- Email Field -->
                <div>
                    <label
                        for="email"
                        class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                    >
                        Email Address
                    </label>
                    <div class="relative">
                        <div
                            class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                        >
                            <Mail class="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                            id="email"
                            type="email"
                            bind:value={email}
                            class="block w-full pl-10 pr-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl leading-5 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-700 focus:border-indigo-400 dark:focus:border-indigo-500 sm:text-sm shadow-sm transition-all"
                            placeholder="you@example.com"
                        />
                    </div>
                </div>

                <!-- Password Field -->
                <div>
                    <label
                        for="password"
                        class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                    >
                        Password
                    </label>
                    <div class="relative">
                        <div
                            class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                        >
                            <Lock class="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                            id="password"
                            type="password"
                            bind:value={password}
                            class="block w-full pl-10 pr-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl leading-5 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-700 focus:border-indigo-400 dark:focus:border-indigo-500 sm:text-sm shadow-sm transition-all"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                <!-- Error Message -->
                {#if error}
                    <div
                        class="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm"
                        transition:fly={{ y: -10, duration: 200 }}
                    >
                        <AlertCircle class="w-4 h-4 shrink-0" />
                        {error}
                    </div>
                {/if}

                <!-- Submit Button -->
                <button
                    type="submit"
                    disabled={isLoading}
                    class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-xl font-medium shadow-lg shadow-indigo-200 dark:shadow-indigo-900/50 hover:bg-indigo-700 hover:shadow-indigo-300 dark:hover:shadow-indigo-800/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {#if isLoading}
                        <Loader2 class="w-5 h-5 animate-spin" />
                        Signing in...
                    {:else}
                        Sign In
                    {/if}
                </button>
            </form>
        </div>

        <!-- Dev Bypass Button -->
        {#if showDevBypass}
            <div class="mt-4" transition:fade>
                <button
                    onclick={handleDevBypass}
                    class="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 rounded-xl text-sm font-medium border-2 border-dashed border-amber-300 dark:border-amber-700 hover:bg-amber-200 dark:hover:bg-amber-900/70 hover:border-amber-400 dark:hover:border-amber-600 transition-all"
                >
                    🔓 Dev Mode: Skip Login
                </button>
                <p
                    class="text-xs text-center text-amber-600 dark:text-amber-500 mt-2"
                >
                    This button only appears in development mode
                </p>
            </div>
        {/if}
    </div>
</div>
