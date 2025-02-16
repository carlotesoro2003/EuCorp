<script lang="ts">
	import { supabase } from "$lib/supabaseClient";
	import { ArrowUpDown, Download, Notebook, Plus, Search, Check, Target } from "lucide-svelte";
	import ObjectivesTable from "$lib/components/operational-plans/ObjectivesTable.svelte";
	import GoalsSelector from "$lib/components/operational-plans/GoalSelector.svelte";

	/** Types definitions */
	type StrategicGoal = {
		id: number;
		name: string;
		goal_no: number;
	};

	type StrategicObjective = {
		id: number;
		name: string;
		strategic_initiatives: string;
		kpi: string;
		persons_involved: string;
		target: string;
		eval_measures: string;
	};

	type SortField = "name" | "kpi" | "target";
	type SortDirection = "asc" | "desc";

	// State variables
	let searchQuery: string = $state("");
	let currentPage: number = $state(1);
	let itemsPerPage: number = $state(5);
	let sortField: SortField = $state("name");
	let sortDirection: SortDirection = $state("asc");
	let loading: boolean = $state(true);
	let selectedGoalId: number | null = $state(null);

	// Data state
	let goals: StrategicGoal[] = $state([]);
	let objectives: StrategicObjective[] = $state([]);
	let userDepartmentId: string = $state("");

	/** Initialize data */
	const init = async () => {
		await fetchUserDepartment();
		await fetchGoals();
		if (goals.length > 0) {
			// Automatically set the first strategic goal as the selected goal
			selectedGoalId = goals[0].id;
			await fetchObjectives(); // Load objectives for the first goal
		}
		loading = false;
	};

		/** Fetch user's department */
	const fetchUserDepartment = async () => {
		try {
			const {
				data: { session },
			} = await supabase.auth.getSession();
			if (!session || !session.user) return;

			const { data: profileData, error } = await supabase
				.from("profiles")
				.select("department_id")
				.eq("id", session.user.id)
				.single();

			if (error) {
				console.error("Error fetching user department:", error);
				return;
			}

			userDepartmentId = profileData?.department_id || null;
		} catch (error) {
			console.error("Error fetching user department:", error);
		}
	};

	/** Fetch goals from database */
	const fetchGoals = async () => {
		const { data, error } = await supabase
			.from("strategic_goals")
			.select("id, name, goal_no");

		if (error) {
			console.error("Error fetching strategic goals:", error);
		} else {
			goals = data || [];
		}
	};

	/** Fetch objectives for selected goal */
	const fetchObjectives = async () => {
		if (!selectedGoalId || !userDepartmentId) return;

		loading = true;
		try {
			const { data, error } = await supabase
				.from("strategic_objectives")
				.select(`
					id,
					name,
					strategic_initiatives,
					kpi,
					persons_involved,
					target,
					eval_measures,
					action_plans (
						id,
						department_id
					)
				`)
				.eq("strategic_goal_id", selectedGoalId);

			if (error) {
				console.error("Error fetching strategic objectives:", error);
			} else {
				// Map objectives and count action plans for the user's department
				objectives = (data || []).map((objective) => {
					const actionPlans = objective.action_plans || [];
					const departmentPlanCount = actionPlans.filter(
						(plan) => plan.department_id === userDepartmentId
					).length;

					return {
						...objective,
						actionPlanCount: departmentPlanCount, // Only count plans by user's department
					};
				});
			}
		} catch (error) {
			console.error("Error fetching objectives:", error);
		} finally {
			loading = false;
		}
	};



	/** Toggle sort direction and field */
	const toggleSort = (field: string) => {
		if (sortField === field) {
			sortDirection = sortDirection === "asc" ? "desc" : "asc";
		} else {
			sortField = field as SortField;
			sortDirection = "asc";
		}
	};

	/** Export items to CSV */
	const exportToCSV = () => {
		const headers = [
			"Objective",
			"Strategic Initiatives",
			"KPI",
			"Persons Involved",
			"Target",
			"Evaluation Measures",
		];
		const csvContent = [
			headers.join(","),
			...objectives.map((obj) =>
				[
					obj.name,
					obj.strategic_initiatives,
					obj.kpi,
					obj.persons_involved,
					obj.target,
					obj.eval_measures,
				].join(",")
			),
		].join("\n");

		const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
		const link = document.createElement("a");
		const url = URL.createObjectURL(blob);

		link.setAttribute("href", url);
		link.setAttribute("download", "objectives.csv");
		link.style.visibility = "hidden";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	// Derived values
	const filteredItems = $derived(
		objectives
			.filter((obj) => {
				const searchFields = `${obj.name} ${obj.strategic_initiatives} ${obj.kpi}`.toLowerCase();
				return searchFields.includes(searchQuery.toLowerCase());
			})
			.sort((a, b) => {
				return sortDirection === "asc"
					? a[sortField].localeCompare(b[sortField])
					: b[sortField].localeCompare(a[sortField]);
			})
	);

	const paginatedItems = $derived(
		filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
	);

	const totalPages = $derived(
		Math.ceil(filteredItems.length / itemsPerPage)
	);

	// Initialize data
	init();
</script>

<div class="flex flex-col gap-4 container mx-auto p-4">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
		<div class="flex items-center gap-2">
			<Notebook class="w-8 h-8 text-primary" />
			<h1 class="text-2xl font-bold">Operational Plans Management</h1>
		</div>
	</div>

    <!-- Filters section -->
    <div class="flex flex-col md:flex-row justify-between items-center gap-4">
        <!-- Goals Selector -->
        <div class="flex flex-shrink-0 w-full md:w-auto">
            <GoalsSelector
                {goals}
                bind:selectedGoalId={selectedGoalId}
                onSelect={fetchObjectives}
            />
        </div>

        <!-- Search and Export -->
        <div class="flex items-center gap-4 w-full md:w-auto">
            <!-- Search Input -->
            <div class="relative flex-1">
                <Search
                    class="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                    size={20}
                />
                <input
                    type="text"
                    bind:value={searchQuery}
                    placeholder="Search objectives..."
                    class="pl-10 pr-4 py-2 bg-secondary border-secondary rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-ring"
                />
            </div>

            <!-- Export Button -->
            <!-- <button
                onclick={exportToCSV}
                class="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/80"
            >
                <Download size={20} />
                Export
            </button> -->
        </div>
    </div>



    <!-- Loading state -->
    {#if loading}
        <div class="flex justify-center p-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
    {:else}
        <!-- Objectives table -->
        <ObjectivesTable
            items={paginatedItems}
            {sortField}
            {sortDirection}
            {toggleSort}
            selectedGoal={goals.find((g) => g.id === selectedGoalId)}
        />

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
					<span class="inline-flex items-center gap-1 px-2.5 py-1 text-sm font-medium bg-yellow-100 text-yellow-700 rounded-lg">
						<Target size={16} /> 1
					</span>
					<span class="text-sm text-muted-foreground">Actions Plans Created</span>
				</div>
			</div>
		</div>

        <!-- Pagination -->
        <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div class="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(
                    currentPage * itemsPerPage,
                    filteredItems.length
                )} of {filteredItems.length} results
            </div>
            <div class="flex flex-col sm:flex-row items-center gap-4">
                <select
                    bind:value={itemsPerPage}
                    class="bg-secondary border-secondary rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-ring w-full sm:w-auto"
                >
                    <option value={5}>5 per page</option>
                    <option value={10}>10 per page</option>
                    <option value={25}>25 per page</option>
                    <option value={50}>50 per page</option>
                </select>
                <div class="flex gap-2">
                    <button
                        disabled={currentPage === 1}
                        onclick={() => (currentPage -= 1)}
                        class="px-3 py-1 rounded-lg border border-border hover:bg-muted disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <button
                        disabled={currentPage === totalPages}
                        onclick={() => (currentPage += 1)}
                        class="px-3 py-1 rounded-lg border border-border hover:bg-muted disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    {/if}
</div>

