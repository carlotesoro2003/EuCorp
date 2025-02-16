<script lang="ts">
	import { X } from "lucide-svelte";
	import { supabase } from "$lib/supabaseClient";
	import { calculateRiskControlRating } from "$lib/components/dept-risks-table/risk-assessment-table/riskCalculator";
	import type { RiskAssessment, LikelihoodRating, Severity, RiskControlRating, RiskMonitoringRating } from "$lib/types/RiskTypes";

	// Props
	let {
		selectedRisk,
		likelihoodRating,
		severity,
		riskControlRating,
		riskMonitoringRating,
		onClose,
		onSuccess,
		onError,
	}: {
		selectedRisk: RiskAssessment | null;
		likelihoodRating: LikelihoodRating[];
		severity: Severity[];
		riskControlRating: RiskControlRating[];
		riskMonitoringRating: RiskMonitoringRating[];
		onClose: () => void;
		onSuccess: (message: string) => void;
		onError: (message: string) => void;
	} = $props();

	// Form state initialized with the current assessment data
	let assessment = $state({
		likelihoodRating: selectedRisk?.likelihoodRating || null,
		severity: selectedRisk?.severity || null,
		riskControlRating: selectedRisk?.riskControlRating || null,
		riskMonitoringRating: selectedRisk?.riskMonitoringRating || null,
	});

	// Derived state for form validation
	const isFormValid = $derived(
		assessment.likelihoodRating !== null &&
			assessment.severity !== null &&
			assessment.riskControlRating !== null &&
			assessment.riskMonitoringRating !== null
	);

	// Calculate risk control rating when likelihood or severity changes
	$effect(() => {
		if (assessment.likelihoodRating && assessment.severity) {
			const likelihood = likelihoodRating.find((r) => r.id === assessment.likelihoodRating)?.symbol;
			const severityValue = severity.find((s) => s.id === assessment.severity)?.value;

			if (likelihood && severityValue) {
				const ratingSymbol = calculateRiskControlRating(likelihood, severityValue);
				const matchingRating = riskControlRating.find((r) => r.symbol === ratingSymbol);
				assessment.riskControlRating = matchingRating?.id || null;
			}
		}
	});

	const handleUpdate = async () => {
		try {
			const { error } = await supabase
				.from("risk_assessment")
				.update({
					likelihoodRating: assessment.likelihoodRating,
					severity: assessment.severity,
					riskControlRating: assessment.riskControlRating,
					riskMonitoringRating: assessment.riskMonitoringRating,
				})
				.eq("risk_id", selectedRisk?.risk_id);

			if (error) throw error;

			onSuccess("Assessment updated successfully");
			onClose();
		} catch (error) {
			onError("Failed to update assessment");
		}
	};
</script>

<div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
	<div class="bg-white dark:bg-gray-800 rounded-xl max-w-xl w-full shadow-xl">
		<div class="flex items-center justify-between p-6 border-b dark:border-gray-700">
			<div>
				<h2 class="text-xl font-semibold text-gray-900 dark:text-white">Edit Risk Assessment</h2>
				<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">RRN: {selectedRisk?.risk_id}</p>
			</div>
			<button onclick={onClose} class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors">
				<X class="h-5 w-5" />
			</button>
		</div>

		<div class="p-6 space-y-6">
			<div class="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
				<h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Risk Statement</h3>
				<p class="mt-1 text-sm text-gray-900 dark:text-gray-100">{selectedRisk?.risk_statement}</p>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				<!-- Likelihood Rating -->
				<div class="space-y-2">
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Likelihood Rating</label>
					<select bind:value={assessment.likelihoodRating} class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 dark:text-white">
						<option value={null}>Select likelihood</option>
						{#each likelihoodRating as rating}
							<option value={rating.id} selected={rating.id === assessment.likelihoodRating}>
								{rating.symbol} - {rating.name}
							</option>
						{/each}
					</select>
				</div>

				<!-- Severity -->
				<div class="space-y-2">
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Severity</label>
					<select bind:value={assessment.severity} class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 dark:text-white">
						<option value={null}>Select severity</option>
						{#each severity as sev}
							<option value={sev.id} selected={sev.id === assessment.severity}>
								{sev.value} - {sev.name}
							</option>
						{/each}
					</select>
				</div>
			</div>

			<!-- Risk Control Rating -->
			<div class="space-y-2">
				<label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Risk Control Rating</label>
				<div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
					{#if assessment.riskControlRating}
						{@const rating = riskControlRating.find((r) => r.id === assessment.riskControlRating)}
						<div class="flex items-center gap-2">
							<span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-semibold">
								{rating?.symbol}
							</span>
							<span class="text-gray-900 dark:text-gray-100">{rating?.name}</span>
						</div>
					{:else}
						<p class="text-gray-500 dark:text-gray-400">Select likelihood and severity first</p>
					{/if}
				</div>
			</div>

			<!-- Monitoring Rating -->
			<div class="space-y-2">
				<label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Monitoring Rating</label>
				<select bind:value={assessment.riskMonitoringRating} class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 dark:text-white">
					<option value={null}>Select monitoring rating</option>
					{#each riskMonitoringRating as rating}
						<option value={rating.id} selected={rating.id === assessment.riskMonitoringRating}>
							{rating.status}
						</option>
					{/each}
				</select>
			</div>
		</div>

		<div class="flex items-center justify-end gap-3 p-6 border-t dark:border-gray-700">
			<button onclick={onClose} class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">Cancel</button>
			<button onclick={handleUpdate} disabled={!isFormValid} class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Save Changes</button>
		</div>
	</div>
</div>
