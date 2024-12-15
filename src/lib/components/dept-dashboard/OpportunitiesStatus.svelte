<script lang="ts">
    import { onMount } from "svelte";
    import Chart from "chart.js/auto";
    import { supabase } from "$lib/supabaseClient";

    let opportunities = $state({
        achieved: 0,
        notAchieved: 0,
        total: 0
    });
    let isLoading = $state(true);
    let canvas: HTMLCanvasElement;
    let chart: Chart | null = null;
    let departmentId: string;

    const fetchOpportunities = async () => {
        try {
            // Get user's department ID
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error('No session');

            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('department_id')
                .eq('id', session.user.id)
                .single();

            if (profileError) throw profileError;
            departmentId = profileData.department_id;

            // Fetch department-specific opportunities
            const { data, error } = await supabase
                .from("opt_monitoring")
                .select("is_accomplished")
                .eq('department_id', departmentId);

            if (error) throw error;

            const achieved = data.filter(item => item.is_accomplished).length;
            const total = data.length;
            
            opportunities = {
                achieved,
                notAchieved: total - achieved,
                total
            };

            setTimeout(() => {
                createChart();
            }, 0);
        } catch (error) {
            console.error("Error fetching opportunities:", error);
        } finally {
            isLoading = false;
        }
    };

    const createChart = () => {
        if (!canvas) return;
        
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        if (chart) {
            chart.destroy();
        }

        chart = new Chart(ctx, {
            type: "doughnut",
            data: {
                labels: ["Achieved", "Not Achieved"],
                datasets: [{
                    data: [opportunities.achieved, opportunities.notAchieved],
                    backgroundColor: ["#34C759", "#FF3B30"],
                    borderWidth: 2,
                    borderColor: "#ffffff"
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: "65%",
                plugins: {
                    legend: {
                        position: "bottom",
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    }
                }
            }
        });
    };

    onMount(() => {
        fetchOpportunities();
    });
</script>

<div class="w-full rounded-lg border bg-card border-border p-4 hover:shadow-lg transition-all duration-300">
    <h2 class="mb-6 text-xl font-semibold">Opportunities Status</h2>

    {#if isLoading}
    <div class="flex justify-center p-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
    {:else}
    <div class="flex items-center justify-center mb-4">
        <div class="text-center">
            <div class="text-4xl font-bold">{opportunities.total}</div>
            <div class="text-sm text-muted-foreground">Total Opportunities</div>
        </div>
    </div>

    <div class="h-[300px]">
        <canvas bind:this={canvas}></canvas>
    </div>
    {/if}
</div>