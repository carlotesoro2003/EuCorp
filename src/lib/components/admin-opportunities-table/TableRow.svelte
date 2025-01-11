<script lang="ts">
	import { Pencil, Trash2, ArchiveRestore } from "lucide-svelte";

	type Opportunity = {
		id: number;
		opt_statement: string;
		planned_actions: string;
		kpi: string;
		key_persons: string;
		target_output: string;
		budget: number;
		is_approved: boolean;
		is_approved_vp: boolean;
		is_approved_president: boolean;
		department_name: string | null;
		school_year: number;
	};

	let {
		opportunity,
		userRole,
		onEdit,
		onDelete,
		onApprove,
		onCarryOver,
		approvingId,
		deletingId,
		currentSchoolYearId,
	}: {
		opportunity: Opportunity;
		userRole: string | null;
		onEdit: (opportunity: Opportunity) => void;
		onDelete: (id: number) => void;
		onApprove: (id: number) => void;
		onCarryOver: (id: number) => void;
		approvingId: number | null;
		deletingId: number | null;
		currentSchoolYearId: number | null;
	} = $props();
</script>

<tr class="hover:bg-muted/50">
	<td class="px-4 py-3 align-top">{opportunity.opt_statement}</td>
	<td class="px-4 py-3 align-top">{opportunity.planned_actions}</td>
	<td class="px-4 py-3 align-top">{opportunity.kpi}</td>
	<td class="px-4 py-3 align-top">{opportunity.key_persons}</td>
	<td class="px-4 py-3 align-top">{opportunity.target_output}</td>
	<td class="px-4 py-3 align-top">P{opportunity.budget.toFixed(2)}</td>
	<td class="px-4 py-3 align-top">{opportunity.department_name}</td>
	<td class="px-4 py-3 align-top">
		<div class="flex items-center gap-2">
			<button onclick={() => onApprove(opportunity.id)} disabled={approvingId === opportunity.id || (userRole === "admin" && opportunity.is_approved) || (userRole === "vice_president" && (!opportunity.is_approved || opportunity.is_approved_vp)) || (userRole === "president" && (!opportunity.is_approved_vp || opportunity.is_approved_president))} class="px-2 py-1 text-sm rounded bg-green-500 text-white hover:bg-green-600 disabled:opacity-50">
				{approvingId === opportunity.id ? "Processing..." : userRole === "admin" ? (opportunity.is_approved ? "Admin Approved" : "Approve") : userRole === "vice_president" ? (opportunity.is_approved_vp ? "VP Approved" : "Approve") : userRole === "president" ? (opportunity.is_approved_president ? "President Approved" : "Approve") : "Approve"}
			</button>
			<button onclick={() => onEdit(opportunity)} class="hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground">
				<Pencil size={16} />
			</button>
			<button onclick={() => onDelete(opportunity.id)} disabled={deletingId === opportunity.id} class="p-1 rounded hover:bg-muted text-red-500 hover:text-red-600 disabled:opacity-50">
				<Trash2 size={16} />
			</button>
			{#if opportunity.school_year !== currentSchoolYearId}
				<button class="p-1 rounded hover:bg-muted text-blue-500 hover:text-blue-600" title="Carry Over" onclick={() => onCarryOver(opportunity.id)}>
					<ArchiveRestore size={16} />
				</button>
			{/if}
		</div>
	</td>
</tr>
