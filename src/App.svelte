<script>
  import { Activity, Beaker, Users, ShieldAlert, FileText, Settings, Menu } from 'lucide-svelte';
  
  let activeTab = $state('dashboard');
  let isSidebarOpen = $state(true);

  function toggleSidebar() {
    isSidebarOpen = !isSidebarOpen;
  }
</script>

<div class="min-h-screen flex bg-pastel-bg text-slate-800 font-sans selection:bg-indigo-100 selection:text-indigo-900">
  <!-- Sidebar -->
  <aside 
    class={`fixed inset-y-0 left-0 z-50 w-64 bg-white/80 backdrop-blur-xl border-r border-slate-200 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}
  >
    <div class="h-full flex flex-col">
      <!-- Logo Area -->
      <div class="h-16 flex items-center px-6 border-b border-slate-100">
        <div class="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center mr-3 shadow-sm">
          <Beaker class="w-5 h-5 text-white" />
        </div>
        <span class="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">
          RadioAnalysis
        </span>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {#each [
          { id: 'dashboard', label: 'Dashboard', icon: Activity },
          { id: 'instruments', label: 'Instruments', icon: Beaker },
          { id: 'personnel', label: 'Personnel', icon: Users },
          { id: 'safety', label: 'Safety & Incidents', icon: ShieldAlert },
          { id: 'reports', label: 'Reports', icon: FileText },
        ] as item}
          <button
            class={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
              activeTab === item.id 
                ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-200' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
            onclick={() => activeTab = item.id}
          >
            <item.icon 
              class={`w-5 h-5 mr-3 transition-colors ${
                activeTab === item.id ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'
              }`} 
            />
            {item.label}
          </button>
        {/each}
      </nav>

      <!-- Bottom Actions -->
      <div class="p-4 border-t border-slate-100">
        <button class="flex items-center w-full px-3 py-2 text-sm font-medium text-slate-600 rounded-lg hover:bg-slate-50 transition-colors">
          <Settings class="w-5 h-5 mr-3 text-slate-400" />
          Settings
        </button>
      </div>
    </div>
  </aside>

  <!-- Main Content -->
  <main class="flex-1 flex flex-col min-w-0 overflow-hidden">
    <!-- Header -->
    <header class="h-16 bg-white/50 backdrop-blur-sm border-b border-slate-200/60 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-40">
      <button 
        class="md:hidden p-2 -ml-2 text-slate-500 hover:text-slate-700 rounded-md"
        onclick={toggleSidebar}
      >
        <Menu class="w-6 h-6" />
      </button>
      
      <div class="flex items-center justify-end w-full space-x-4">
        <div class="flex items-center space-x-2">
            <span class="inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span class="text-xs font-medium text-slate-500">System Operational</span>
        </div>
        <div class="h-8 w-8 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-medium text-sm">
            PL
        </div>
      </div>
    </header>

    <!-- Content Scroll Area -->
    <div class="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
      <div class="max-w-6xl mx-auto space-y-6">
        
        <!-- Page Header -->
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-semibold text-slate-900 capitalize">{activeTab}</h1>
          <div class="flex space-x-3">
             <button class="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-all">
                Export Data
             </button>
             <button class="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium shadow-sm hover:bg-indigo-700 shadow-indigo-200 transition-all">
                New Entry
             </button>
          </div>
        </div>

        {#if activeTab === 'dashboard'}
            <!-- Dashboard Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <!-- Status Card -->
                <div class="card-pastel p-6 relative overflow-hidden group">
                    <div class="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Beaker class="w-24 h-24" />
                    </div>
                    <h3 class="text-sm font-medium text-slate-500 mb-1">Active Instruments</h3>
                    <div class="flex items-baseline space-x-2">
                        <span class="text-3xl font-bold text-slate-900">12</span>
                        <span class="text-sm text-emerald-600 font-medium">/ 15</span>
                    </div>
                    <div class="mt-4 flex items-center space-x-2 text-sm text-slate-600">
                        <span class="status-available px-2 py-0.5 rounded-full text-xs">8 Available</span>
                        <span class="status-booked px-2 py-0.5 rounded-full text-xs">4 Running</span>
                    </div>
                </div>

                <!-- Personnel Card -->
                <div class="card-pastel p-6 relative overflow-hidden group">
                     <div class="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Users class="w-24 h-24" />
                    </div>
                    <h3 class="text-sm font-medium text-slate-500 mb-1">Lab Analysts</h3>
                    <div class="flex items-baseline space-x-2">
                        <span class="text-3xl font-bold text-slate-900">8</span>
                        <span class="text-sm text-slate-400">On Site</span>
                    </div>
                    <div class="mt-4 text-sm text-slate-600">
                        <div class="flex -space-x-2 overflow-hidden">
                             {#each Array(5) as _}
                                <div class="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-slate-200"></div>
                             {/each}
                             <div class="flex items-center justify-center h-6 w-6 rounded-full ring-2 ring-white bg-slate-100 text-xs text-slate-500">+3</div>
                        </div>
                    </div>
                </div>

                <!-- Safety Card -->
                 <div class="card-pastel p-6 relative overflow-hidden group">
                     <div class="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <ShieldAlert class="w-24 h-24" />
                    </div>
                    <h3 class="text-sm font-medium text-slate-500 mb-1">Safety Status</h3>
                    <div class="flex items-baseline space-x-2">
                        <span class="text-3xl font-bold text-emerald-600">Safe</span>
                    </div>
                    <div class="mt-4 text-sm text-slate-500">
                        Last incident: <span class="font-medium text-slate-700">42 days ago</span>
                    </div>
                </div>
            </div>

            <!-- Recent Activity / Controls -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="card-pastel p-6">
                    <h3 class="font-semibold text-slate-800 mb-4">Quick Actions</h3>
                    <div class="grid grid-cols-2 gap-3">
                        <button class="p-3 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 rounded-lg text-left transition-colors group">
                            <span class="block text-indigo-700 font-medium text-sm group-hover:text-indigo-800">Log Calibration</span>
                            <span class="block text-indigo-400 text-xs mt-0.5">Spectrometry</span>
                        </button>
                         <button class="p-3 bg-amber-50 hover:bg-amber-100 border border-amber-100 rounded-lg text-left transition-colors group">
                            <span class="block text-amber-700 font-medium text-sm group-hover:text-amber-800">Report Issue</span>
                            <span class="block text-amber-500 text-xs mt-0.5">Equipment/Safety</span>
                        </button>
                         <button class="p-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 rounded-lg text-left transition-colors group">
                            <span class="block text-emerald-700 font-medium text-sm group-hover:text-emerald-800">Check-in Visitors</span>
                            <span class="block text-emerald-500 text-xs mt-0.5">Front Desk</span>
                        </button>
                         <button class="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-left transition-colors group">
                            <span class="block text-slate-700 font-medium text-sm group-hover:text-slate-800">View Schedule</span>
                            <span class="block text-slate-400 text-xs mt-0.5">This Week</span>
                        </button>
                    </div>
                </div>

                 <div class="card-pastel p-6">
                    <h3 class="font-semibold text-slate-800 mb-4">Recent Alerts</h3>
                    <div class="space-y-3">
                        <div class="flex items-start space-x-3 p-3 bg-red-50 rounded-lg border border-red-100">
                            <ShieldAlert class="w-5 h-5 text-red-600 mt-0.5" />
                            <div>
                                <h4 class="text-sm font-medium text-red-800">Fume Hood #2 Alarm</h4>
                                <p class="text-xs text-red-600 mt-1">Airflow dropped below threshold. Maintenance notified.</p>
                                <span class="text-xs text-red-400 mt-1 block">2 hours ago</span>
                            </div>
                        </div>
                         <div class="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                            <Settings class="w-5 h-5 text-yellow-600 mt-0.5" />
                            <div>
                                <h4 class="text-sm font-medium text-yellow-800">Maintenance Due</h4>
                                <p class="text-xs text-yellow-600 mt-1">ICP-MS Omega requires quarterly maintenance.</p>
                                <span class="text-xs text-yellow-500 mt-1 block">Tomorrow</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        {:else}
            <!-- Placeholder for other tabs -->
            <div class="card-pastel p-12 text-center">
                <div class="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                     <Settings class="w-8 h-8 text-slate-400" />
                </div>
                <h3 class="text-lg font-medium text-slate-900">Work in Progress</h3>
                <p class="text-slate-500 mt-2 max-w-sm mx-auto">The {activeTab} module is currently under development. Please check back later.</p>
            </div>
        {/if}

      </div>
    </div>
  </main>
</div>
