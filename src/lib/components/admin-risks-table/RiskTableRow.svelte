<script lang="ts">
	import { Trash2, ArchiveRestore } from "lucide-svelte";

	let { risk, userRole, classification, likelihoodRatings, severities, riskControlRatings, riskMonitoringRatings, riskAssessments, onDelete, onApprove, onCarryOver,approvingId, deletingId, currentSchoolYearId } = $props();
</script>

<tr class="hover:bg-muted/50">
	<td class="px-4 py-3 align-top">{risk.rrn}</td>
	<td class="px-4 py-3 align-top">{risk.risk_statement}</td>
	<td class="px-4 py-3 align-top">
		{classification.find((cls: { id: number; name: string }) => cls.id === risk.classification)?.name || "N/A"}
	</td>
	<td class="px-4 py-3 align-top">{risk.actions}</td>
	<td class="px-4 py-3 align-top">{risk.key_persons}</td>
	<td class="px-4 py-3 align-top">P{risk.budget.toFixed(2)}</td>
	<td class="px-4 py-3 align-top">
		{#each riskAssessments.filter((a: { risk_id: number }) => a.risk_id === risk.id) as assessment}
			<div class="space-y-1">
				<div>
					<span class="font-medium">Likelihood:</span>
					{likelihoodRatings.find((lr: { id: number; name: string }) => lr.id === assessment.lr)?.name || "N/A"}
				</div>
				<div>
					<span class="font-medium">Severity:</span>
					{severities.find((s: { id: number; value: string }) => s.id === assessment.s)?.value || "N/A"}
				</div>
				<div>
					<span class="font-medium">Control Rating:</span>
					{riskControlRatings.find((rcr: { id: number; name: string }) => rcr.id === assessment.rcr)?.name || "N/A"}
				</div>
				<div>
					<span class="font-medium">Monitoring Rating:</span>
					{riskMonitoringRatings.find((rmr: { id: number; status: string }) => rmr.id === assessment.rmr)?.status || "N/A"}
				</div>
			</div>
		{/each}
	</td>
	<td class="px-4 py-3 align-top">
		<div class="flex items-center gap-2">
			<button onclick={() => onApprove(risk.id)} disabled={approvingId === risk.id || (userRole === "admin" && risk.is_approved) || (userRole === "vice_president" && (!risk.is_approved || risk.is_approved_vp)) || (userRole === "president" && (!risk.is_approved_vp || risk.is_approved_president))} class="px-2 py-1 rounded bg-green-500 text-white hover:bg-green-600 disabled:opacity-50 text-sm">
				{approvingId === risk.id ? "Processing..." : userRole === "admin" ? (risk.is_approved ? "Admin Approved" : "Approve") : userRole === "vice_president" ? (risk.is_approved_vp ? "VP Approved" : "Approve") : userRole === "president" ? (risk.is_approved_president ? "President Approved" : "Approve") : "Approve"}
			</button>
			<button onclick={() => onDelete(risk.id)} disabled={deletingId === risk.id} class="p-1 rounded hover:bg-muted text-red-500 hover:text-red-600 disabled:opacity-50">
				<Trash2 size={16} />
			</button>

			{#if risk.school_year !== currentSchoolYearId}
				<button class="p-1 rounded hover:bg-muted text-blue-500 hover:text-blue-600"
					title="Carry Over"
					onclick={() => onCarryOver(risk.id)}
				>
					<ArchiveRestore size={16} />
				</button>
			{/if}
		
		</div>
	</td>
</tr>
