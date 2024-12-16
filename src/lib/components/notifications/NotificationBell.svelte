<script lang="ts">
    import { supabase } from "$lib/supabaseClient";
    import { onMount } from "svelte";
    import { Bell } from "lucide-svelte";

    interface RecentEvent {
        description: string;
        created_at: string;
        event_type: string;
        is_read: boolean;
    }

    let isOpen = false;
    let recentEvents: RecentEvent[] = [];
    let isLoading = false;
    let hasUnread = false; // Track if there are any unread notifications

    /** Fetch recent events */
    const fetchRecentEvents = async () => {
        isLoading = true;
        try {
            // Fetch all recent events
            const { data, error } = await supabase
                .from("recent_events")
                .select("description, created_at, event_type, is_read")
                .order("created_at", { ascending: false })
                .limit(5);

            if (error) throw error;

            recentEvents = data || [];
            // Check if there are any unread notifications
            hasUnread = recentEvents.some((event) => !event.is_read);
        } catch (error) {
            console.error("Error fetching recent events:", error);
        } finally {
            isLoading = false;
        }
    };

    /** Mark all notifications as read */
    const markAllAsRead = async () => {
        try {
            // Update `is_read` to true for all notifications
            const { error } = await supabase
                .from("recent_events")
                .update({ is_read: true })
                .eq("is_read", false);

            if (error) throw error;

            hasUnread = false; // Reset unread indicator
        } catch (error) {
            console.error("Error marking notifications as read:", error);
        }
    };

    /** Toggle dropdown and mark notifications as read */
    const toggleDropdown = async () => {
        isOpen = !isOpen;
        if (isOpen) {
            await markAllAsRead(); // Mark notifications as read when the dropdown is opened
            fetchRecentEvents(); // Refresh notifications
        }
    };

    /** Listen to new notifications using Supabase real-time */
    const setupRealtimeListener = () => {
        const subscription = supabase
            .channel("new-notifications")
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "public", table: "recent_events" },
                (payload) => {
                    const newEvent: RecentEvent = {
                        description: payload.new.description,
                        created_at: payload.new.created_at,
                        event_type: payload.new.event_type,
                        is_read: payload.new.is_read,
                    };
                    recentEvents = [newEvent, ...recentEvents]; // Add new event to the list
                    if (!newEvent.is_read) hasUnread = true; // Show unread indicator
                }
            )
            .subscribe();

        return () => subscription.unsubscribe(); // Cleanup subscription on destroy
    };

    onMount(() => {
        fetchRecentEvents();
        const unsubscribe = setupRealtimeListener();

        return unsubscribe; // Cleanup on unmount
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
                <h3 class="font-semibold mb-4">Notifications</h3>
                {#if isLoading}
                    <div class="flex justify-center p-4">
                        <div class="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full"></div>
                    </div>
                {:else if recentEvents.length === 0}
                    <p class="text-gray-500 text-center">No notifications</p>
                {:else}
                    <div class="space-y-3">
                        {#each recentEvents as event}
                            <div class="p-3 rounded-lg border border-gray-100 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700">
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
