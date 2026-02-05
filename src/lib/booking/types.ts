export type Instrument = {
    id: string;
    name: string;
    description: string;
    category: 'Spectroscopy' | 'Chromatography' | 'Elemental' | 'General';
    image_url?: string;
    status: 'available' | 'booked' | 'maintenance';
    created_at?: string;
};

export type Booking = {
    id: string;
    instrument_id: string;
    user_name: string;
    start_time: string;
    end_time: string;
    purpose?: string;
    created_at?: string;
    instrument?: Instrument;
};

export type TimeSlot = {
    start: Date;
    end: Date;
    available: boolean;
    booking?: Booking;
};

export const CATEGORIES = ['Spectroscopy', 'Chromatography', 'Elemental', 'General'] as const;
export type Category = typeof CATEGORIES[number];
