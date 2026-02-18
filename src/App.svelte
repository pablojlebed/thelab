<script lang="ts">
    import { onMount } from "svelte";
    import { themeStore } from "./lib/stores/themeStore";
    import {
        Activity,
        Beaker,
        Users,
        ShieldAlert,
        FileText,
        Settings,
        Menu,
        Home,
        BookOpen,
        Zap,
        Bell,
        Search,
        Archive,
        Database,
        ClipboardCheck,
        Scale,
        FileCheck,
        AlertTriangle,
        Layout,
        ArrowRight,
        LogOut,
        Lock,
        Moon,
        Sun,
    } from "lucide-svelte";
    import Board from "./lib/kanban/Board.svelte";
    import EDMSView from "./lib/edms/EDMSView.svelte";
    import CAPAGuide from "./lib/edms/CAPAGuide.svelte";
    import ContextSelector from "./lib/kanban/ContextSelector.svelte";
    import BookingSystem from "./lib/booking/BookingSystem.svelte";
    import PersonnelView from "./lib/personnel/PersonnelView.svelte";
    import SafetyView from "./lib/safety/SafetyView.svelte";
    import QualityView from "./lib/quality/QualityView.svelte";
    import ReportsView from "./lib/reports/ReportsView.svelte";
    import LoginPage from "./lib/auth/LoginPage.svelte";
    import ChangePasswordModal from "./lib/auth/ChangePasswordModal.svelte";
    import { safetyStore } from "./lib/stores/safetyStore";
    import {
        authStore,
        isAuthenticated,
        currentUser,
        isAuthLoading,
        isDev,
    } from "./lib/stores/authStore";

    let activeTab = $state("hub");
    let isSidebarOpen = $state(true);
    let isDark = $state(false);
    let showChangePassword = $state(false);

    // Auth state
    let authenticated = $state(false);
    let loading = $state(true);
    let user = $state<any>(null);

    // Subscribe to auth store
    isAuthenticated.subscribe((value) => (authenticated = value));
    isAuthLoading.subscribe((value) => (loading = value));
    currentUser.subscribe((value) => (user = value));
    themeStore.subscribe((value) => (isDark = value));

    // Initialize auth & theme on mount
    onMount(() => {
        authStore.init();
        themeStore.init();
    });

    function toggleSidebar() {
        isSidebarOpen = !isSidebarOpen;
    }

    function handleLogout() {
        authStore.logout();
    }

    function toggleTheme() {
        themeStore.toggle();
    }

    // Kanban State
    let kanbanContext = $state<"tasks" | "capa" | "ci">("tasks");
    let kanbanSearchQuery = $state("");
    let kanbanAssignee = $state("");
    let kanbanAssignees = $state<string[]>([]);
    let boardComponent: any = $state();
    let showCAPAGuide = $state(false);
    let kanbanActiveUsers = $state<any[]>([]); // Users currently present on the board

    function handleSimulateAlarm() {
        safetyStore.addDraft({
            title: "Fume Hood Alarm",
            description:
                "Automated alert: Fume Hood #2 airflow dropped below threshold during operation.",
            severity: "major",
            location: "Lab 2 (Analysis)",
            reportedBy: "System Automation",
        });
        activeTab = "safety";
    }
</script>

<!-- Loading State -->
{#if loading}
    <div
        class="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900"
    >
        <div class="text-center">
            <div
                class="w-12 h-12 rounded-sm bg-blue-600 flex items-center justify-center mx-auto mb-4 animate-pulse"
            >
                <Beaker class="w-6 h-6 text-white" />
            </div>
            <p class="text-slate-500 dark:text-slate-400 text-sm">Loading...</p>
        </div>
    </div>
    <!-- Login Page -->
{:else if !authenticated}
    <LoginPage />
    <!-- Main App -->
{:else}
    <div
        class="min-h-screen flex bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans selection:bg-indigo-100 selection:text-indigo-900"
    >
        <!-- Sidebar -->
        <aside
            class={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0`}
        >
            <div class="h-full flex flex-col">
                <!-- Logo Area -->
                <div
                    class="h-16 flex items-center px-6 border-b border-slate-800"
                >
                    <div
                        class="w-7 h-7 rounded-sm bg-blue-600 flex items-center justify-center mr-3"
                    >
                        <Beaker class="w-4 h-4 text-white" />
                    </div>
                    <span
                        class="font-semibold text-sm tracking-widest uppercase text-white"
                    >
                        RadioAnalysis
                    </span>
                </div>

                <!-- Navigation -->
                <nav class="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
                    {#each [{ id: "hub", label: "Control Center", icon: Home }, { id: "kanban", label: "Kanban Board", icon: Layout }, { id: "dashboard", label: "Dashboard", icon: Activity }, { id: "instruments", label: "Instruments", icon: Beaker }, { id: "personnel", label: "Personnel", icon: Users }, { id: "safety", label: "Safety & Incidents", icon: ShieldAlert }, { id: "quality", label: "Quality (ISO 17025)", icon: ClipboardCheck }, { id: "documents", label: "Documents", icon: FileCheck }, { id: "reports", label: "Reports", icon: FileText }] as item}
                        <button
                            class={`w-full flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-150 group ${
                                activeTab === item.id
                                    ? "bg-white/10 text-white"
                                    : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
                            }`}
                            onclick={() => (activeTab = item.id)}
                        >
                            <item.icon
                                class={`w-4 h-4 mr-3 transition-colors ${
                                    activeTab === item.id
                                        ? "text-blue-400"
                                        : "text-slate-500 group-hover:text-slate-300"
                                }`}
                            />
                            {item.label}
                        </button>
                    {/each}
                </nav>

                <!-- Bottom Actions -->
                <div
                    class="p-4 border-t border-slate-800"
                >
                    <button
                        class="flex items-center w-full px-3 py-2 text-sm font-medium text-slate-400 rounded-md hover:bg-white/5 hover:text-slate-100 transition-colors"
                    >
                        <Settings class="w-5 h-5 mr-3 text-slate-500" />
                        Settings
                    </button>
                </div>
            </div>
        </aside>

        <!-- Main Content -->
        <main class="flex-1 flex flex-col min-w-0 overflow-hidden">
            <!-- Header -->
            <header
                class="h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-40 transition-colors duration-300"
            >
                <button
                    class="md:hidden p-2 -ml-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-md"
                    onclick={toggleSidebar}
                >
                    <Menu class="w-6 h-6" />
                </button>

                <div class="flex items-center justify-end w-full space-x-4">
                    <!-- Theme Toggle -->
                    <button
                        onclick={toggleTheme}
                        class="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
                        title={isDark
                            ? "Switch to light mode"
                            : "Switch to dark mode"}
                    >
                        {#if isDark}
                            <Sun class="w-5 h-5" />
                        {:else}
                            <Moon class="w-5 h-5" />
                        {/if}
                    </button>

                    <div class="flex items-center space-x-2">
                        <span
                            class="inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"
                        ></span>
                        <span
                            class="text-xs font-medium text-slate-500 dark:text-slate-400"
                            >System Operational</span
                        >
                    </div>

                    <!-- Dev Mode Indicator -->
                    {#if isDev}
                        <span
                            class="px-2 py-1 bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-medium rounded-md border border-amber-200 dark:border-amber-500/30"
                        >
                            DEV MODE
                        </span>
                    {/if}

                    <!-- User Menu -->
                    <div class="flex items-center gap-3">
                        <div class="text-right hidden sm:block">
                            <p
                                class="text-sm font-medium text-slate-700 dark:text-slate-200"
                            >
                                {user?.name || "User"}
                            </p>
                            <p
                                class="text-xs text-slate-400 dark:text-slate-500"
                            >
                                {user?.role || "guest"}
                            </p>
                        </div>
                        <div
                            class="h-8 w-8 rounded-full bg-blue-50 dark:bg-blue-500/20 border border-blue-200 dark:border-blue-500/30 flex items-center justify-center text-blue-700 dark:text-blue-300 font-medium text-sm"
                        >
                            {user?.name
                                ?.split(" ")
                                .map((n: string) => n[0])
                                .join("") || "U"}
                        </div>
                        <button
                            onclick={() => (showChangePassword = true)}
                            class="p-2 text-slate-400 dark:text-slate-500 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-md transition-colors"
                            title="Change Password"
                        >
                            <Lock class="w-4 h-4" />
                        </button>
                        <button
                            onclick={handleLogout}
                            class="p-2 text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors"
                            title="Logout"
                        >
                            <LogOut class="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </header>

            <!-- Content Scroll Area -->
            <div class="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
                <div class="max-w-6xl mx-auto space-y-6">
                    <!-- Page Header -->
                    <div class="flex items-center justify-between">
                        <h1
                            class="text-xl font-semibold tracking-tight text-slate-900 dark:text-white capitalize"
                        >
                            {activeTab === "hub"
                                    ? "Control Center"
                                    : activeTab === "documents"
                                      ? "Document Management"
                                      : activeTab}
                        </h1>
                        <div class="flex space-x-3">
                            {#if activeTab === "kanban"}
                                <div class="flex items-center gap-2">
                                    <ContextSelector
                                        activeContext={kanbanContext}
                                        on:change={(e) =>
                                            (kanbanContext = e.detail as
                                                | "tasks"
                                                | "capa"
                                                | "ci")}
                                    />

                                    <!-- Presence Avatars -->
                                    <div
                                        class="hidden md:flex -space-x-2 mr-2 overflow-hidden"
                                    >
                                        {#each kanbanActiveUsers as user}
                                            <div
                                                class={`flex items-center justify-center h-8 w-8 rounded-full ring-2 ring-white dark:ring-slate-800 ${user.color || "bg-slate-400"} text-xs leading-none text-white font-medium shadow-sm cursor-help`}
                                                title={`On Board: ${user.name}`}
                                            >
                                                {user.name[0]?.toUpperCase()}
                                            </div>
                                        {/each}
                                    </div>

                                    {#if kanbanContext === "capa"}
                                        <button
                                            onclick={() => (showCAPAGuide = true)}
                                            class="px-4 py-2 rounded-md border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors flex items-center gap-2"
                                        >
                                            How it works
                                        </button>
                                    {/if}
                                    <button
                                        onclick={() =>
                                            boardComponent.createTask()}
                                        class="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-all flex items-center gap-2"
                                    >
                                        New Task
                                    </button>
                                </div>
                            {/if}
                        </div>
                    </div>

                    {#if activeTab === "kanban"}
                        <div
                            class="h-[calc(100vh-14rem)] bg-slate-50 dark:bg-slate-800/50 rounded-md border border-slate-200 dark:border-slate-700 overflow-hidden"
                        >
                            <Board
                                bind:this={boardComponent}
                                bind:selectedAssignee={kanbanAssignee}
                                bind:assignees={kanbanAssignees}
                                context={kanbanContext}
                                searchQuery={kanbanSearchQuery}
                                on:presence={(e) =>
                                    (kanbanActiveUsers = e.detail)}
                            />
                        </div>
                    {:else if activeTab === "hub"}
                        <!-- HUB VIEW -->
                        <!-- Search & Global Status -->
                        <div class="relative mb-8">
                            <div
                                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                            >
                                <Search class="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                type="text"
                                class="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-700 rounded-md leading-5 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-500/30 focus:border-blue-400 dark:focus:border-blue-500 sm:text-sm shadow-sm transition-all"
                                placeholder="Search knowledge base, instruments, protocols..."
                            />
                        </div>

                        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <!-- Main Control Panel -->
                            <div class="lg:col-span-2 space-y-6">
                                <!-- Critical Admin Controls -->
                                <div class="card-pastel p-6">
                                    <div
                                        class="flex items-center justify-between mb-4"
                                    >
                                        <h3
                                            class="font-semibold text-slate-800 dark:text-slate-100 flex items-center"
                                        >
                                            <Zap
                                                class="w-5 h-5 mr-2 text-amber-500"
                                            />
                                            Control Board
                                        </h3>
                                        <button
                                            class="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                                            >Configure</button
                                        >
                                    </div>
                                    <div
                                        class="grid grid-cols-2 sm:grid-cols-4 gap-4"
                                    >
                                        <button
                                            class="flex flex-col items-center justify-center p-4 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-700 hover:shadow-md hover:border-blue-200 dark:hover:border-blue-500/50 transition-all group"
                                        >
                                            <div
                                                class="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform"
                                            >
                                                <Archive
                                                    class="w-5 h-5 text-emerald-600 dark:text-emerald-400"
                                                />
                                            </div>
                                            <span
                                                class="text-xs font-medium text-slate-700 dark:text-slate-300 text-center"
                                                >Batch Release</span
                                            >
                                        </button>
                                        <button
                                            class="flex flex-col items-center justify-center p-4 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-700 hover:shadow-md hover:border-blue-200 dark:hover:border-blue-500/50 transition-all group"
                                        >
                                            <div
                                                class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform"
                                            >
                                                <Users
                                                    class="w-5 h-5 text-blue-600 dark:text-blue-400"
                                                />
                                            </div>
                                            <span
                                                class="text-xs font-medium text-slate-700 dark:text-slate-300 text-center"
                                                >Access Control</span
                                            >
                                        </button>
                                        <button
                                            class="flex flex-col items-center justify-center p-4 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-700 hover:shadow-md hover:border-blue-200 dark:hover:border-blue-500/50 transition-all group"
                                        >
                                            <div
                                                class="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform"
                                            >
                                                <Database
                                                    class="w-5 h-5 text-purple-600 dark:text-purple-400"
                                                />
                                            </div>
                                            <span
                                                class="text-xs font-medium text-slate-700 dark:text-slate-300 text-center"
                                                >Backup Sys</span
                                            >
                                        </button>
                                        <button
                                            class="relative flex flex-col items-center justify-center p-4 rounded-md border-2 border-red-300 dark:border-red-500/50 bg-linear-to-b from-red-50 to-red-100 dark:from-red-950/50 dark:to-red-900/30 hover:from-red-100 hover:to-red-200 dark:hover:from-red-900/50 dark:hover:to-red-800/40 hover:shadow-lg hover:border-red-400 dark:hover:border-red-400 transition-all group ring-2 ring-red-200/50 dark:ring-red-500/20"
                                            onclick={() => {
                                                if (
                                                    !confirm(
                                                        "⚠️ LOCKDOWN MODE\n\nThis will immediately restrict all lab access.\n\nAre you absolutely sure?",
                                                    )
                                                )
                                                    return;
                                            }}
                                        >
                                            <div
                                                class="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 animate-pulse"
                                            ></div>
                                            <div
                                                class="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border-2 border-red-300 dark:border-red-500/50 flex items-center justify-center mb-2 group-hover:scale-110 group-hover:border-red-500 transition-all shadow-inner"
                                            >
                                                <ShieldAlert
                                                    class="w-5 h-5 text-red-600 dark:text-red-400"
                                                />
                                            </div>
                                            <span
                                                class="text-xs font-bold text-red-700 dark:text-red-400 text-center uppercase tracking-wide"
                                                >Lockdown</span
                                            >
                                        </button>
                                    </div>
                                </div>

                                <!-- Knowledge Base Highlights -->
                                <div class="card-pastel p-6">
                                    <div
                                        class="flex items-center justify-between mb-4"
                                    >
                                        <h3
                                            class="font-semibold text-slate-800 dark:text-slate-200 flex items-center"
                                        >
                                            <BookOpen
                                                class="w-5 h-5 mr-2 text-indigo-500"
                                            />
                                            Knowledge Hub
                                        </h3>
                                        <button
                                            class="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                                            >View All</button
                                        >
                                    </div>
                                    <div
                                        class="divide-y divide-slate-100 dark:divide-slate-700"
                                    >
                                        <button
                                            type="button"
                                            class="w-full text-left flex items-start py-2 group"
                                        >
                                            <div class="shrink-0 mt-0.5">
                                                <FileText
                                                    class="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors"
                                                />
                                            </div>
                                            <div class="ml-2">
                                                <p
                                                    class="text-sm font-medium text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-tight"
                                                >
                                                    Updated Standard Operating
                                                    Procedure: ICP-MS
                                                    Maintenance
                                                </p>
                                                <p
                                                    class="text-xs text-slate-500 dark:text-slate-400"
                                                >
                                                    Updated by Dr. S. Chen • 2
                                                    hours ago
                                                </p>
                                            </div>
                                        </button>
                                        <button
                                            type="button"
                                            class="w-full text-left flex items-start py-2 group"
                                        >
                                            <div class="shrink-0 mt-0.5">
                                                <FileText
                                                    class="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors"
                                                />
                                            </div>
                                            <div class="ml-2">
                                                <p
                                                    class="text-sm font-medium text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-tight"
                                                >
                                                    New Safety Protocol:
                                                    Chemical Spill Containment
                                                    v2.1
                                                </p>
                                                <p
                                                    class="text-xs text-slate-500 dark:text-slate-400"
                                                >
                                                    Posted by Safety Committee •
                                                    Yesterday
                                                </p>
                                            </div>
                                        </button>
                                        <button
                                            type="button"
                                            class="w-full text-left flex items-start py-2 group"
                                        >
                                            <div class="shrink-0 mt-0.5">
                                                <FileText
                                                    class="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors"
                                                />
                                            </div>
                                            <div class="ml-2">
                                                <p
                                                    class="text-sm font-medium text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-tight"
                                                >
                                                    Calibration Logs Template
                                                    2024
                                                </p>
                                                <p
                                                    class="text-xs text-slate-500 dark:text-slate-400"
                                                >
                                                    Resource • 3 days ago
                                                </p>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- Right Side: Live Feed / Notifications -->
                            <div class="space-y-6">
                                <div
                                    class="card-pastel p-5 bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-800/80 border border-slate-200 dark:border-slate-700"
                                >
                                    <h3
                                        class="font-medium text-slate-500 dark:text-slate-400 text-sm mb-1"
                                    >
                                        System Status
                                    </h3>
                                    <div class="flex items-baseline space-x-2">
                                        <span
                                            class="text-3xl font-bold text-slate-800 dark:text-slate-100"
                                            >98.5%</span
                                        >
                                        <span
                                            class="text-sm text-slate-500 dark:text-slate-400"
                                            >Uptime</span
                                        >
                                    </div>
                                    <div class="flex items-center gap-2 mt-2">
                                        <span
                                            class="inline-flex h-2 w-2 rounded-full bg-emerald-500"
                                        ></span>
                                        <span
                                            class="text-xs text-emerald-600 dark:text-emerald-400 font-medium"
                                            >All systems operational</span
                                        >
                                    </div>
                                    <div
                                        class="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center text-sm"
                                    >
                                        <span
                                            class="text-slate-600 dark:text-slate-400"
                                            >Pending Tasks</span
                                        >
                                        <span
                                            class="bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-sm font-medium"
                                            >12</span
                                        >
                                    </div>
                                </div>

                                <div class="card-pastel p-6">
                                    <h3
                                        class="font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center"
                                    >
                                        <Bell
                                            class="w-4 h-4 mr-2 text-slate-400"
                                        />
                                        Live Feed
                                    </h3>
                                    <div class="space-y-2">
                                        <div class="flex space-x-2">
                                            <div
                                                class="w-2 h-2 mt-1.5 rounded-full bg-blue-500 shrink-0"
                                            ></div>
                                            <div>
                                                <p
                                                    class="text-sm text-slate-800 dark:text-slate-300 leading-tight"
                                                >
                                                    <span class="font-medium"
                                                        >Sarah J.</span
                                                    >
                                                    booked
                                                    <span class="font-medium"
                                                        >Spectrometer A</span
                                                    >
                                                </p>
                                                <p
                                                    class="text-xs text-slate-500 dark:text-slate-400"
                                                >
                                                    10 mins ago
                                                </p>
                                            </div>
                                        </div>
                                        <div class="flex space-x-2">
                                            <div
                                                class="w-2 h-2 mt-1.5 rounded-full bg-emerald-500 shrink-0"
                                            ></div>
                                            <div>
                                                <p
                                                    class="text-sm text-slate-800 dark:text-slate-300 leading-tight"
                                                >
                                                    Calibration completed for <span
                                                        class="font-medium"
                                                        >Centrifuge B</span
                                                    >
                                                </p>
                                                <p
                                                    class="text-xs text-slate-500 dark:text-slate-400"
                                                >
                                                    45 mins ago
                                                </p>
                                            </div>
                                        </div>
                                        <div class="flex space-x-2">
                                            <div
                                                class="w-2 h-2 mt-1.5 rounded-full bg-amber-500 shrink-0"
                                            ></div>
                                            <div>
                                                <p
                                                    class="text-sm text-slate-800 dark:text-slate-300 leading-tight"
                                                >
                                                    Low Reagent Alert: <span
                                                        class="font-medium"
                                                        >Ethanol 95%</span
                                                    >
                                                </p>
                                                <p
                                                    class="text-xs text-slate-500 dark:text-slate-400"
                                                >
                                                    1 hour ago
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    {:else if activeTab === "dashboard"}
                        <!-- Dashboard Grid -->
                        <div
                            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            <!-- Status Card -->
                            <div
                                class="card-pastel p-6 relative overflow-hidden group"
                            >
                                <div
                                    class="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"
                                >
                                    <Beaker class="w-24 h-24" />
                                </div>
                                <h3
                                    class="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1"
                                >
                                    Active Instruments
                                </h3>
                                <div class="flex items-baseline space-x-2">
                                    <span
                                        class="text-3xl font-bold text-slate-900 dark:text-slate-100"
                                        >12</span
                                    >
                                    <span
                                        class="text-sm text-emerald-600 dark:text-emerald-400 font-medium"
                                        >/ 15</span
                                    >
                                </div>
                                <div
                                    class="mt-4 flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400"
                                >
                                    <span
                                        class="status-available px-2 py-0.5 rounded-full text-xs"
                                        >8 Available</span
                                    >
                                    <span
                                        class="status-booked px-2 py-0.5 rounded-full text-xs"
                                        >4 Running</span
                                    >
                                </div>
                            </div>

                            <!-- Personnel Card -->
                            <div
                                class="card-pastel p-6 relative overflow-hidden group"
                            >
                                <div
                                    class="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"
                                >
                                    <Users class="w-24 h-24" />
                                </div>
                                <h3
                                    class="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1"
                                >
                                    Lab Analysts
                                </h3>
                                <div class="flex items-baseline space-x-2">
                                    <span
                                        class="text-3xl font-bold text-slate-900 dark:text-slate-100"
                                        >8</span
                                    >
                                    <span class="text-sm text-slate-400"
                                        >On Site</span
                                    >
                                </div>
                                <div
                                    class="mt-4 text-sm text-slate-600 dark:text-slate-400"
                                >
                                    <div
                                        class="flex -space-x-2 overflow-hidden"
                                    >
                                        {#each Array(5) as _}
                                            <div
                                                class="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-slate-800 bg-slate-200 dark:bg-slate-600"
                                            ></div>
                                        {/each}
                                        <div
                                            class="flex items-center justify-center h-6 w-6 rounded-full ring-2 ring-white dark:ring-slate-800 bg-slate-100 dark:bg-slate-700 text-xs text-slate-500 dark:text-slate-400"
                                        >
                                            +3
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Safety Card -->
                            <div
                                class="card-pastel p-6 relative overflow-hidden group"
                            >
                                <div
                                    class="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"
                                >
                                    <ShieldAlert class="w-24 h-24" />
                                </div>
                                <h3
                                    class="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1"
                                >
                                    Safety Status
                                </h3>
                                <div class="flex items-baseline space-x-2">
                                    <span
                                        class="text-3xl font-bold text-emerald-600 dark:text-emerald-400"
                                        >Safe</span
                                    >
                                </div>
                                <div
                                    class="mt-4 text-sm text-slate-500 dark:text-slate-400"
                                >
                                    Last incident: <span
                                        class="font-medium text-slate-700 dark:text-slate-300"
                                        >42 days ago</span
                                    >
                                </div>
                            </div>
                        </div>

                        <!-- Recent Activity / Controls -->
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div class="card-pastel p-6">
                                <h3
                                    class="font-semibold text-slate-800 dark:text-slate-100 mb-4"
                                >
                                    Quick Actions
                                </h3>
                                <div class="grid grid-cols-2 gap-3">
                                    <button
                                        class="p-3 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 border border-indigo-100 dark:border-indigo-500/30 rounded-md text-left transition-colors group relative"
                                    >
                                        <ArrowRight
                                            size={14}
                                            class="absolute top-3 right-3 text-indigo-300 dark:text-indigo-400 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all"
                                        />
                                        <span
                                            class="block text-indigo-700 dark:text-indigo-300 font-medium text-sm group-hover:text-indigo-800 dark:group-hover:text-indigo-200"
                                            >Log Calibration</span
                                        >
                                        <span
                                            class="block text-indigo-400 dark:text-indigo-500 text-xs mt-0.5"
                                            >Spectrometry</span
                                        >
                                    </button>
                                    <button
                                        class="p-3 bg-amber-50 dark:bg-amber-500/10 hover:bg-amber-100 dark:hover:bg-amber-500/20 border border-amber-100 dark:border-amber-500/30 rounded-md text-left transition-colors group relative"
                                    >
                                        <ArrowRight
                                            size={14}
                                            class="absolute top-3 right-3 text-amber-300 dark:text-amber-400 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all"
                                        />
                                        <span
                                            class="block text-amber-700 dark:text-amber-300 font-medium text-sm group-hover:text-amber-800 dark:group-hover:text-amber-200"
                                            >Report Issue</span
                                        >
                                        <span
                                            class="block text-amber-500 dark:text-amber-500 text-xs mt-0.5"
                                            >Equipment/Safety</span
                                        >
                                    </button>
                                    <button
                                        class="p-3 bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 border border-emerald-100 dark:border-emerald-500/30 rounded-md text-left transition-colors group relative"
                                    >
                                        <ArrowRight
                                            size={14}
                                            class="absolute top-3 right-3 text-emerald-300 dark:text-emerald-400 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all"
                                        />
                                        <span
                                            class="block text-emerald-700 dark:text-emerald-300 font-medium text-sm group-hover:text-emerald-800 dark:group-hover:text-emerald-200"
                                            >Check-in Visitors</span
                                        >
                                        <span
                                            class="block text-emerald-500 text-xs mt-0.5"
                                            >Front Desk</span
                                        >
                                    </button>
                                    <button
                                        class="p-3 bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md text-left transition-colors group relative"
                                    >
                                        <ArrowRight
                                            size={14}
                                            class="absolute top-3 right-3 text-slate-300 dark:text-slate-500 group-hover:text-slate-500 dark:group-hover:text-slate-400 group-hover:translate-x-0.5 transition-all"
                                        />
                                        <span
                                            class="block text-slate-700 dark:text-slate-300 font-medium text-sm group-hover:text-slate-800 dark:group-hover:text-slate-200"
                                            >View Schedule</span
                                        >
                                        <span
                                            class="block text-slate-400 text-xs mt-0.5"
                                            >This Week</span
                                        >
                                    </button>
                                </div>
                            </div>

                            <div class="card-pastel p-6">
                                <div
                                    class="flex items-center justify-between mb-4"
                                >
                                    <h3
                                        class="font-semibold text-slate-800 dark:text-slate-200 flex items-center"
                                    >
                                        <Bell
                                            class="w-4 h-4 mr-2 text-slate-400"
                                        />
                                        Recent Alerts
                                    </h3>
                                    <button
                                        onclick={handleSimulateAlarm}
                                        class="text-xs text-red-600 dark:text-red-400 font-medium hover:text-red-700 dark:hover:text-red-300 border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 px-2 py-1 rounded-sm transition-colors"
                                    >
                                        Simulate Alarm
                                    </button>
                                </div>
                                <div class="space-y-3">
                                    <div
                                        class="flex items-start space-x-3 p-3 bg-red-50 dark:bg-red-500/10 rounded-lg border border-red-100 dark:border-red-500/20"
                                    >
                                        <ShieldAlert
                                            class="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5"
                                        />
                                        <div>
                                            <h4
                                                class="text-sm font-medium text-red-800 dark:text-red-300"
                                            >
                                                Fume Hood #2 Alarm
                                            </h4>
                                            <p
                                                class="text-xs text-red-600 dark:text-red-400 mt-1"
                                            >
                                                Airflow dropped below threshold.
                                                Maintenance notified.
                                            </p>
                                            <span
                                                class="text-xs text-red-400 dark:text-red-500 mt-1 block"
                                                >2 hours ago</span
                                            >
                                        </div>
                                    </div>
                                    <div
                                        class="flex items-start space-x-3 p-3 bg-yellow-50 dark:bg-yellow-500/10 rounded-lg border border-yellow-100 dark:border-yellow-500/20"
                                    >
                                        <Settings
                                            class="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5"
                                        />
                                        <div>
                                            <h4
                                                class="text-sm font-medium text-yellow-800 dark:text-yellow-300"
                                            >
                                                Maintenance Due
                                            </h4>
                                            <p
                                                class="text-xs text-yellow-600 dark:text-yellow-400 mt-1"
                                            >
                                                ICP-MS Omega requires quarterly
                                                maintenance.
                                            </p>
                                            <span
                                                class="text-xs text-yellow-500 mt-1 block"
                                                >Tomorrow</span
                                            >
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    {:else if activeTab === "instruments"}
                        <div
                            class="h-[calc(100vh-14rem)] bg-slate-50 dark:bg-slate-800/30 rounded-md border border-slate-200 dark:border-slate-700 overflow-hidden"
                        >
                            <div class="h-full p-4">
                                <BookingSystem />
                            </div>
                        </div>
                    {:else if activeTab === "personnel"}
                        <PersonnelView />
                    {:else if activeTab === "safety"}
                        <SafetyView />
                    {:else if activeTab === "quality"}
                        <QualityView />
                    {:else if activeTab === "documents"}
                        <EDMSView />
                    {:else if activeTab === "reports"}
                        <ReportsView />
                    {:else}
                        <!-- Placeholder for other tabs -->
                        <div class="card-pastel p-12 text-center">
                            <div
                                class="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4"
                            >
                                <Settings class="w-8 h-8 text-slate-400" />
                            </div>
                            <h3
                                class="text-lg font-medium text-slate-900 dark:text-slate-100"
                            >
                                Work in Progress
                            </h3>
                            <p
                                class="text-slate-500 dark:text-slate-400 mt-2 max-w-sm mx-auto"
                            >
                                The {activeTab} module is currently under development.
                                Please check back later.
                            </p>
                        </div>
                    {/if}
                </div>
            </div>
        </main>
    </div>
{/if}

{#if showChangePassword}
    <ChangePasswordModal onclose={() => (showChangePassword = false)} />
{/if}

{#if showCAPAGuide}
    <CAPAGuide onclose={() => (showCAPAGuide = false)} />
{/if}
