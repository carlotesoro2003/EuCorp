<script lang="ts">
    import { onMount } from "svelte";
    import Chart from "chart.js/auto";
    import { supabase } from "$lib/supabaseClient";
    import { ArrowLeft } from "lucide-svelte";

    interface OpportunitiesData {
        achieved: number;
        notAchieved: number;
        total: number;
    }

    interface DepartmentOpportunities {
        name: string;
        achieved: number;
        notAchieved: number;
    }

    let opportunities: OpportunitiesData = {
        achieved: 0,
        notAchieved: 0,
        total: 0
    };
    
    let departmentData: DepartmentOpportunities[] = [];
    let isDrilledDown = false;
    let isLoading = true;
    let canvas: HTMLCanvasElement;
    let chart: Chart | null = null;

    const fetchOpportunities = async () => {
        try {
            const { data, error } = await supabase
                .from("opt_monitoring")
                .select(`
                    is_accomplished,
                    opportunities (
                        department:department_id (
                            id,
                            name
                        )
                    )
                `);

            if (error) throw error;

            opportunities = {
                achieved: data.filter(item => item.is_accomplished).length,
                notAchieved: data.filter(item => !item.is_accomplished).length,
                total: data.length
            };

            const deptMap = new Map<string, DepartmentOpportunities>();
            
            data.forEach(item => {
                const deptName = item.opportunities?.department?.name || 'Unassigned';
                if (!deptMap.has(deptName)) {
                    deptMap.set(deptName, { name: deptName, achieved: 0, notAchieved: 0 });
                }
                
                const dept = deptMap.get(deptName)!;
                if (item.is_accomplished) {
                    dept.achieved++;
                } else {
                    dept.notAchieved++;
                }
            });

            departmentData = Array.from(deptMap.values());
            setTimeout(() => createChart(), 0);
        } catch (error) {
            console.error("Error fetching opportunities:", error);
        } finally {
            isLoading = false;
        }
    };

    const createChart = () => {
        const ctx = canvas?.getContext("2d");
        if (!ctx) return;

        if (chart) chart.destroy();

        const chartData = isDrilledDown
            ? {
                labels: departmentData.map(d => d.name),
                data: departmentData.map(d => d.achieved + d.notAchieved)
            }
            : {
                labels: ['Achieved', 'Not Achieved'],
                data: [opportunities.achieved, opportunities.notAchieved]
            };

        chart = new Chart(ctx, {
            type: "doughnut",
            data: {
                labels: chartData.labels,
                datasets: [{
                    data: chartData.data,
                    backgroundColor: isDrilledDown
                        ? departmentData.map((_, i) => 
                            `hsl(${(i * 360) / departmentData.length}, 70%, 60%)`)
                        : ['#22c55e', '#ef4444'],
                    borderWidth: 2,
                    borderColor: '#ffffff',
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: "65%",
                layout: {
                    padding: {
                        top: 20,
                        bottom: 20
                    }
                },
                onClick: (event, elements) => {
                    if (elements && elements.length > 0 && !isDrilledDown) {
                        isDrilledDown = true;
                        createChart();
                    }
                },
                onHover: (event, elements) => {
                    if (!event.native) return;
                    const target = event.native.target as HTMLElement;
                    target.style.cursor = elements?.length ? 'pointer' : 'default';
                },
                plugins: {
                    legend: {
                        position: "bottom",
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            boxWidth: 8,
                            font: {
                                size: 11
                            }
                        },
                        maxHeight: 150,
                        overflow: 'auto'
                    },
                    title: {
                        display: isDrilledDown,
                        text: isDrilledDown ? 'Opportunities by Department' : '',
                        font: { size: 16, weight: 'bold' }
                    }
                },
                elements: {
                    arc: {
                        hoverCursor: 'pointer'
                    }
                }
            }
        });
    };

    onMount(() => {
        fetchOpportunities();
    });
</script>

<div class="relative bg-card p-6 rounded-lg border border-border">
    <h2 class="mb-6 text-xl font-semibold">Opportunities Status</h2>

    {#if isDrilledDown}
        <button 
            class="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 text-sm font-medium bg-secondary hover:bg-secondary/80 rounded-lg transition-colors cursor-pointer"
            on:click={() => {
                isDrilledDown = false;
                createChart();
            }}
        >
            <ArrowLeft class="w-4 h-4" />
            Back to Overview
        </button>
    {/if}

    <div class="h-[400px] w-full">
        {#if isLoading}
            <div class="flex items-center justify-center h-full">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        {:else}
            <canvas bind:this={canvas}></canvas>
        {/if}
    </div>
</div>