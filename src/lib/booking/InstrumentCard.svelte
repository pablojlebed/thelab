<script lang="ts">
    import type { Instrument } from "./types";
    import {
        Beaker,
        Activity,
        Atom,
        FlaskConical,
        Calendar,
        Wrench,
        Bell,
    } from "lucide-svelte";
    import { onMount, onDestroy, createEventDispatcher } from "svelte";
    import VanillaTilt from "vanilla-tilt";

    export let instrument: Instrument;

    let cardElement: HTMLElement;
    let tiltInstance: any;
    let notifyWhenAvailable = false;
    const dispatch = createEventDispatcher();

    onMount(() => {
        if (cardElement) {
            VanillaTilt.init(cardElement, {
                max: 3,
                speed: 400,
                glare: false,
                scale: 1.01,
            });
            tiltInstance = (cardElement as any).vanillaTilt;
        }
    });

    onDestroy(() => {
        if (tiltInstance) {
            tiltInstance.destroy();
        }
    });

    function getCategoryStyle(category: string) {
        switch (category) {
            case "Spectroscopy":
                return "bg-cat-spectro border-cat-spectro-border text-cat-spectro-text";
            case "Chromatography":
                return "bg-cat-chroma border-cat-chroma-border text-cat-chroma-text";
            case "Elemental":
                return "bg-cat-elemental border-cat-elemental-border text-cat-elemental-text";
            default:
                return "bg-cat-general border-cat-general-border text-cat-general-text";
        }
    }

    function getCategoryIcon(category: string) {
        switch (category) {
            case "Spectroscopy":
                return Activity;
            case "Chromatography":
                return FlaskConical;
            case "Elemental":
                return Atom;
            default:
                return Beaker;
        }
    }

    function getStatusStyle(status: string) {
        switch (status) {
            case "available":
                return "status-available";
            case "booked":
                return "status-booked";
            case "maintenance":
                return "status-maintenance";
            default:
                return "bg-slate-100 border-slate-200 text-slate-600";
        }
    }

    function getStatusText(status: string) {
        switch (status) {
            case "available":
                return "Available";
            case "booked":
                return "In Use";
            case "maintenance":
                return "Maintenance";
            default:
                return status;
        }
    }

    function handleBookClick() {
        dispatch("book", instrument);
    }

    function handleCardClick() {
        dispatch("select", instrument);
    }
</script>

<div
    bind:this={cardElement}
    class="card-pastel p-5 cursor-pointer active:cursor-grabbing group hover:shadow-md relative flex flex-col h-full"
    on:click={handleCardClick}
    on:keydown={(e) => e.key === "Enter" && handleCardClick()}
    role="button"
    tabindex="0"
>
    <!-- Category Icon -->
    <div class="flex justify-between items-start mb-3">
        <div
            class="p-2 rounded-lg {getCategoryStyle(
                instrument.category,
            )} border"
        >
            <svelte:component
                this={getCategoryIcon(instrument.category)}
                size={20}
            />
        </div>
        <div
            class="px-2 py-0.5 rounded text-[10px] font-bold uppercase border {getStatusStyle(
                instrument.status,
            )}"
        >
            {getStatusText(instrument.status)}
        </div>
    </div>

    <!-- Instrument Info -->
    <h3
        class="font-semibold text-slate-800 dark:text-slate-100 text-lg leading-tight mb-2"
    >
        {instrument.name}
    </h3>

    <p class="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">
        {instrument.description}
    </p>

    <!-- Footer -->
    <div
        class="flex items-center justify-between border-t border-slate-100 dark:border-slate-700 pt-3 mt-auto"
    >
        <span
            class="px-2 py-1 rounded text-xs font-medium border {getCategoryStyle(
                instrument.category,
            )}"
        >
            {instrument.category}
        </span>

        {#if instrument.status === "available"}
            <button
                on:click|stopPropagation={handleBookClick}
                class="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-all shadow-sm"
            >
                <Calendar size={14} />
                Book Now
            </button>
        {:else if instrument.status === "maintenance"}
            <div class="flex items-center gap-2">
                <button
                    on:click|stopPropagation={() =>
                        (notifyWhenAvailable = !notifyWhenAvailable)}
                    class="p-1.5 rounded-lg border transition-colors {notifyWhenAvailable
                        ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-700 text-indigo-600 dark:text-indigo-400'
                        : 'bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:border-slate-300 dark:hover:border-slate-500'}"
                    title={notifyWhenAvailable
                        ? "Notification set"
                        : "Notify me when available"}
                >
                    <Bell
                        size={14}
                        class={notifyWhenAvailable
                            ? "fill-indigo-600 dark:fill-indigo-400"
                            : ""}
                    />
                </button>
                <button
                    disabled
                    class="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-sm font-medium rounded-lg border border-amber-200 dark:border-amber-700 cursor-not-allowed"
                >
                    <Wrench size={14} />
                    Maintenance
                </button>
            </div>
        {:else}
            <button
                disabled
                class="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 dark:bg-slate-700 text-slate-400 text-sm font-medium rounded-lg border border-slate-200 dark:border-slate-600 cursor-not-allowed"
            >
                <Calendar size={14} />
                Booked
            </button>
        {/if}
    </div>
</div>
