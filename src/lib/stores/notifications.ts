import { writable } from 'svelte/store';

export interface Notification {
    id: number;
    description: string;
    created_at: string;
    event_type: string;
    read: boolean;
}

export const notifications = writable<Notification[]>([]);
    