<script lang="ts">
	import { PencilIcon, Trash, Trash2, X } from "lucide-svelte";

	/** Props */
	let {
		item,
		type,
		onEdit,
		onDelete,
	}: {
		item: any;
		type: string;
		onEdit: (item: any) => void;
		onDelete: (id: number) => void;
	} = $props();
</script>

<tr class="hover:bg-muted/50">
	{#if type === "likelihoodRating" || type === "riskControlRating"}
		<td class="px-6 py-4">{item.name}</td>
		<td class="px-6 py-4">{item.symbol}</td>
	{:else if type === "severity"}
		<td class="px-6 py-4">{item.name}</td>
		<td class="px-6 py-4">{item.value}</td>
	{:else}
		<td class="px-6 py-4">{item.status}</td>
	{/if}
	<td class="px-6 py-4">
		<div class="flex gap-2">
			<button onclick={() => onEdit(item)} class="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground">
				<PencilIcon size={16} />
			</button>
			<button onclick={() => onDelete(item.id)} class="p-2 hover:bg-red-100 text-red-500 hover:text-red-600 rounded-lg disabled:opacity-50">
				<Trash2 size={16} />
			</button>
		</div>
	</td>
</tr>
