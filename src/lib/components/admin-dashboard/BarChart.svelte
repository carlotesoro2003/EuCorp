<script lang="ts">
    import { onMount } from "svelte";
    import Chart from "chart.js/auto";
    import { supabase } from "../../supabaseClient";
    import { ArrowLeft } from "lucide-svelte";

    interface ChartData {
        goals: string[];
        fullGoalNames: string[];
        goalIds: number[];
        achieved: number[];
        notAchieved: number[];
    }

    let canvas: HTMLCanvasElement;
    let chart: Chart;
    let isDrilledDown = false;
    let selectedGoalName: string = "";
    
    // Separate pagination states
    let goalsCurrentPage = 0;
    let deptCurrentPage = 0;
    const goalsPerPage = 9;
    const deptsPerPage = 6;

    let data: ChartData = {
        goals: [],
        fullGoalNames: [],
        goalIds: [],
        achieved: [],
        notAchieved: []
    };

    let departmentData = {
        labels: [] as string[],
        achieved: [] as number[],
        notAchieved: [] as number[]
    };

    let paginatedData = {
        goals: [] as string[],
        achieved: [] as number[],
        notAchieved: [] as number[]
    };

    const updatePaginatedData = () => {
        const currentPage = isDrilledDown ? deptCurrentPage : goalsCurrentPage;
        const itemsPerPage = isDrilledDown ? deptsPerPage : goalsPerPage;
        const start = currentPage * itemsPerPage;
        const end = start + itemsPerPage;

        if (isDrilledDown) {
            paginatedData = {
                goals: departmentData.labels.slice(start, end),
                achieved: departmentData.achieved.slice(start, end),
                notAchieved: departmentData.notAchieved.slice(start, end)
            };
        } else {
            paginatedData = {
                goals: data.goals.slice(start, end),
                achieved: data.achieved.slice(start, end),
                notAchieved: data.notAchieved.slice(start, end)
            };
        }
        createChart();
    };

	const fetchData = async () => {
    try {
        const { data: goals } = await supabase
            .from('strategic_goals')
            .select(`
                id,
                name,
                goal_no,
                strategic_objectives (
                    action_plans (
                        plan_monitoring (
                            id,
                            is_accomplished
                        )
                    )
                )
            `)
            .order('goal_no');

        if (goals) {
            data.goals = goals.map(g => `Strategic Goal ${g.goal_no}`);
            data.fullGoalNames = goals.map(g => `Strategic Goal ${g.goal_no}: ${g.name}`);
            data.goalIds = goals.map(g => g.id);
            
            // Count only plan_monitoring entries
            data.achieved = goals.map(g => 
                g.strategic_objectives
                    .flatMap(o => o.action_plans)
                    .flatMap(p => p.plan_monitoring)
                    .filter(m => m.is_accomplished)
                    .length
            );
            
            data.notAchieved = goals.map(g => 
                g.strategic_objectives
                    .flatMap(o => o.action_plans)
                    .flatMap(p => p.plan_monitoring)
                    .filter(m => !m.is_accomplished)
                    .length
            );
            updatePaginatedData();
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
};

const fetchDepartmentData = async (goalId: number) => {
    try {
        const { data: departments, error } = await supabase
            .from('departments')
            .select(`
                id,
                name,
                profiles (
                    action_plans!inner (
                        plan_monitoring (
                            id,
                            is_accomplished
                        ),
                        strategic_objectives!inner (
                            strategic_goal_id
                        )
                    )
                )
            `)
            .filter('profiles.action_plans.strategic_objectives.strategic_goal_id', 'eq', goalId);

        if (error) throw error;

        const processedData = departments
            .filter(dept => dept.profiles.some(profile => 
                profile.action_plans.some(plan => 
                    plan.plan_monitoring && plan.plan_monitoring.length > 0
                )
            ))
            .map(dept => {
                const monitoringData = dept.profiles.flatMap(profile => 
                    profile.action_plans.flatMap(plan => plan.plan_monitoring)
                );
                
                return {
                    name: dept.name,
                    achieved: monitoringData.filter(m => m.is_accomplished).length,
                    notAchieved: monitoringData.filter(m => !m.is_accomplished).length
                };
            });

        departmentData = {
            labels: processedData.map(d => d.name),
            achieved: processedData.map(d => d.achieved),
            notAchieved: processedData.map(d => d.notAchieved)
        };
        deptCurrentPage = 0;
        updatePaginatedData();
    } catch (error) {
        console.error("Error fetching department data:", error);
    }
};

    const createChart = () => {
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        if (chart) chart.destroy();

        const chartData = isDrilledDown ? departmentData : paginatedData;
        const barCount = isDrilledDown ? paginatedData.goals.length : paginatedData.goals.length;

        chart = new Chart(ctx, {
            type: "bar",
            data: {
                labels: isDrilledDown ? paginatedData.goals : paginatedData.goals,
                datasets: [
                    {
                        label: "Achieved",
                        data: paginatedData.achieved,
						backgroundColor: "#e21d48",
                        borderColor: "#e21d48",

                        borderWidth: 1,
                        barThickness: barCount <= 3 ? 100 : undefined,
                        maxBarThickness: 100,
                    },
                    {
                        label: "Not Achieved",
                        data: paginatedData.notAchieved,
						backgroundColor: "#e5e7eb",
                        borderColor: "#e5e7eb",

                        borderWidth: 1,
                        barThickness: barCount <= 3 ? 100 : undefined,
                        maxBarThickness: 100,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                onClick: handleChartClick,
				onHover: (event, elements) => {
                const target = event.native?.target as HTMLElement;
                if (elements && elements.length > 0) {
                    target.style.cursor = 'pointer';
                } else {
                    target.style.cursor = 'default';
                }
            },
			animation: {
            duration: 750,
            easing: 'easeInOutQuart',
        },
        transitions: {
            active: {
                animation: {
                    duration: 750
                }
            }
        },
                plugins: {
                    title: {
                        display: isDrilledDown,
                        text: isDrilledDown ? selectedGoalName : '',
                        font: { size: 16, weight: 'bold' }
                    },
                    legend: {
                        position: "bottom",
                    },
                },
                scales: {
                    x: {
                        stacked: true,
                        ticks: {
                            autoSkip: false,
                        }
                    },
                    y: {
                        stacked: true,
                        beginAtZero: true,
                    }
                },
            },
        });
    };

    const handleChartClick = async (event: MouseEvent) => {
        const points = chart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, false);
        
        if (points.length) {
            const index = points[0].index;
            
            if (!isDrilledDown) {
                const goalId = data.goalIds[goalsCurrentPage * goalsPerPage + index];
                if (goalId) {
                    selectedGoalName = data.fullGoalNames[goalsCurrentPage * goalsPerPage + index];
                    isDrilledDown = true;
                    await fetchDepartmentData(goalId);
                }
            }
        }
    };

    const handleBackClick = () => {
        isDrilledDown = false;
        selectedGoalName = "";
        updatePaginatedData();
    };

    onMount(async () => {
        await fetchData();
    });
</script>

<div class="relative bg-card p-6 rounded-lg border border-border">
    {#if isDrilledDown}
        <div class="flex items-center gap-2 mb-4">
            <button 
                class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground bg-secondary hover:bg-secondary/80 rounded-lg transition-colors"
                on:click={handleBackClick}
            >
                <ArrowLeft class="w-4 h-4" />
                Back to Goals
            </button>
        </div>
    {/if}
    
    <div class="h-[400px] w-full">
        <canvas bind:this={canvas}></canvas>
    </div>

    <div class="flex justify-center mt-4 gap-4">
        <button 
            class="px-4 py-2 text-sm font-medium text-foreground bg-secondary hover:bg-secondary/80 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            on:click={() => {
                if (isDrilledDown) {
                    if (deptCurrentPage > 0) {
                        deptCurrentPage--;
                        updatePaginatedData();
                    }
                } else {
                    if (goalsCurrentPage > 0) {
                        goalsCurrentPage--;
                        updatePaginatedData();
                    }
                }
            }}
            disabled={isDrilledDown ? deptCurrentPage === 0 : goalsCurrentPage === 0}
        >
            Previous
        </button>
        <button 
            class="px-4 py-2 text-sm font-medium text-foreground bg-secondary hover:bg-secondary/80 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            on:click={() => {
                if (isDrilledDown) {
                    if ((deptCurrentPage + 1) * deptsPerPage < departmentData.labels.length) {
                        deptCurrentPage++;
                        updatePaginatedData();
                    }
                } else {
                    if ((goalsCurrentPage + 1) * goalsPerPage < data.goals.length) {
                        goalsCurrentPage++;
                        updatePaginatedData();
                    }
                }
            }}
            disabled={isDrilledDown 
                ? (deptCurrentPage + 1) * deptsPerPage >= departmentData.labels.length 
                : (goalsCurrentPage + 1) * goalsPerPage >= data.goals.length}
        >
            Next
        </button>
    </div>
</div>