<script lang="ts">
    import { ChevronLeft, ChevronRight, Clock } from "lucide-svelte";
    import type { Booking, Instrument } from "./types";
    import { createEventDispatcher } from "svelte";

    export let bookings: Booking[] = [];
    export let instruments: Instrument[] = [];
    export let selectedInstrumentId: string = "";

    const dispatch = createEventDispatcher();

    let currentWeekStart = getWeekStart(new Date());
    const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8am to 7pm

    function getWeekStart(date: Date): Date {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        d.setDate(diff);
        d.setHours(0, 0, 0, 0);
        return d;
    }

    function getWeekDays(weekStart: Date): Date[] {
        return Array.from({ length: 7 }, (_, i) => {
            const d = new Date(weekStart);
            d.setDate(d.getDate() + i);
            return d;
        });
    }

    $: weekDays = getWeekDays(currentWeekStart);

    function prevWeek() {
        const d = new Date(currentWeekStart);
        d.setDate(d.getDate() - 7);
        currentWeekStart = d;
    }

    function nextWeek() {
        const d = new Date(currentWeekStart);
        d.setDate(d.getDate() + 7);
        currentWeekStart = d;
    }

    function goToToday() {
        currentWeekStart = getWeekStart(new Date());
    }

    function formatDayHeader(date: Date): string {
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        return `${days[date.getDay()]} ${date.getDate()}`;
    }

    function formatMonthYear(date: Date): string {
        return date.toLocaleDateString("en-GB", {
            month: "long",
            year: "numeric",
        });
    }

    function getBookingForSlot(
        day: Date,
        hour: number,
        currentBookings: Booking[],
    ): Booking | null {
        const slotStart = new Date(day);
        slotStart.setHours(hour, 0, 0, 0);
        const slotEnd = new Date(slotStart);
        slotEnd.setHours(hour + 1);

        return (
            currentBookings.find((b) => {
                if (
                    selectedInstrumentId &&
                    b.instrument_id !== selectedInstrumentId
                )
                    return false;
                const bookingStart = new Date(b.start_time);
                const bookingEnd = new Date(b.end_time);
                return bookingStart < slotEnd && bookingEnd > slotStart;
            }) || null
        );
    }

    function getInstrumentName(id: string): string {
        return instruments.find((i) => i.id === id)?.name || "Unknown";
    }

    function handleSlotClick(day: Date, hour: number) {
        const booking = getBookingForSlot(day, hour, bookings);
        if (booking) {
            dispatch("viewBooking", booking);
        } else {
            dispatch("createBooking", {
                date: day,
                startTime: `${hour.toString().padStart(2, "0")}:00`,
                endTime: `${(hour + 1).toString().padStart(2, "0")}:00`,
            });
        }
    }

    function isToday(date: Date): boolean {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    }

    function isPast(day: Date, hour: number): boolean {
        const now = new Date();
        const slotTime = new Date(day);
        slotTime.setHours(hour);
        return slotTime < now;
    }

    // Drag selection state
    let isDragging = false;
    let dragStart: { day: Date; hour: number } | null = null;
    let dragEnd: { day: Date; hour: number } | null = null;

    function handleMouseDown(day: Date, hour: number) {
        const booking = getBookingForSlot(day, hour, bookings);
        if (booking) {
            dispatch("viewBooking", booking);
            return;
        }
        if (isPast(day, hour)) return;
        isDragging = true;
        dragStart = { day, hour };
        dragEnd = { day, hour };
    }

    function handleMouseEnter(day: Date, hour: number) {
        if (!isDragging || !dragStart) return;
        // Restrict drag to same day for simplicity first
        if (day.toDateString() !== dragStart.day.toDateString()) return;

        // Prevent dragging into existing bookings or past time
        if (getBookingForSlot(day, hour, bookings) || isPast(day, hour)) return;

        dragEnd = { day, hour };
    }

    function handleMouseUp() {
        if (!isDragging || !dragStart || !dragEnd) {
            isDragging = false;
            return;
        }

        // Calculate range
        const startHour = Math.min(dragStart.hour, dragEnd.hour);
        const endHour = Math.max(dragStart.hour, dragEnd.hour) + 1; // +1 because selection includes the slot

        dispatch("createBooking", {
            date: dragStart.day,
            startTime: `${startHour.toString().padStart(2, "0")}:00`,
            endTime: `${endHour.toString().padStart(2, "0")}:00`,
        });

        isDragging = false;
        dragStart = null;
        dragEnd = null;
    }

    // Global mouse up to cancel drag if outside
    function handleGlobalMouseUp() {
        if (isDragging) {
            handleMouseUp();
        }
    }

    function isSelected(day: Date, hour: number): boolean {
        if (!isDragging || !dragStart || !dragEnd) return false;
        if (day.toDateString() !== dragStart.day.toDateString()) return false;

        const start = Math.min(dragStart.hour, dragEnd.hour);
        const end = Math.max(dragStart.hour, dragEnd.hour);
        return hour >= start && hour <= end;
    }

    function isSelectionContinued(day: Date, hour: number): boolean {
        if (!isDragging || !dragStart || !dragEnd) return false;
        if (day.toDateString() !== dragStart.day.toDateString()) return false;

        const start = Math.min(dragStart.hour, dragEnd.hour);
        const end = Math.max(dragStart.hour, dragEnd.hour);
        return hour >= start && hour < end;
    }

    function shouldShowBookingInfo(
        day: Date,
        hour: number,
        booking: Booking,
    ): boolean {
        const start = new Date(booking.start_time);
        // Show if it's the start hour of the booking
        if (start.getDate() === day.getDate() && start.getHours() === hour)
            return true;

        // OR if the booking started before the view (8am) and this is the first visible slot (8am)
        if (hour === 8 && start < new Date(day.setHours(8, 0, 0, 0)))
            return true;

        return false;
    }
</script>

<svelte:window on:mouseup={handleGlobalMouseUp} />

<div class="card-pastel overflow-hidden">
    <!-- Header -->
    <div
        class="p-4 border-b border-slate-200 dark:border-slate-700 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0"
    >
        <div class="flex items-center gap-2">
            <button
                on:click={prevWeek}
                class="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
                <ChevronLeft
                    size={20}
                    class="text-slate-600 dark:text-slate-400"
                />
            </button>
            <button
                on:click={nextWeek}
                class="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
                <ChevronRight
                    size={20}
                    class="text-slate-600 dark:text-slate-400"
                />
            </button>
            <button
                on:click={goToToday}
                class="px-3 py-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
            >
                Today
            </button>
        </div>
        <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-100">
            {formatMonthYear(currentWeekStart)}
        </h3>
        <div class="flex items-center gap-2">
            <select
                bind:value={selectedInstrumentId}
                class="bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-800 dark:text-slate-200 py-1.5 px-3 focus:outline-none focus:border-indigo-500"
            >
                <option value="">All Instruments</option>
                {#each instruments as inst}
                    <option value={inst.id}>{inst.name}</option>
                {/each}
            </select>
        </div>
    </div>

    <!-- Calendar Grid -->
    <div
        class="overflow-x-auto relative max-h-[calc(100vh-12.5rem)] overflow-y-auto"
    >
        <div class="min-w-[50rem]">
            <!-- Day Headers -->
            <div
                class="grid grid-cols-[3.75rem_repeat(7,1fr)] border-b border-slate-200 dark:border-slate-700 sticky top-0 z-20 bg-white dark:bg-slate-800 shadow-sm"
            >
                <div
                    class="p-2 text-center text-xs font-medium text-slate-400 flex items-center justify-center sticky left-0 z-30 bg-white dark:bg-slate-800 border-r border-slate-100 dark:border-slate-700"
                >
                    <Clock size={14} />
                </div>
                {#each weekDays as day}
                    <div
                        class="p-2 text-center text-sm font-medium border-l border-slate-100 dark:border-slate-700 {isToday(
                            day,
                        )
                            ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                            : 'text-slate-600 dark:text-slate-300'}"
                    >
                        {formatDayHeader(day)}
                    </div>
                {/each}
            </div>

            <!-- Time Slots -->
            {#each hours as hour}
                <div
                    class="grid grid-cols-[3.75rem_repeat(7,1fr)] last:border-b-0"
                >
                    <div
                        class="p-2 text-center text-xs text-slate-400 font-medium flex items-center justify-center sticky left-0 z-10 bg-white dark:bg-slate-800 border-r border-b border-slate-100 dark:border-slate-700"
                    >
                        {hour.toString().padStart(2, "0")}:00
                    </div>
                    {#each weekDays as day}
                        {@const booking = getBookingForSlot(
                            day,
                            hour,
                            bookings,
                        )}
                        {@const nextBooking = getBookingForSlot(
                            day,
                            hour + 1,
                            bookings,
                        )}
                        {@const isContinued =
                            booking &&
                            nextBooking &&
                            booking.id === nextBooking.id}
                        {@const past = isPast(day, hour)}
                        <div
                            on:mousedown={(e) => {
                                e.preventDefault();
                                handleMouseDown(day, hour);
                            }}
                            on:mouseenter={() => handleMouseEnter(day, hour)}
                            on:mouseup={handleMouseUp}
                            on:dragstart|preventDefault
                            on:keydown={(e) => {
                                if (e.key === "Enter" || e.key === " ")
                                    handleSlotClick(day, hour);
                            }}
                            role="button"
                            tabindex="0"
                            class="min-h-[3rem] border-l border-b border-slate-100 dark:border-slate-700 p-1 transition-colors text-left relative select-none
                {isContinued || isSelectionContinued(day, hour)
                                ? 'border-b-transparent'
                                : 'border-b-slate-100 dark:border-b-slate-700'}
                {booking
                                ? 'bg-booked/50 hover:bg-booked cursor-pointer'
                                : isSelected(day, hour)
                                  ? 'bg-green-100 dark:bg-green-900/50 ring-2 ring-green-400 z-10'
                                  : past
                                    ? 'bg-slate-50 dark:bg-slate-900/50 cursor-not-allowed'
                                    : 'hover:bg-available/50 cursor-pointer'}
                {isToday(day) ? 'bg-indigo-50/30 dark:bg-indigo-900/20' : ''}"
                        >
                            {#if booking && shouldShowBookingInfo(day, hour, booking)}
                                <div
                                    class="text-xs font-medium text-booked-text truncate"
                                >
                                    {getInstrumentName(booking.instrument_id)}
                                </div>
                                <div
                                    class="text-xs text-slate-500 dark:text-slate-400 truncate"
                                >
                                    {booking.user_name}
                                </div>
                            {/if}
                        </div>
                    {/each}
                </div>
            {/each}
        </div>
    </div>

    <!-- Legend -->
    <div
        class="p-3 border-t border-slate-200 dark:border-slate-700 flex items-center gap-4 text-xs"
    >
        <div class="flex items-center gap-1.5">
            <div
                class="w-3 h-3 rounded bg-available border border-available-border"
            ></div>
            <span class="text-slate-500 dark:text-slate-400">Available</span>
        </div>
        <div class="flex items-center gap-1.5">
            <div
                class="w-3 h-3 rounded bg-booked border border-booked-border"
            ></div>
            <span class="text-slate-500 dark:text-slate-400">Booked</span>
        </div>
        <div class="flex items-center gap-1.5">
            <div
                class="w-3 h-3 rounded bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600"
            ></div>
            <span class="text-slate-500 dark:text-slate-400">Past</span>
        </div>
    </div>
</div>
