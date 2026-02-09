<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { Calendar, X, Save, Clock, User, FileText } from "lucide-svelte";
    import type { Instrument, Booking } from "./types";

    export let show = false;
    export let instrument: Instrument | null = null;
    export let instruments: Instrument[] = [];
    export let editingBooking: Booking | null = null;
    export let initialDate: Date | null = null;
    export let initialTime: string | null = null;
    export let initialEndTime: string | null = null;

    const dispatch = createEventDispatcher();

    let selectedInstrumentId = "";
    let userName = "";
    let startDate = "";
    let startTime = "09:00";
    let endTime = "10:00";
    let purpose = "";

    // Time slot options
    const timeSlots = Array.from({ length: 24 }, (_, i) => {
        const hour = i.toString().padStart(2, "0");
        return `${hour}:00`;
    });

    // Initialize form when modal opens
    let wasShown = false;
    $: if (show) {
        if (!wasShown) {
            wasShown = true;
            if (editingBooking) {
                selectedInstrumentId = editingBooking.instrument_id;
                userName = editingBooking.user_name;
                const start = new Date(editingBooking.start_time);
                const end = new Date(editingBooking.end_time);
                startDate = start.toISOString().split("T")[0];
                startTime = start.toTimeString().slice(0, 5);
                endTime = end.toTimeString().slice(0, 5);
                purpose = editingBooking.purpose || "";
            } else {
                selectedInstrumentId =
                    instrument?.id ||
                    (instruments.length > 0 ? instruments[0].id : "");
                userName = "";
                startDate = initialDate
                    ? `${initialDate.getFullYear()}-${String(initialDate.getMonth() + 1).padStart(2, "0")}-${String(initialDate.getDate()).padStart(2, "0")}`
                    : new Date().toISOString().split("T")[0];
                startTime = initialTime || "09:00";

                if (initialEndTime) {
                    endTime = initialEndTime;
                } else if (startTime) {
                    const [h, m] = startTime.split(":").map(Number);
                    const endH = h + 1;
                    endTime = `${endH.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
                    // Handle day overflow conceptually (though simple string logic here is usually enough for 9-5)
                    if (endH > 23) endTime = "23:59"; // clamp
                } else {
                    endTime = "10:00";
                }
                // Ensure end time is option in list, otherwise default logic might be safer
                // But simple +1 hour logic usually matches the slots
                purpose = "";
            }
        }
    } else {
        wasShown = false;
    }

    function close() {
        dispatch("close");
    }

    function submit() {
        if (
            !selectedInstrumentId ||
            !userName ||
            !startDate ||
            !startTime ||
            !endTime
        )
            return;

        const startDateTime = new Date(`${startDate}T${startTime}:00`);
        const endDateTime = new Date(`${startDate}T${endTime}:00`);

        if (endDateTime <= startDateTime) {
            alert("End time must be after start time");
            return;
        }

        const payload = {
            instrument_id: selectedInstrumentId,
            user_name: userName.trim(),
            start_time: startDateTime.toISOString(),
            end_time: endDateTime.toISOString(),
            purpose: purpose.trim(),
        };

        if (editingBooking) {
            dispatch("update", { ...payload, id: editingBooking.id });
        } else {
            dispatch("create", payload);
        }

        show = false;
    }

    function handleKeydown(e: KeyboardEvent) {
        if (e.key === "Escape") close();
    }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if show}
    <div
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
    >
        <div
            class="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
            on:click={close}
            on:keydown={(e) => {
                if (e.key === "Enter" || e.key === " ") close();
            }}
            role="button"
            tabindex="0"
            aria-label="Close modal"
        ></div>

        <div
            class="relative w-full max-w-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl overflow-hidden animate-fade-in-up"
        >
            <div class="p-6">
                <div class="flex justify-between items-center mb-6">
                    <h2
                        class="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2"
                    >
                        {#if editingBooking}
                            <Save size={18} class="text-indigo-500" />
                            Update Booking
                        {:else}
                            <Calendar size={18} class="text-indigo-500" />
                            New Booking
                        {/if}
                    </h2>
                    <button
                        on:click={close}
                        class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div class="space-y-4">
                    <!-- Instrument Selection -->
                    <div>
                        <label
                            for="instrument-select"
                            class="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase"
                            >Instrument</label
                        >
                        <select
                            id="instrument-select"
                            bind:value={selectedInstrumentId}
                            class="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-4 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer"
                        >
                            {#each instruments.filter((i) => i.status !== "maintenance") as inst}
                                <option value={inst.id}>{inst.name}</option>
                            {/each}
                        </select>
                    </div>

                    <!-- User Name -->
                    <div>
                        <label
                            for="user-name"
                            class="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase flex items-center gap-1"
                        >
                            <User size={12} />
                            Your Name
                        </label>
                        <input
                            id="user-name"
                            bind:value={userName}
                            class="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-4 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                            placeholder="e.g. Dr. Smith"
                        />
                    </div>

                    <!-- Date -->
                    <div>
                        <label
                            for="booking-date"
                            class="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase flex items-center gap-1"
                        >
                            <Calendar size={12} />
                            Date
                        </label>
                        <div class="relative">
                            <input
                                id="booking-date"
                                type="date"
                                bind:value={startDate}
                                min={new Date().toISOString().split("T")[0]}
                                class="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-4 py-2 text-transparent focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                            />
                            <div
                                class="absolute inset-0 flex items-center px-4 pointer-events-none text-slate-800 dark:text-slate-200"
                            >
                                {#if startDate}
                                    {startDate.split("-").reverse().join("/")}
                                {:else}
                                    DD/MM/YYYY
                                {/if}
                            </div>
                        </div>
                    </div>

                    <!-- Time Range -->
                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label
                                for="start-time"
                                class="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase flex items-center gap-1"
                            >
                                <Clock size={12} />
                                Start Time
                            </label>
                            <select
                                id="start-time"
                                bind:value={startTime}
                                class="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-4 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer"
                            >
                                {#each timeSlots as slot}
                                    <option value={slot}>{slot}</option>
                                {/each}
                            </select>
                        </div>
                        <div>
                            <label
                                for="end-time"
                                class="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase flex items-center gap-1"
                            >
                                <Clock size={12} />
                                End Time
                            </label>
                            <select
                                id="end-time"
                                bind:value={endTime}
                                class="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-4 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer"
                            >
                                {#each timeSlots as slot}
                                    <option value={slot}>{slot}</option>
                                {/each}
                            </select>
                        </div>
                    </div>

                    <!-- Purpose -->
                    <div>
                        <label
                            for="purpose"
                            class="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase flex items-center gap-1"
                        >
                            <FileText size={12} />
                            Purpose (Optional)
                        </label>
                        <textarea
                            id="purpose"
                            bind:value={purpose}
                            rows="2"
                            class="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-4 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                            placeholder="Sample analysis, training, etc."
                        ></textarea>
                    </div>
                </div>

                <button
                    on:click={submit}
                    disabled={!selectedInstrumentId || !userName || !startDate}
                    class="w-full mt-6 bg-indigo-600 text-white font-semibold py-2.5 rounded-lg shadow-sm hover:bg-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {editingBooking ? "Update Booking" : "Confirm Booking"}
                </button>
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
