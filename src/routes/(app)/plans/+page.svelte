<script lang="ts">
	import { Search, ArrowUpDown, Plus, Edit, Trash2, Eye, Pencil, Target, Check, ArchiveRestore, Goal } from "lucide-svelte";
	import { supabase } from "$lib/supabaseClient";
	import { onMount } from "svelte";
	import { goto } from "$app/navigation";
	import StrategicGoalForm from "$lib/components/StrategicGoal/StrategicGoalForm.svelte";
	import { fade } from "svelte/transition";

	/** Types */
	type StrategicGoal = {
		id: number;
		goal_no: number;
		name: string;
		description: string;
		kpi: string;
		lead_id: number | null;
		school_year: number | null;
		notApproved?: number; 
		notApprovedVP?: number; 
		notApprovedPresident?: number; 
		hasActionPlans?: boolean; 
	};

	type Lead = {
		id: number;
		name: string;
	};

	type SchoolYear = {
		id: number;
		school_year: string;
		start_date: string;
		end_date: string;
	};

	type SortField = "goal_no" | "name" | "description" | "kpi";
	type SortDirection = "asc" | "desc";

	/** State Variables */
	let searchQuery: string = $state("");
	let currentPage: number = $state(1);
	let itemsPerPage: number = $state(5);
	let showForm: boolean = $state(false);
	let sortField: SortField = $state("goal_no");
	let sortDirection: SortDirection = $state("asc");
	let leadFilter: number | "all" = $state("all");
	let schoolYearFilter: number | "all" = $state("all");
	let loading: boolean = $state(true);
	let editingGoal: StrategicGoal | null = $state(null);
	let showAlert: boolean = $state(false);
	let alertMessage: string = $state("");
	let alertType: "success" | "error" = $state("success");
	let isSaving: boolean = $state(false);

	/** Data Variables */
	let strategicGoals: StrategicGoal[] = $state([]);
	let leads: Lead[] = $state([]);
	let schoolYears: SchoolYear[] = $state([]);
	let currentSchoolYearId: number | null = $state(null);
	let userRole: string | null = $state(null);

	/** Initialize Data on Mount */
	onMount(() => {
		init();
	});

	const init = async () => {
		await fetchUserRole();
		await fetchCurrentSchoolYear();
		await fetchLeads();
		await fetchSchoolYears();
		await fetchStrategicGoals();
		await fetchStrategicGoalsWithNotApprovedCounts();			
		loading = false;
	};

	/**Fetch User Role**/
	const fetchUserRole = async () => {
		try {
			// Get the current user session
			const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
			if (sessionError || !sessionData.session) throw new Error("User session not found.");

			const userId = sessionData.session.user.id;

			// Fetch the user's role from the `profiles` table
			const { data: profileData, error: profileError } = await supabase
				.from("profiles")
				.select("role")
				.eq("id", userId)
				.single();

			if (profileError || !profileData) throw new Error("Failed to fetch user role.");

			// Set the user role
			userRole = profileData.role;
		} catch (error) {
			console.error("Error fetching user role:", error);
		}
	};

	/** Fetch Current School Year */
	const fetchCurrentSchoolYear = async () => {
		const today = new Date().toISOString().split("T")[0];
		const { data, error } = await supabase.from("school_years").select("id").lte("start_date", today).gte("end_date", today).maybeSingle();

		if (error) {
			console.error("Error fetching current school year:", error);
			currentSchoolYearId = null;
		} else {
			currentSchoolYearId = data?.id || null;
			schoolYearFilter = currentSchoolYearId || "all";
		}
	};

	/** Fetch School Years */
	const fetchSchoolYears = async () => {
		const { data, error } = await supabase.from("school_years").select("*").order("start_date", { ascending: false });

		if (error) {
			displayAlert("Error fetching school years", "error");
		} else {
			schoolYears = data as SchoolYear[];
		}
	};

	/** Fetch Leads */
	const fetchLeads = async () => {
		const { data, error } = await supabase.from("leads").select("id, name");
		if (error) {
			displayAlert("Error fetching leads", "error");
		} else {
			leads = data as Lead[];
		}
	};

	/** Fetch Strategic Goals */
	const fetchStrategicGoals = async () => {
		const { data, error } = await supabase
			.from("strategic_goals")
			.select("*")
			.order("goal_no", { ascending: sortDirection === "asc" });

		if (error) {
			displayAlert("Error fetching strategic goals", "error");
		} else {
			strategicGoals = data as StrategicGoal[];
		}
	};

	/** Fetch Strategic Goals with Approval Counts */
	const fetchStrategicGoalsWithNotApprovedCounts = async () => {
		try {
			const { data: result, error } = await supabase
				.from("strategic_goals")
				.select(`
					id,
					goal_no,
					name,
					description,
					kpi,
					lead_id,
					school_year,
					strategic_objectives (
						action_plans (
							is_approved,
							is_approved_vp,
							is_approved_president
						)
					)
				`)
				.order("goal_no", { ascending: true });

			if (error) {
				console.error("Error fetching strategic goals:", error);
				return;
			}

			// Process goals and calculate counts
			strategicGoals = result.map((goal) => {
				const objectives = goal.strategic_objectives || [];
				const actionPlans = objectives.flatMap((objective) => objective.action_plans || []);

				const notApproved = actionPlans.filter((plan) => plan.is_approved === false).length;
				const notApprovedVP = actionPlans.filter((plan) => plan.is_approved_vp === false).length;
				const notApprovedPresident = actionPlans.filter((plan) => plan.is_approved_president === false).length;

				return {
					...goal,
					notApproved,
					notApprovedVP,
					notApprovedPresident,
					hasActionPlans: actionPlans.length > 0,
				};
			});
		} catch (error) {
			console.error("Error processing action plans data:", error);
		}
	};



	/** Calculate Next Goal Number */
	const getNextGoalNumber = (): number => {
		return strategicGoals.length > 0 ? Math.max(...strategicGoals.map((goal) => goal.goal_no)) + 1 : 1;
	};

	/** Display Alert */
	const displayAlert = (message: string, type: "success" | "error") => {
		alertMessage = message;
		alertType = type;
		showAlert = true;
		setTimeout(() => {
			showAlert = false;
		}, 3000);
	};

	/** Get Lead Name by ID */
	const getLeadNameById = (leadId: number | null): string => {
		const lead = leads.find((l) => l.id === leadId);
		return lead ? lead.name : "No Lead Assigned";
	};

	/** Get School Year by ID */
	const getSchoolYearById = (yearId: number | null): string => {
		const year = schoolYears.find((y) => y.id === yearId);
		return year ? year.school_year : "No School Year";
	};

	/** Handle Save */
	const handleSave = async (formData: Partial<StrategicGoal>) => {
		isSaving = true;
		if (!currentSchoolYearId) {
			displayAlert("No current school year found. Cannot save goal.", "error");
			return;
		}

		const goalData = {
			...formData,
			school_year: currentSchoolYearId,
		};

		if (editingGoal) {
			const { error } = await supabase.from("strategic_goals").update(goalData).match({ id: editingGoal.id });
			if (error) {
				displayAlert("Error updating goal", "error");
			} else {
				displayAlert("Goal updated successfully", "success");
				await fetchStrategicGoals();
				closeForm();
			}
		} else {
			const newGoal = {
				...goalData,
				goal_no: getNextGoalNumber(),
			};
			const { error } = await supabase.from("strategic_goals").insert([newGoal]);
			if (error) {
				displayAlert("Error creating goal", "error");
			} else {
				displayAlert("Goal created successfully", "success");
				await fetchStrategicGoals();
				closeForm();
			}
		}
		isSaving = false;
	};

	/** Delete Goal */
	const deleteGoal = async (id: number) => {
		if (confirm("Are you sure you want to delete this goal?")) {
			loading = true;
			const { error } = await supabase.from("strategic_goals").delete().match({ id });

			if (error) {
				displayAlert("Error deleting goal", "error");
				loading = false;
				return;
			}

			const { data: remainingGoals, error: fetchError } = await supabase.from("strategic_goals").select("*").order("goal_no", { ascending: true });

			if (fetchError) {
				displayAlert("Error reordering goals", "error");
				loading = false;
				return;
			}

			for (let i = 0; i < remainingGoals.length; i++) {
				await supabase
					.from("strategic_goals")
					.update({ goal_no: i + 1 })
					.match({ id: remainingGoals[i].id });
			}

			displayAlert("Goal deleted and reordered successfully", "success");
			await fetchStrategicGoals();
			loading = false;
		}
	};

	/** Close Form */
	const closeForm = () => {
		showForm = false;
		editingGoal = null;
	};

	/** Toggle Sort */
	const toggleSort = (field: SortField) => {
		if (sortField === field) {
			sortDirection = sortDirection === "asc" ? "desc" : "asc";
		} else {
			sortField = field;
			sortDirection = "asc";
		}

		// Reapply sorting logic
		strategicGoals.sort((a, b) => {
			const aValue = a[field];
			const bValue = b[field];

			// Handle numeric sorting for goal_no
			if (field === "goal_no") {
				return sortDirection === "asc"
					? Number(aValue) - Number(bValue)
					: Number(bValue) - Number(aValue);
			}

			// Default string sorting for other fields
			return sortDirection === "asc"
				? String(aValue).localeCompare(String(bValue))
				: String(bValue).localeCompare(String(aValue));
		});
	};



	/** Derived Values */
	const filteredItems = $derived(
		strategicGoals
			.filter((goal) => {
				const searchFields = `${goal.name} ${goal.description} ${goal.kpi}`.toLowerCase();
				const matchesSearch = searchFields.includes(searchQuery.toLowerCase());
				const matchesLead = leadFilter === "all" || goal.lead_id === leadFilter;
				const matchesSchoolYear =
					schoolYearFilter === "all" || goal.school_year === schoolYearFilter;
				return matchesSearch && matchesLead && matchesSchoolYear;
			})
			.sort((a, b) => {
				const aValue = a[sortField];
				const bValue = b[sortField];

				// Handle numeric sorting for goal_no
				if (sortField === "goal_no") {
					return sortDirection === "asc"
						? Number(aValue) - Number(bValue)
						: Number(bValue) - Number(aValue);
				}

				// Default string sorting for other fields
				return sortDirection === "asc"
					? String(aValue).localeCompare(String(bValue))
					: String(bValue).localeCompare(String(aValue));
			})
	);


	/** Derived paginated items */
	const paginatedItems = $derived(
		filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
	);

	const totalPages = $derived(Math.ceil(filteredItems.length / itemsPerPage));

	const carryOverGoal = async(goal: StrategicGoal) => {
		try{
			const {data, error} = await supabase
			.from("strategic_goals")
			.update({school_year: currentSchoolYearId})
			.eq("id", goal.id);

			if(error) throw error;

			strategicGoals = strategicGoals.map((g) => 
				g.id === goal.id ? { ...g, school_year: currentSchoolYearId } : g
			);

			displayAlert('Goal carried over successfully', 'success');
		}
		catch(error){
			console.error('Error carrying over goal:', error);
			displayAlert('Error carrying over goal', 'error');
		}
	}
</script>

<div class="flex flex-col gap-4 p-4 container mx-auto">
	{#if showAlert}
		<div transition:fade class="flex items-center p-4 rounded-lg {alertType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
			<span>{alertMessage}</span>
		</div>
	{/if}

	<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
		<div class="flex items-center gap-2">
			<Target class="w-8 h-8 text-primary" />
			<h1 class="text-2xl font-bold">Strategic Goals</h1>
		</div>
	</div>

	<div class="flex flex-col md:flex-row gap-4 mb-2 items-center justify-between">
		<div class="flex flex-col md:flex-row gap-4 flex-1">
			<div class="relative flex-1 w-full md:max-w-[300px]">
				<Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
				<input type="text" bind:value={searchQuery} placeholder="Search goals..." class="pl-10 pr-4 py-2 bg-secondary rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-ring" />
			</div>
			<select bind:value={leadFilter} class="bg-secondary rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring w-full md:w-[200px]">
				<option value="all">All Leads</option>
				{#each leads as lead}
					<option value={lead.id}>{lead.name}</option>
				{/each}
			</select>
			<select bind:value={schoolYearFilter} class="bg-secondary rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring w-full md:w-[200px]">
				<option value="all">All School Years</option>
				{#each schoolYears as year}
					<option value={year.id}>{year.school_year}</option>
				{/each}
			</select>
		</div>
		<button onclick={() => (showForm = true)} class="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
			<Plus size={20} />
			Add Goal
		</button>
	</div>

	{#if loading}
		<div class="flex justify-center p-8">
			<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
		</div>
	{:else}
		<div class="overflow-x-auto bg-card rounded-lg shadow border border-border">
			<table class="min-w-full table-auto">
				<thead class="bg-muted/50">
					<tr>
						<th class="px-4 py-3 text-left">
							<button onclick={() => toggleSort("goal_no")} class="flex items-center gap-1">
								Goal No
								<ArrowUpDown size={16} class={sortField === "goal_no" ? "text-primary" : ""} />
							</button>
						</th>
						<th class="px-4 py-3 text-left">
							<button onclick={() => toggleSort("name")} class="flex items-center gap-1">
								Name
								<ArrowUpDown size={16} class={sortField === "name" ? "text-primary" : ""} />
							</button>
						</th>
						<th class="px-4 py-3 text-left hidden md:table-cell">Description</th>
						<th class="px-4 py-3 text-left hidden lg:table-cell">KPI</th>
						<th class="px-4 py-3 text-left">Lead</th>
						<th class="px-4 py-3 text-left">School Year</th>
						<th class="px-4 py-3 text-left">Objectives</th>
						<th class="px-4 py-3 text-center">Plan Status</th>
						<th class="px-4 py-3 text-center">Actions</th>
						
					</tr>
				</thead>
				<tbody class="divide-y divide-border">
					{#each paginatedItems as goal (goal.id)}
						<tr class="hover:bg-muted/50">
							<td class="px-4 py-3 align-top">{goal.goal_no}</td>
							<td class="px-4 py-3 align-top">{goal.name}</td>
							<td class="px-4 py-3 hidden md:table-cell align-top">{goal.description}</td>
							<td class="px-4 py-3 hidden lg:table-cell align-top">{goal.kpi}</td>
							<td class="px-4 py-3 align-top">{getLeadNameById(goal.lead_id)}</td>
							<td class="px-4 py-3 align-top">{getSchoolYearById(goal.school_year)}</td>
							<td class="px-4 py-3 align-top">
								<button
									onclick={() => goto(`/plans/${goal.id}`)}
									class="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-sm text-primary bg-primary/10 hover:bg-primary/20 rounded-md"
									title="View objectives"
								>
									<Eye size={16} /> View
								</button>
							</td>
							<td class="px-4 py-3 text-center align-top">
								{#if !goal.hasActionPlans}
									<span
										class="inline-flex items-center gap-1 px-2.5 py-1 text-sm font-medium bg-gray-100 text-gray-700 rounded-lg"
										title="No Action Plans"
									>
										N/A
									</span>
								{:else if userRole === "admin" && (goal.notApproved ?? 0) > 0}
									<span
										class="inline-flex items-center gap-1 px-2.5 py-1 text-sm font-medium bg-red-100 text-red-700 rounded-lg"
										title="{goal.notApproved} Action Plans Not Approved by Admin"
									>
										<Target size={16} />
										{goal.notApproved}
									</span>
								{:else if userRole === "vice_president" && (goal.notApprovedVP ?? 0) > 0}
									<span
										class="inline-flex items-center gap-1 px-2.5 py-1 text-sm font-medium bg-orange-100 text-orange-700 rounded-lg"
										title="{goal.notApprovedVP} Action Plans Not Approved by Vice President"
									>
										<Target size={16} />
										{goal.notApprovedVP}
									</span>
								{:else if userRole === "president" && (goal.notApprovedPresident ?? 0) > 0}
									<span
										class="inline-flex items-center gap-1 px-2.5 py-1 text-sm font-medium bg-yellow-100 text-yellow-700 rounded-lg"
										title="{goal.notApprovedPresident} Action Plans Not Approved by President"
									>
										<Target size={16} />
										{goal.notApprovedPresident}
									</span>
								{:else}
									<span
										class="inline-flex items-center gap-1 px-2.5 py-1 text-sm font-medium bg-green-100 text-green-700 rounded-lg"
										title="All Action Plans Approved"
									>
										<Check size={16} />
									</span>
								{/if}
							</td>
							
						
							<td class="px-4 py-3 align-top">
								<div class="flex justify-center gap-2 items-center">
									<!-- Action Buttons -->
									<button
										onclick={() => {
											editingGoal = goal;
											showForm = true;
										}}
										class="hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground"
										title="Edit goal"
									>
										<Pencil size={18} />
									</button>
									<button
										onclick={() => deleteGoal(goal.id)}
										class="p-1.5 hover:bg-red-100 rounded-md transition-colors text-red-600"
										title="Delete goal"
									>
										<Trash2 size={18} />
									</button>
									{#if currentSchoolYearId && goal.school_year !== currentSchoolYearId}
										<button
											class="p-1.5 hover:bg-primary/10 rounded-md transition-colors text-primary"
											title="Carry over"
											onclick = {() => carryOverGoal(goal)}
										>
											<ArchiveRestore size={18} />
										</button>
									{/if}
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
				
			</table>
		</div>
		<!-- Add this right after the table, before the pagination controls -->
<div class="mt-4 p-4 bg-card rounded-lg shadow border border-border">
    <h3 class="text-sm font-semibold mb-2">Plan Status Legends:</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="flex items-center gap-2">
            <span class="inline-flex items-center gap-1 px-2.5 py-1 text-sm font-medium bg-gray-100 text-gray-700 rounded-lg">
                N/A
            </span>
            <span class="text-sm text-muted-foreground">No Action Plans</span>
        </div>
        
        <div class="flex items-center gap-2">
            <span class="inline-flex items-center gap-1 px-2.5 py-1 text-sm font-medium bg-green-100 text-green-700 rounded-lg">
                <Check size={16} />
            </span>
            <span class="text-sm text-muted-foreground">All Plans Approved</span>
        </div>

        {#if userRole === "admin"}
            <div class="flex items-center gap-2">
                <span class="inline-flex items-center gap-1 px-2.5 py-1 text-sm font-medium bg-red-100 text-red-700 rounded-lg">
                    <Target size={16} /> 1
                </span>
                <span class="text-sm text-muted-foreground">Plans Pending Admin Approval</span>
            </div>
        {/if}

        {#if userRole === "vice_president"}
            <div class="flex items-center gap-2">
                <span class="inline-flex items-center gap-1 px-2.5 py-1 text-sm font-medium bg-orange-100 text-orange-700 rounded-lg">
                    <Target size={16} /> 1
                </span>
                <span class="text-sm text-muted-foreground">Plans Pending VP Approval</span>
            </div>
        {/if}

        {#if userRole === "president"}
            <div class="flex items-center gap-2">
                <span class="inline-flex items-center gap-1 px-2.5 py-1 text-sm font-medium bg-yellow-100 text-yellow-700 rounded-lg">
                    <Target size={16} /> 1
                </span>
                <span class="text-sm text-muted-foreground">Plans Pending President Approval</span>
            </div>
        {/if}
    </div>
</div>

		<div class="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
			<div class="text-sm text-muted-foreground">
				Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredItems.length)} of {filteredItems.length} results
			</div>
			<div class="flex flex-col sm:flex-row items-center gap-4">
				<select bind:value={itemsPerPage} class="bg-secondary rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-ring">
					<option value={5}>5 per page</option>
					<option value={10}>10 per page</option>
					<option value={25}>25 per page</option>
				</select>
				<div class="flex gap-2">
					<button disabled={currentPage === 1} onclick={() => currentPage--} class="px-3 py-1 rounded-lg border border-border hover:bg-muted disabled:opacity-50 transition-colors">Previous</button>
					<button disabled={currentPage === totalPages} onclick={() => currentPage++} class="px-3 py-1 rounded-lg border border-border hover:bg-muted disabled:opacity-50 transition-colors">Next</button>
				</div>
			</div>
		</div>
	{/if}

	{#if showForm}
		<StrategicGoalForm goal={editingGoal} {leads} {isSaving} onSave={handleSave} onClose={closeForm} />
	{/if}
</div>
