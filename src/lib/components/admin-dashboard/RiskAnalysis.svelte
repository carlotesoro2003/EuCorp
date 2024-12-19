<script lang="ts">
    import { onMount } from "svelte";
    import Chart from "chart.js/auto";
    import { supabase } from "$lib/supabaseClient";
    import { ArrowLeft } from "lucide-svelte";

    interface RiskData {
        low: number;
        medium: number;
        high: number;
        very_high: number;
    }

    let classifications: string[] = [];
    let isDrilledDown = false;
    let selectedClassification = "";
    let riskData: Record<string, RiskData> = {};
    let isLoading = true;
    let canvas: HTMLCanvasElement;
    let chart: Chart | null = null;

    async function fetchRiskData() {
        try {
            const { data: classificationData, error: classificationError } = await supabase
                .from("classification")
                .select("name");
            if (classificationError) throw classificationError;

            classifications = classificationData.map(c => c.name);
            riskData = classifications.reduce((acc, classification) => {
                acc[classification] = { low: 0, medium: 0, high: 0, very_high: 0 };
                return acc;
            }, {});

            const { data: riskMonitoringData, error: riskMonitoringError } = await supabase
                .from("risk_monitoring")
                .select(`
                    control_rating_id,
                    risks (
                        id,
                        classification ( name )
                    )
                `);
            if (riskMonitoringError) throw riskMonitoringError;

            riskMonitoringData.forEach((risk) => {
                const classification = risk.risks?.classification?.name;
                if (!classification) return;

                const ratingMap = {
                    1: 'low',
                    2: 'medium',
                    3: 'high',
                    4: 'very_high'
                };

                const rating = ratingMap[risk.control_rating_id];
                if (rating && riskData[classification]) {
                    riskData[classification][rating]++;
                }
            });

            setTimeout(() => createChart(), 0);
        } catch (error) {
            console.error("Error fetching risk data:", error);
        } finally {
            isLoading = false;
        }
    }

   function createChart() {
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;

    if (chart) chart.destroy();

    const labels = isDrilledDown 
        ? ["Low Risk", "Medium Risk", "High Risk", "Very High Risk"]
        : classifications;

    const data = isDrilledDown
        ? [
            riskData[selectedClassification].low,
            riskData[selectedClassification].medium,
            riskData[selectedClassification].high,
            riskData[selectedClassification].very_high
        ]
        : classifications.map(c => 
            Object.values(riskData[c]).reduce((sum, val) => sum + val, 0)
        );

    chart = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels,
            datasets: [{
                data,
                backgroundColor: isDrilledDown
                    ? ["#22c55e", "#eab308", "#f97316", "#ef4444"]
                    : generateClassificationColors(classifications.length),
                borderWidth: 2,
                borderColor: "#ffffff",
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
                    const index = elements[0].index;
                    selectedClassification = classifications[index];
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
                    text: isDrilledDown ? selectedClassification : '',
                    font: { size: 16, weight: 'bold' }
                }
            }
        }
    });
}

function generateClassificationColors(count: number): string[] {
    return Array(count).fill(null).map((_, i) => 
        `hsl(${(i * 360) / count}, 70%, 60%)`
    );
}

    onMount(() => {
        fetchRiskData();
    });
</script>

<div class="relative bg-card p-6 rounded-lg border border-border">
    <h2 class="mb-6 text-xl font-semibold">Risks Analysis</h2>

    {#if isDrilledDown}
        <button 
            class="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 text-sm font-medium bg-secondary hover:bg-secondary/80 rounded-lg transition-colors"
            on:click={() => {
                isDrilledDown = false;
                selectedClassification = "";
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