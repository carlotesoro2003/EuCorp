<script lang="ts">
    import { onMount } from "svelte";
    import Chart from "chart.js/auto";
    import { supabase } from "$lib/supabaseClient";

    let canvas: HTMLCanvasElement;
    let chart: Chart;
    let departmentId: string;

    let data = {
        goals: [] as string[],
        achieved: [] as number[],
        notAchieved: [] as number[],
    };

    let currentPage = 0;
    let barsPerPage = 9;
    let paginatedData = {
        goals: [] as string[],
        achieved: [] as number[],
        notAchieved: [] as number[],
    };

    const updateBarsPerPage = () => {
        const screenWidth = window.innerWidth;
        barsPerPage = screenWidth < 640 ? 2 : 9;
        updatePaginatedData();
    };

    const fetchStrategicData = async () => {
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

            // Fetch strategic goals with department-specific action plans
            const { data: result, error } = await supabase
                .from("strategic_goals")
                .select(`
                    id,
                    goal_no,
                    name,
                    strategic_objectives!inner (
                        id,
                        name,
                        action_plans!inner (
                            id,
                            department_id,
                            plan_monitoring (
                                id,
                                is_accomplished
                            )
                        )
                    )
                `)
                .eq('strategic_objectives.action_plans.department_id', departmentId);

            if (error) throw error;

            // Process department-specific data
            const goals = result.map((goal) => {
                const achievedCount = goal.strategic_objectives
                    .flatMap((obj) => obj.action_plans
                        .flatMap((plan) => plan.plan_monitoring
                            .filter((monitor) => monitor.is_accomplished)
                        )).length;

                const totalCount = goal.strategic_objectives
                    .flatMap((obj) => obj.action_plans
                        .flatMap((plan) => plan.plan_monitoring)).length;

                return {
                    goal_no: goal.goal_no,
                    achieved: achievedCount,
                    notAchieved: totalCount - achievedCount
                };
            });

            // Sort and update data
            const sortedGoals = goals.sort((a, b) => a.goal_no - b.goal_no);
            data.goals = sortedGoals.map((goal) => `Strategic Goal ${goal.goal_no}`);
            data.achieved = sortedGoals.map((goal) => goal.achieved);
            data.notAchieved = sortedGoals.map((goal) => goal.notAchieved);

            updateBarsPerPage();
        } catch (error) {
            console.error("Error fetching strategic data:", error);
        }
    };

    const updatePaginatedData = () => {
        const start = currentPage * barsPerPage;
        const end = start + barsPerPage;

        paginatedData.goals = data.goals.slice(start, end);
        paginatedData.achieved = data.achieved.slice(start, end);
        paginatedData.notAchieved = data.notAchieved.slice(start, end);

        createChart();
    };

    const createChart = () => {
        const ctx = canvas.getContext("2d");
        if (ctx) {
            if (chart) chart.destroy();

            chart = new Chart(ctx, {
                type: "bar",
                data: {
                    labels: paginatedData.goals,
                    datasets: [
                        {
                            label: "Achieved",
                            data: paginatedData.achieved,
                            backgroundColor: "#e21d48",
                            borderColor: "#e21d48",
                            borderWidth: 1,
                            barThickness: 100,
                            maxBarThickness: 100,
                        },
                        {
                            label: "Not Achieved",
                            data: paginatedData.notAchieved,
                            backgroundColor: "#e5e7eb",
                            borderColor: "#e5e7eb",
                            borderWidth: 1,
                            barThickness: 100,
                            maxBarThickness: 100,
                        },
                    ],
                },
                options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: "bottom",
        },
    },
    scales: {
        x: {
            stacked: true,
            ticks: {
                autoSkip: false,
            },
        },
        y: {
            stacked: true,
            beginAtZero: true,
        },
    },
},
            });
        }
    };

    const goToNextPage = () => {
        if ((currentPage + 1) * barsPerPage < data.goals.length) {
            currentPage++;
            updatePaginatedData();
        }
    };

    const goToPreviousPage = () => {
        if (currentPage > 0) {
            currentPage--;
            updatePaginatedData();
        }
    };

    let resizeTimer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            updateBarsPerPage();
        }, 250);
    };

    onMount(() => {
        fetchStrategicData();
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
            if (chart) chart.destroy();
        };
    });
</script>

<div class="relative h-[400px] w-full bg-card">
    <canvas bind:this={canvas}></canvas>
</div>

<div class="flex justify-center mt-4 space-x-4">
    <button 
        class="flex items-center gap-2 bg-secondary text-foreground hover:bg-gray-200 px-4 py-2 rounded-lg hover:bg-secondary/80 justify-center flex-1 md:flex-initial"
        on:click={goToPreviousPage}
        disabled={currentPage === 0}
    >
        Previous
    </button>
    <button 
        class="flex items-center gap-2 bg-secondary text-foreground hover:bg-gray-200 px-4 py-2 rounded-lg hover:bg-secondary/80 justify-center flex-1 md:flex-initial"
        on:click={goToNextPage}
        disabled={(currentPage + 1) * barsPerPage >= data.goals.length}
    >
        Next
    </button>
</div>