<script lang="ts">
    import {
        Search,
        Filter,
        Mail,
        Phone,
        MapPin,
        Award,
        FileText,
    } from "lucide-svelte";
    import { exportToCSV } from "../utils/export";

    type Scientist = {
        id: string;
        name: string;
        role: string;
        department: string;
        status: "active" | "away" | "busy" | "offline";
        expectedReturn?: string; // For busy status
        email: string;
        location: string;
        tags: string[];
        initials: string;
        color: string;
    };

    let searchQuery = "";
    let selectedDepartment = "";

    const departments = [
        "Theoretical Physics",
        "Experimental Physics",
        "Chemistry",
        "Nuclear Physics",
        "Quantum Mechanics",
    ];

    const scientists: Scientist[] = [
        {
            id: "1",
            name: "Maria Skłodowska-Curie",
            role: "Head of Radioactivity Research",
            department: "Chemistry",
            status: "active",
            email: "m.curie@lab.org",
            location: "Lab 1 (Radium Wing)",
            tags: ["Radioactivity", "Polonium", "Radium", "Nobel x2"],
            initials: "MC",
            color: "bg-emerald-100 text-emerald-700",
        },
        {
            id: "2",
            name: "Albert Einstein",
            role: "Senior Theoretical Physicist",
            department: "Theoretical Physics",
            status: "busy",
            expectedReturn: "2:30 PM",
            email: "a.einstein@lab.org",
            location: "Office 302",
            tags: ["Relativity", "Photoelectric Effect"],
            initials: "AE",
            color: "bg-blue-100 text-blue-700",
        },
        {
            id: "3",
            name: "Niels Bohr",
            role: "Director of Atomic Theory",
            department: "Quantum Mechanics",
            status: "active",
            email: "n.bohr@lab.org",
            location: "Institute Building",
            tags: ["Atomic Model", "Quantum Theory"],
            initials: "NB",
            color: "bg-amber-100 text-amber-700",
        },
        {
            id: "4",
            name: "J. Robert Oppenheimer",
            role: "Project Director",
            department: "Theoretical Physics",
            status: "away",
            email: "j.oppenheimer@lab.org",
            location: "Los Alamos Site",
            tags: ["Manhattan Project", "Nuclear Physics"],
            initials: "RO",
            color: "bg-purple-100 text-purple-700",
        },
        {
            id: "5",
            name: "Enrico Fermi",
            role: "Lead Reactor Physicist",
            department: "Nuclear Physics",
            status: "active",
            email: "e.fermi@lab.org",
            location: "Chicago Pile-1",
            tags: ["Nuclear Reactor", "Beta Decay"],
            initials: "EF",
            color: "bg-indigo-100 text-indigo-700",
        },
        {
            id: "6",
            name: "Lise Meitner",
            role: "Senior Nuclear Physicist",
            department: "Nuclear Physics",
            status: "active",
            email: "l.meitner@lab.org",
            location: "Lab 4",
            tags: ["Nuclear Fission", "Protactinium"],
            initials: "LM",
            color: "bg-rose-100 text-rose-700",
        },
        {
            id: "7",
            name: "Richard Feynman",
            role: "Quantum Dynamicist",
            department: "Theoretical Physics",
            status: "busy",
            expectedReturn: "4:00 PM",
            email: "r.feynman@lab.org",
            location: "Caltech Wing",
            tags: ["QED", "Path Integral", "Bongo Drums"],
            initials: "RF",
            color: "bg-cyan-100 text-cyan-700",
        },
        {
            id: "8",
            name: "Chien-Shiung Wu",
            role: "Experimental Physicist",
            department: "Experimental Physics",
            status: "active",
            email: "c.wu@lab.org",
            location: "Beta Decay Lab",
            tags: ["Parity Violation", "Beta Decay"],
            initials: "CW",
            color: "bg-fuchsia-100 text-fuchsia-700",
        },
        {
            id: "9",
            name: "Ernest Rutherford",
            role: "Father of Nuclear Physics",
            department: "Nuclear Physics",
            status: "offline",
            email: "e.rutherford@lab.org",
            location: "Cavendish Lab",
            tags: ["Proton", "Half-life", "Alpha Particles"],
            initials: "ER",
            color: "bg-orange-100 text-orange-700",
        },
        {
            id: "10",
            name: "Werner Heisenberg",
            role: "Principal Investigator",
            department: "Quantum Mechanics",
            status: "away",
            email: "w.heisenberg@lab.org",
            location: "Field Office",
            tags: ["Uncertainty Principle", "Matrix Mechanics"],
            initials: "WH",
            color: "bg-slate-100 text-slate-700",
        },
    ];

    $: filteredScientists = scientists.filter((s) => {
        const matchesSearch =
            s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.tags.some((t) =>
                t.toLowerCase().includes(searchQuery.toLowerCase()),
            );
        const matchesDep =
            selectedDepartment === "" || s.department === selectedDepartment;
        return matchesSearch && matchesDep;
    });

    function getStatusColor(status: string) {
        switch (status) {
            case "active":
                return "bg-emerald-500";
            case "busy":
                return "bg-amber-500";
            case "away":
                return "bg-slate-400";
            case "offline":
                return "bg-slate-300";
            default:
                return "bg-slate-400";
        }
    }
</script>

<div class="flex flex-col h-full space-y-6">
    <!-- Toolbar -->
    <div
        class="flex flex-col md:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm"
    >
        <div class="flex items-center gap-4 w-full md:w-auto">
            <h2
                class="text-lg font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2"
            >
                <div
                    class="p-1.5 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg"
                >
                    <Award
                        size={18}
                        class="text-indigo-600 dark:text-indigo-400"
                    />
                </div>
                Research Personnel
            </h2>
            <div
                class="h-6 w-px bg-slate-200 dark:bg-slate-700 hidden md:block"
            ></div>
            <span
                class="text-sm text-slate-500 dark:text-slate-400 hidden md:block"
            >
                {filteredScientists.length} / {scientists.length} Active Researchers
            </span>
        </div>

        <div class="flex items-center gap-3 w-full md:w-auto">
            <div class="relative flex-1 md:flex-none">
                <Search
                    class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={16}
                />
                <input
                    bind:value={searchQuery}
                    placeholder="Search personnel..."
                    class="w-full md:w-64 pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
            </div>
            <div class="relative">
                <select
                    bind:value={selectedDepartment}
                    class="appearance-none bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-800 dark:text-slate-200 pl-4 pr-10 py-2 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                >
                    <option value="">All Departments</option>
                    {#each departments as dep}
                        <option value={dep}>{dep}</option>
                    {/each}
                </select>
                <Filter
                    size={14}
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
            </div>
            <button
                on:click={() =>
                    exportToCSV(filteredScientists, "personnel_list")}
                class="px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors shadow-sm"
                title="Export List"
            >
                <FileText size={18} />
            </button>
        </div>
    </div>

    <!-- Grid -->
    <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20"
    >
        {#each filteredScientists as scientist (scientist.id)}
            <div
                class="card-pastel p-6 group hover:shadow-lg transition-all duration-300 relative overflow-hidden flex flex-col h-full"
            >
                <!-- Status Indicator -->
                <div class="absolute top-4 right-4 flex items-center gap-2">
                    <span
                        class="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 group-hover:text-slate-500 dark:group-hover:text-slate-400 transition-colors"
                        >{scientist.status}</span
                    >
                    <span
                        class="w-2.5 h-2.5 rounded-full {getStatusColor(
                            scientist.status,
                        )} ring-2 ring-white dark:ring-slate-800"
                        title={scientist.status === "busy" &&
                        scientist.expectedReturn
                            ? `Expected back: ${scientist.expectedReturn}`
                            : ""}
                    ></span>
                </div>

                <!-- Header -->
                <div class="flex flex-col items-center text-center mb-6 mt-2">
                    <div
                        class="w-20 h-20 rounded-2xl {scientist.color} flex items-center justify-center text-2xl font-bold mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300"
                    >
                        {scientist.initials}
                    </div>
                    <h3
                        class="font-bold text-slate-800 dark:text-slate-100 text-lg"
                    >
                        {scientist.name}
                    </h3>
                    <p
                        class="text-sm text-indigo-600 dark:text-indigo-400 font-medium"
                    >
                        {scientist.role}
                    </p>
                    <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {scientist.department}
                    </p>
                </div>

                <!-- Tags -->
                <div class="flex flex-wrap gap-2 justify-center mb-6 flex-1">
                    {#each scientist.tags as tag}
                        <span
                            class="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-medium rounded-full border border-slate-200 dark:border-slate-600 h-fit"
                        >
                            {tag}
                        </span>
                    {/each}
                </div>

                <!-- Contact/Meta (pinned to bottom) -->
                <div
                    class="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-700 mt-auto"
                >
                    <div
                        class="flex items-center text-sm text-slate-600 dark:text-slate-400"
                    >
                        <Mail size={14} class="mr-3 text-slate-400 shrink-0" />
                        <span class="truncate">{scientist.email}</span>
                    </div>
                    <div
                        class="flex items-center text-sm text-slate-600 dark:text-slate-400"
                    >
                        <MapPin
                            size={14}
                            class="mr-3 text-slate-400 shrink-0"
                        />
                        <span>{scientist.location}</span>
                    </div>
                </div>

                <!-- Actions -->
                <div
                    class="mt-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                    <button
                        class="flex-1 py-1.5 bg-indigo-50 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-xs font-semibold rounded hover:bg-indigo-100 dark:hover:bg-indigo-900/70 transition-colors"
                    >
                        View Profile
                    </button>
                    <button
                        class="flex-1 py-1.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-xs font-semibold rounded hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
                    >
                        Message
                    </button>
                </div>
            </div>
        {/each}
    </div>
</div>
