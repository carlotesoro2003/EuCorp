<script lang="ts">
    import { onMount } from "svelte";
    import Chart from "chart.js/auto";
    import { supabase } from "$lib/supabaseClient";
    import { ChevronDown } from "lucide-svelte";

    // State variables using svelte 5 runes
    let classifications: string[] = $state([]);
    let selectedCategory: string = $state("");
    let riskData: Record<string, { low: number; medium: number; high: number; very_high: number }> = $state({});
    let isLoading: boolean = $state(true);
    let canvas: HTMLCanvasElement;
    let chart: Chart | null = null;
    let departmentId: string;

    /** Fetch risk data from supabase */
    const fetchRiskData = async () => {
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

            // Fetch classifications
            const { data: classificationData, error: classificationError } = await supabase
                .from("classification")
                .select("name");
            if (classificationError) throw classificationError;

            // Add "All" to classifications
            classifications = ["All", ...classificationData.map((classification) => classification.name)];
            riskData = classifications.reduce((acc, classification) => {
                acc[classification] = { low: 0, medium: 0, high: 0, very_high: 0 };
                return acc;
            }, {});

            // Fetch department-specific risk monitoring data
            const { data: riskMonitoringData, error: riskMonitoringError } = await supabase
                .from("risk_monitoring")
                .select(`
                    control_rating_id ( name ),
                    risks ( classification ( name ) )
                `)
                .eq('department_id', departmentId);

            if (riskMonitoringError) throw riskMonitoringError;

            // Populate riskData counts
            riskMonitoringData.forEach((item) => {
                const classification = item.risks?.classification?.name || "Unknown";
                const controlRating = item.control_rating_id?.name.toLowerCase().replace(' ', '_');
                if (riskData[classification] && controlRating) {
                    const ratingKey = controlRating === 'very_high' ? 'very_high' : controlRating;
                    if (riskData[classification][ratingKey] !== undefined) {
                        riskData[classification][ratingKey]++;
                        // Also update "All" category
                        riskData["All"][ratingKey]++;
                    }
                }
            });

            // Set default selected category and create chart
            if (classifications.length > 0) {
                selectedCategory = "All";
                setTimeout(() => {
                    createChart();
                }, 0);
            }
        } catch (error) {
            console.error("Error fetching risk data:", error);
        } finally {
            isLoading = false;
        }
    };

    /** Create or update the chart */
    const createChart = () => {
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        if (chart) {
            chart.destroy();
        }

        const data = riskData[selectedCategory] || { low: 0, medium: 0, high: 0, very_high: 0 };
        chart = new Chart(ctx, {
            type: "doughnut",
            data: {
                labels: ["Low Risk", "Medium Risk", "High Risk", "Very High Risk"],
                datasets: [
                    {
                        data: [data.low, data.medium, data.high, data.very_high],
                        backgroundColor: ["#34C759", "#FFCC00", "#FF9500", "#FF3B30"],
                        borderWidth: 2,
                        borderColor: "#ffffff",
                    },
                ],
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
                            usePointStyle: true,
                        },
                    },
                },
            },
        });
    };

    $inspect(`Selected category changed to: ${selectedCategory}`);

    $effect(() => {
        if (selectedCategory && !isLoading) {
            createChart();
        }
    });

    onMount(() => {
        fetchRiskData();
    });
</script>

<div class="w-full rounded-lg border bg-card border-border p-4 hover:shadow-lg transition-all duration-300">
    <h2 class="mb-6 text-xl font-semibold">Risks Analysis</h2>

    {#if isLoading}
    <div class="flex justify-center p-8 ">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
    {:else}
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <p class="font-medium text-md">Classification:</p>
            <div class="relative w-full sm:w-1/3 lg:w-1/4">
                <select bind:value={selectedCategory} class="appearance-none bg-secondary border-secondary rounded-lg px-4 py-2 pr-10 text-sm font-medium focus:outline-none transition-colors focus:ring-2 focus:ring-ring w-full md:w-[150px]">
                    {#each classifications as classification}
                        <option value={classification}>{classification}</option>
                    {/each}
                </select>
                <ChevronDown class="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>
        </div>

        <div class="h-[300px]">
            <canvas bind:this={canvas}></canvas>
        </div>
    {/if}
</div>