<script lang="ts">
    import InstrumentCard from "./InstrumentCard.svelte";
    import CalendarView from "./CalendarView.svelte";
    import BookingModal from "./BookingModal.svelte";
    import {
        Microscope,
        Plus,
        Search,
        Filter,
        X,
        Calendar,
        LayoutGrid,
        List,
        FileText,
    } from "lucide-svelte";
    import { exportToCSV } from "../utils/export";
    import type { Instrument, Booking } from "./types";
    import { supabase } from "../supabase";
    import { onMount } from "svelte";

    let instruments: Instrument[] = [];
    let bookings: Booking[] = [];
    let searchQuery = "";
    let selectedCategory = "";
    let selectedStatus = "";
    let showMobileFilters = false;
    let showBookingModal = false;
    let selectedInstrument: Instrument | null = null;
    let editingBooking: Booking | null = null;
    let initialBookingDate: Date | null = null;
    let initialBookingTime: string | null = null;
    let initialBookingEndTime: string | null = null;
    let viewMode: "grid" | "list" | "calendar" = "grid";
    let calendarInstrumentFilter = "";

    const categories = [
        "Spectroscopy",
        "Chromatography",
        "Elemental",
        "General",
    ];
    const statuses = ["available", "booked", "maintenance"];

    // Demo data for when Supabase is not configured
    const demoInstruments: Instrument[] = [
        {
            id: "1",
            name: "ICP-OES 5100",
            description:
                "Inductively coupled plasma optical emission spectrometry for elemental analysis",
            category: "Elemental",
            status: "available",
        },
        {
            id: "2",
            name: "HPLC Agilent 1260",
            description:
                "High-performance liquid chromatography system for separation and analysis",
            category: "Chromatography",
            status: "available",
        },
        {
            id: "3",
            name: "UV-Vis Spectrophotometer",
            description:
                "Double beam spectrophotometer for absorbance measurements",
            category: "Spectroscopy",
            status: "booked",
        },
        {
            id: "4",
            name: "GC-MS 7890B/5977A",
            description:
                "Gas chromatography mass spectrometry for volatile compound analysis",
            category: "Chromatography",
            status: "available",
        },
        {
            id: "5",
            name: "XRF Spectrometer",
            description:
                "X-ray fluorescence for non-destructive elemental analysis",
            category: "Elemental",
            status: "maintenance",
        },
        {
            id: "6",
            name: "FTIR Nicolet iS50",
            description:
                "Fourier transform infrared spectroscopy for molecular identification",
            category: "Spectroscopy",
            status: "available",
        },
        {
            id: "7",
            name: "Analytical Balance",
            description: "Precision balance with 0.0001g readability",
            category: "General",
            status: "available",
        },
        {
            id: "8",
            name: "pH Meter Metrohm",
            description: "Digital pH meter with temperature compensation",
            category: "General",
            status: "available",
        },
    ];

    const demoBookings: Booking[] = [
        {
            id: "b1",
            instrument_id: "3",
            user_name: "Dr. Martinez",
            start_time: new Date().toISOString(),
            end_time: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
            purpose: "Sample absorbance analysis",
        },
    ];

    onMount(async () => {
        await loadData();
        // console.log("BookingSystem mounted");
    });

    async function loadData() {
        // Try to load from Supabase, fall back to demo data
        const { data: instrumentData, error: instrumentError } = await supabase
            .from("instruments")
            .select("*");

        if (instrumentError || !instrumentData || instrumentData.length === 0) {
            instruments = demoInstruments;
            bookings = demoBookings;
            console.log(
                "Using demo data (Supabase not configured or empty or error)",
                instrumentError,
            );
        } else {
            instruments = instrumentData;

            const { data: bookingData } = await supabase
                .from("bookings")
                .select("*")
                .gte("end_time", new Date().toISOString());

            bookings = bookingData || [];
        }
    }

    $: filteredInstruments = instruments.filter((i) => {
        const matchesSearch =
            searchQuery === "" ||
            i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            i.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory =
            selectedCategory === "" || i.category === selectedCategory;
        const matchesStatus =
            selectedStatus === "" || i.status === selectedStatus;
        return matchesSearch && matchesCategory && matchesStatus;
    });

    function handleBookInstrument(e: CustomEvent<Instrument>) {
        selectedInstrument = e.detail;
        editingBooking = null;
        initialBookingDate = null;
        initialBookingTime = null;
        showBookingModal = true;
    }

    function handleSelectInstrument(e: CustomEvent<Instrument>) {
        selectedInstrument = e.detail;
        calendarInstrumentFilter = e.detail.id;
        viewMode = "calendar";
    }

    function handleCreateBookingFromCalendar(
        e: CustomEvent<{ date: Date; startTime: string; endTime: string }>,
    ) {
        const { date, startTime, endTime } = e.detail;
        selectedInstrument = calendarInstrumentFilter
            ? instruments.find((i) => i.id === calendarInstrumentFilter) || null
            : null;
        initialBookingDate = date;
        initialBookingTime = startTime;
        initialBookingEndTime = endTime;
        editingBooking = null;
        showBookingModal = true;
    }

    function handleViewBooking(e: CustomEvent<Booking>) {
        editingBooking = e.detail;
        selectedInstrument =
            instruments.find((i) => i.id === e.detail.instrument_id) || null;
        showBookingModal = true;
    }

    async function handleCreateBooking(
        e: CustomEvent<Omit<Booking, "id" | "created_at">>,
    ) {
        const newBooking = e.detail;

        // Check if using Supabase
        const { data, error } = await supabase
            .from("bookings")
            .insert(newBooking)
            .select()
            .single();

        if (error) {
            // Demo mode - add locally
            const demoBooking: Booking = {
                ...newBooking,
                id: `b${Date.now()}`,
                created_at: new Date().toISOString(),
            };
            bookings = [...bookings, demoBooking];

            // Update instrument status
            const idx = instruments.findIndex(
                (i) => i.id === newBooking.instrument_id,
            );
            if (idx >= 0) {
                // Optimistic update
                const updatedInstrument = {
                    ...instruments[idx],
                    status: "booked" as const,
                };
                instruments[idx] = updatedInstrument;
                instruments = [...instruments]; // Trigger reactivity
            }
        } else {
            bookings = [...bookings, data];
        }

        showBookingModal = false;
    }

    async function handleUpdateBooking(e: CustomEvent<Booking>) {
        const updated = e.detail;

        const { error } = await supabase
            .from("bookings")
            .update(updated)
            .eq("id", updated.id);

        if (error) {
            // Demo mode
            const idx = bookings.findIndex((b) => b.id === updated.id);
            if (idx >= 0) {
                bookings[idx] = updated;
                bookings = [...bookings];
            }
        } else {
            await loadData();
        }

        showBookingModal = false;
    }

    function openNewBooking() {
        selectedInstrument = null;
        editingBooking = null;
        initialBookingDate = null;
        initialBookingTime = null;
        showBookingModal = true;
    }
</script>

<div class="flex flex-col h-full space-y-4">
    <!-- Toolbar -->
    <div
        class="flex flex-col md:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm"
    >
        <div class="flex items-center gap-4 w-full md:w-auto">
            <!-- View Toggle -->
            <div class="flex bg-slate-100 dark:bg-slate-700 p-1 rounded-lg">
                <button
                    on:click={() => (viewMode = "grid")}
                    class="p-1.5 md:px-3 md:py-1.5 text-sm font-medium rounded-md transition-colors flex items-center gap-1.5
                    {viewMode === 'grid'
                        ? 'bg-white dark:bg-slate-600 shadow-sm text-slate-800 dark:text-slate-100'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}"
                    title="Grid View"
                >
                    <LayoutGrid size={18} />
                    <span class="hidden md:inline">Grid</span>
                </button>
                <button
                    on:click={() => (viewMode = "list")}
                    class="p-1.5 md:px-3 md:py-1.5 text-sm font-medium rounded-md transition-colors flex items-center gap-1.5
                    {viewMode === 'list'
                        ? 'bg-white dark:bg-slate-600 shadow-sm text-slate-800 dark:text-slate-100'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}"
                    title="List View"
                >
                    <List size={18} />
                    <span class="hidden md:inline">List</span>
                </button>
                <button
                    on:click={() => (viewMode = "calendar")}
                    class="p-1.5 md:px-3 md:py-1.5 text-sm font-medium rounded-md transition-colors flex items-center gap-1.5
                    {viewMode === 'calendar'
                        ? 'bg-white dark:bg-slate-600 shadow-sm text-slate-800 dark:text-slate-100'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}"
                    title="Calendar View"
                >
                    <Calendar size={18} />
                    <span class="hidden md:inline">Calendar</span>
                </button>
            </div>

            <!-- Search -->
            <div class="relative hidden md:block">
                <Search
                    class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={16}
                />
                <input
                    bind:value={searchQuery}
                    placeholder="Search..."
                    class="pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 w-48 transition-all"
                />
            </div>
        </div>

        <div
            class="flex items-center gap-4 w-full md:w-auto overflow-x-auto pb-1 md:pb-0"
        >
            <!-- Filters -->
            <select
                bind:value={selectedCategory}
                class="bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 py-2 px-3 transition-all cursor-pointer"
            >
                <option value="">All Categories</option>
                {#each categories as cat}
                    <option value={cat}>{cat}</option>
                {/each}
            </select>

            <select
                bind:value={selectedStatus}
                class="bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 py-2 px-3 transition-all cursor-pointer"
            >
                <option value="">All Status</option>
                {#each statuses as s}
                    <option value={s}
                        >{s.charAt(0).toUpperCase() + s.slice(1)}</option
                    >
                {/each}
            </select>

            <button
                on:click={() => exportToCSV(instruments, "instruments_list")}
                class="flex items-center gap-2 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 px-4 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition-all font-medium text-sm shadow-sm whitespace-nowrap"
            >
                <FileText size={16} />
                Export
            </button>

            <button
                on:click={openNewBooking}
                class="flex items-center gap-2 bg-indigo-600 text-white border border-indigo-700 px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all font-medium text-sm shadow-sm whitespace-nowrap"
            >
                <Plus size={16} />
                Register Instrument
            </button>
        </div>
    </div>

    <!-- Content Area -->
    <div class="flex-1 overflow-auto">
        {#if viewMode === "grid"}
            <!-- Instruments Grid -->
            <div
                class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 pb-20"
            >
                {#each filteredInstruments as instrument (instrument.id)}
                    <InstrumentCard
                        {instrument}
                        on:book={handleBookInstrument}
                        on:select={handleSelectInstrument}
                    />
                {/each}
            </div>

            {#if filteredInstruments.length === 0}
                <div class="text-center py-12">
                    <Microscope
                        size={48}
                        class="mx-auto text-slate-300 dark:text-slate-600 mb-4"
                    />
                    <p class="text-slate-500 dark:text-slate-400">
                        No instruments found
                    </p>
                </div>
            {/if}
        {:else if viewMode === "list"}
            <!-- Instruments List/Table View -->
            <div
                class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm"
            >
                <table class="w-full text-sm">
                    <thead
                        class="bg-slate-50 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600"
                    >
                        <tr>
                            <th
                                class="text-left py-3 px-4 font-semibold text-slate-600 dark:text-slate-300"
                                >Instrument</th
                            >
                            <th
                                class="text-left py-3 px-4 font-semibold text-slate-600 dark:text-slate-300 hidden md:table-cell"
                                >Category</th
                            >
                            <th
                                class="text-left py-3 px-4 font-semibold text-slate-600 dark:text-slate-300"
                                >Status</th
                            >
                            <th
                                class="text-left py-3 px-4 font-semibold text-slate-600 dark:text-slate-300 hidden lg:table-cell"
                                >Description</th
                            >
                            <th
                                class="text-right py-3 px-4 font-semibold text-slate-600 dark:text-slate-300"
                                >Action</th
                            >
                        </tr>
                    </thead>
                    <tbody
                        class="divide-y divide-slate-100 dark:divide-slate-700"
                    >
                        {#each filteredInstruments as instrument (instrument.id)}
                            <tr
                                class="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
                                on:click={() => {
                                    calendarInstrumentFilter = instrument.id;
                                    viewMode = "calendar";
                                }}
                                on:keydown={(e) =>
                                    e.key === "Enter" &&
                                    (() => {
                                        calendarInstrumentFilter =
                                            instrument.id;
                                        viewMode = "calendar";
                                    })()}
                            >
                                <td class="py-3 px-4">
                                    <span
                                        class="font-medium text-slate-800 dark:text-slate-200"
                                        >{instrument.name}</span
                                    >
                                </td>
                                <td class="py-3 px-4 hidden md:table-cell">
                                    <span
                                        class="px-2 py-0.5 text-xs font-medium rounded border
                                        {instrument.category === 'Spectroscopy'
                                            ? 'bg-cat-spectro border-cat-spectro-border text-cat-spectro-text'
                                            : instrument.category ===
                                                'Chromatography'
                                              ? 'bg-cat-chroma border-cat-chroma-border text-cat-chroma-text'
                                              : instrument.category ===
                                                  'Elemental'
                                                ? 'bg-cat-elemental border-cat-elemental-border text-cat-elemental-text'
                                                : 'bg-cat-general border-cat-general-border text-cat-general-text'}"
                                    >
                                        {instrument.category}
                                    </span>
                                </td>
                                <td class="py-3 px-4">
                                    <span
                                        class="px-2 py-0.5 text-xs font-bold uppercase rounded border
                                        {instrument.status === 'available'
                                            ? 'status-available'
                                            : instrument.status === 'booked'
                                              ? 'status-booked'
                                              : 'status-maintenance'}"
                                    >
                                        {instrument.status === "available"
                                            ? "Available"
                                            : instrument.status === "booked"
                                              ? "In Use"
                                              : "Maintenance"}
                                    </span>
                                </td>
                                <td class="py-3 px-4 hidden lg:table-cell">
                                    <span
                                        class="text-slate-500 dark:text-slate-400 truncate block max-w-xs"
                                        >{instrument.description}</span
                                    >
                                </td>
                                <td class="py-3 px-4 text-right">
                                    {#if instrument.status === "available"}
                                        <button
                                            on:click|stopPropagation={() => {
                                                selectedInstrument = instrument;
                                                editingBooking = null;
                                                showBookingModal = true;
                                            }}
                                            class="px-3 py-1 bg-indigo-600 text-white text-xs font-medium rounded-lg hover:bg-indigo-700 transition-all"
                                        >
                                            Book
                                        </button>
                                    {:else}
                                        <span class="text-xs text-slate-400"
                                            >—</span
                                        >
                                    {/if}
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>

            {#if filteredInstruments.length === 0}
                <div class="text-center py-12">
                    <Microscope
                        size={48}
                        class="mx-auto text-slate-300 dark:text-slate-600 mb-4"
                    />
                    <p class="text-slate-500 dark:text-slate-400">
                        No instruments found
                    </p>
                </div>
            {/if}
        {:else}
            <!-- Calendar View -->
            <CalendarView
                {bookings}
                {instruments}
                selectedInstrumentId={calendarInstrumentFilter}
                on:createBooking={handleCreateBookingFromCalendar}
                on:viewBooking={handleViewBooking}
            />
        {/if}
    </div>

    <!-- Booking Modal -->
    <BookingModal
        bind:show={showBookingModal}
        instrument={selectedInstrument}
        {instruments}
        {editingBooking}
        initialDate={initialBookingDate}
        initialTime={initialBookingTime}
        initialEndTime={initialBookingEndTime}
        on:close={() => (showBookingModal = false)}
        on:create={handleCreateBooking}
        on:update={handleUpdateBooking}
    />
</div>

<style>
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: scale(0.9);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
</style>
