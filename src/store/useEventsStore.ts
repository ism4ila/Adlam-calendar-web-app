import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CalendarEvent {
    id: string;
    title: string;
    description?: string;
    date: string; // ISO date string
    time?: string; // HH:mm
    type: 'personal' | 'cultural' | 'prayer';
    color: string;
    isRecurring?: boolean;
    createdAt: number;
}

interface EventsStore {
    events: CalendarEvent[];
    addEvent: (event: Omit<CalendarEvent, 'id' | 'createdAt'>) => void;
    updateEvent: (id: string, updates: Partial<CalendarEvent>) => void;
    deleteEvent: (id: string) => void;
    getEventsByDate: (date: string) => CalendarEvent[];
    getEventsByMonth: (year: number, month: number) => CalendarEvent[];
}

export const useEventsStore = create<EventsStore>()(
    persist(
        (set, get) => ({
            events: [],
            addEvent: (event) =>
                set((state) => ({
                    events: [
                        ...state.events,
                        {
                            ...event,
                            id: `event-${Date.now()}`,
                            createdAt: Date.now(),
                        },
                    ],
                })),
            updateEvent: (id, updates) =>
                set((state) => ({
                    events: state.events.map((event) =>
                        event.id === id ? { ...event, ...updates } : event
                    ),
                })),
            deleteEvent: (id) =>
                set((state) => ({
                    events: state.events.filter((event) => event.id !== id),
                })),
            getEventsByDate: (date) => {
                return get().events.filter((event) => event.date === date);
            },
            getEventsByMonth: (year, month) => {
                return get().events.filter((event) => {
                    const eventDate = new Date(event.date);
                    return (
                        eventDate.getFullYear() === year &&
                        eventDate.getMonth() === month
                    );
                });
            },
        }),
        {
            name: 'acc-events',
        }
    )
);
