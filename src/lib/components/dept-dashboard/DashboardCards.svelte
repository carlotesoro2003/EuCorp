<script lang="ts">
    import { onMount } from 'svelte';
    import { supabase } from '$lib/supabaseClient';
    import {
        dashboardData,
        updateActionPlansCount,
        updateDepartmentRisksCount,
        updateDepartmentOpportunitiesCount 
       
    } from './data';
    let userId: string;

    let cards = dashboardData.cards; // Local copy for reactive updates

    // Fetch updated data on component mount
    onMount(async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            userId = session.user.id;
            await updateActionPlansCount(userId);
            await updateDepartmentRisksCount(userId),
            await updateDepartmentOpportunitiesCount(userId)
        }
    
        cards = [...dashboardData.cards]; // Reflect updated data
    });

    // Get dynamic color based on change value
    const getChangeColor = (change: number) => {
        return change >= 0 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600";
    };
</script>

<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
    {#each cards as card}
        <div class="group relative overflow-hidden bg-card rounded-lg border border-border p-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm font-medium text-gray-500 dark:text-gray-300">{card.title}</p>
                    <p class="mt-2 text-3xl font-bold ">{card.value}</p>
                </div>
                <div class="rounded-xl bg-blue-50 p-4 text-2xl text-blue-600 transition-transform duration-300 group-hover:rotate-12">
                    {card.icon}
                </div>
            </div>
            <div class="mt-4">
               
            </div>
        </div>
    {/each}
</div>
