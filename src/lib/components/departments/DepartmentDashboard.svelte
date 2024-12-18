<script lang="ts">
	import DashboardCards from "$lib/components/dept-dashboard/DashboardCards.svelte";
	import BarChart from "$lib/components/dept-dashboard/BarChart.svelte";
	import RiskAnalysis from "$lib/components/dept-dashboard/RiskAnalysis.svelte";
	import RecentEvents from "$lib/components/admin-dashboard/RecentEvents.svelte";
	import Header from "$lib/components/dept-dashboard/Header.svelte";
	import OpportunitiesStatus from "../dept-dashboard/OpportunitiesStatus.svelte";
	import { dashboardData } from "$lib/components/dept-dashboard/data";
</script>



<main class=" min-h-screen  p-4 md:p-6 container mx-auto ">
	<div class="mx-auto max-w-7xl space-y-8">
		<Header />

		<!-- Dashboard Cards -->
		<DashboardCards data={dashboardData.cards} />

		<!-- Bar Graph Section -->
		<div class="rounded-lg border border-border p-4 hover:shadow-lg transition-all duration-300 ">
			<h2 class="mb-6 text-xl font-semibold">Strategic Goal Status</h2>
			<BarChart data={dashboardData.barChart} />
		</div>

		<!-- Risk Analysis and Recent Events Grid -->
		<div class="grid gap-8 lg:grid-cols-2">
			<RiskAnalysis data={dashboardData.riskData} />
			<OpportunitiesStatus />
		</div>
	</div>
</main>
