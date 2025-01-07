<script lang="ts">
    import { supabase } from "$lib/supabaseClient";
    import { onMount } from "svelte";
    import { Bell } from "lucide-svelte";

    interface RecentEvent {
        id: number;
        description: string;
        created_at: string;
        event_type: string; 
        is_read: boolean;
        is_new?: boolean; 
    }

    let isOpen = false;
    let recentEvents: RecentEvent[] = [];
    let isLoading = false;
    let hasUnread = false; 
    let newEventIds: Set<number> = new Set(JSON.parse(localStorage.getItem('newEventIds') || '[]')); 

    /** Fetch recent events */
    const fetchRecentEvents = async () => {
        isLoading = true;
        try {
            // Fetch all recent events
            const { data, error } = await supabase
                .from("recent_events")
                .select("id, description, created_at, event_type, is_read")
                .order("created_at", { ascending: false })
                .limit(5);

            if (error) throw error;

            // Update recent events and mark new ones
            recentEvents = (data || []).map((event) => {
                const isNew = !newEventIds.has(event.id) && !event.is_read;
                if (isNew) {
                    newEventIds.add(event.id); // Track newly fetched unread events
                    localStorage.setItem('newEventIds', JSON.stringify([...newEventIds]));
                }
                return {
                    ...event,
                    is_new: isNew,
                };
            });

            // Update unread status
            hasUnread = recentEvents.some((event) => !event.is_read);
        } catch (error) {
            console.error("Error fetching recent events:", error);
        } finally {
            isLoading = false;
        }
    };

    //** Mark all unread notifications as read */
    const markAllAsRead = async () => {
        try {
            // Update `is_read` to true only for unread notifications
            const { data, error } = await supabase
                .from("recent_events")
                .update({ is_read: true })
                .eq("is_read", false);

            if (error) throw error;

            // Check how many rows were updated (for debugging)
            console.log("Updated Notifications:", data);

            // Update the local state to mark all as read
            recentEvents = recentEvents.map((event) => ({
                ...event,
                is_read: true,
                is_new: false, // Remove highlight for new events
            }));

            // Reset the flags
            hasUnread = false;
            newEventIds.clear();
        } catch (error) {
            console.error("Error marking notifications as read:", error);
        }
    };


    /** Toggle dropdown and fetch notifications */
    const toggleDropdown = async () => {
        isOpen = !isOpen;
        if (isOpen) {
            await fetchRecentEvents(); // Refresh notifications
        }
    };

    onMount(() => {
        fetchRecentEvents();
    });
</script>

<div class="relative">
    <!-- Notification Bell -->
    <button
        on:click={toggleDropdown}
        class="p-2 rounded-lg border border-gray-200 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800 transition-colors"
    >
        <Bell class="h-[1.2rem] w-[1.2rem]" />
        {#if hasUnread}
            <span class="absolute -top-1 -right-1 bg-red-500 text-white rounded-full h-4 w-4"></span>
        {/if}
    </button>

    <!-- Notifications Dropdown -->
    {#if isOpen}
        <div class="absolute right-0 mt-2 w-80 rounded-lg border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 shadow-lg z-50">
            <div class="p-4">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="font-semibold">Notifications</h3>
                    <!-- Mark as Read Button -->
                    <button
                        on:click={markAllAsRead}
                        class="text-sm text-primary bg-primary/10 hover:bg-primary/20 px-2 py-1 rounded-md transition-colors"
                    >
                        Mark as Read
                    </button>
                </div>
                {#if isLoading}
                    <div class="flex justify-center p-4">
                        <div class="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full"></div>
                    </div>
                {:else if recentEvents.length === 0}
                    <p class="text-gray-500 text-center">No notifications</p>
                {:else}
                    <div class="space-y-3">
                        {#each recentEvents as event}
                            <div
                                class="p-3 rounded-lg border border-gray-100 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
                                class:is-new={event.is_new}
                            >
                                <p class="text-sm">{event.description}</p>
                                <p class="text-xs text-gray-500 mt-1">
                                    {new Date(event.created_at).toLocaleString("en-PH", { timeZone: "Asia/Manila" })}
                                </p>
                            </div>
                        {/each}
                    </div>
                {/if}
            </div>
        </div>
    {/if}
</div>

<style>
    .is-new {
        background-color: #eaf4fc; 
    }
</style>
