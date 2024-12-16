<script lang="ts">
	import { Trash2, Plus, Save, ChevronLeft } from "lucide-svelte";
	import { page } from "$app/stores";
	import { supabase } from "$lib/supabaseClient";
	import { onMount } from "svelte";
	import PlanCard from "$lib/components/monitoring/departments/PlanComponent/PlanCard.svelte";

	interface StrategicObjective {
		name: string;
		strategic_goal_id: number;
	}

	interface StrategicGoal {
		name: string;
		goal_no: number;
	}

	interface ActionPlan {
		id?: number;
		actions_taken: string;
		kpi: string;
		target_output: string;
		key_person_responsible: string;
		objective_id: number;
		profile_id: string;
		department_id: string;
		budget: number;
		isNew?: boolean;
		isEdited?: boolean;
	}

	let actionPlans: ActionPlan[] = [];
	let newPlans: ActionPlan[] = [];
	let strategicObjective: StrategicObjective | null = null;
	let strategicGoal: StrategicGoal | null = null;
	let profile: { id: string; department_id: string } | null = null;
	let objective_id: number | null = null;
	let isLoading = false;
	let isSaving = false;
	let successMessage: string | null = null;
	let errorMessage: string | null = null;

	/** Fetch strategic objective and goal */
	const fetchStrategicObjectiveAndGoal = async (objective_id: number) => {
		try {
			const { data: objectiveData, error: objectiveError } = await supabase
				.from("strategic_objectives")
				.select("name, strategic_goal_id")
				.eq("id", objective_id)
				.single();

			if (objectiveError || !objectiveData) throw new Error("Failed to fetch strategic objective.");

			strategicObjective = objectiveData;

			const { data: goalData, error: goalError } = await supabase
				.from("strategic_goals")
				.select("name, goal_no")
				.eq("id", objectiveData.strategic_goal_id)
				.single();

			if (goalError || !goalData) throw new Error("Failed to fetch strategic goal.");

			strategicGoal = goalData;
		} catch (error) {
			console.error("Error fetching strategic data:", error);
			errorMessage = "Failed to fetch strategic details.";
		}
	};

	/** Fetch existing action plans */
	const fetchActionPlans = async () => {
		if (!objective_id || !profile?.department_id) {
			errorMessage = "Objective ID or Department ID is missing.";
			console.error("Missing IDs: ", { objective_id, department_id: profile?.department_id });
			return;
		}

		isLoading = true;
		try {
			const { data, error } = await supabase
				.from("action_plans")
				.select("*")
				.eq("objective_id", objective_id)
				.eq("department_id", profile.department_id)
				.order("id", { ascending: true });

			if (error) throw error;

			actionPlans = data || [];
		} catch (error) {
			console.error("Error fetching action plans:", error);
			errorMessage = "Failed to fetch action plans.";
		} finally {
			isLoading = false;
		}
	};

	/** Add a new plan to the list */
	const addNewPlan = () => {
		if (!profile?.id || !profile.department_id || !objective_id) {
			errorMessage = "Missing required profile or objective information.";
			return;
		}

		newPlans = [
			...newPlans,
			{
				actions_taken: "",
				kpi: "",
				target_output: "",
				key_person_responsible: "",
				objective_id: objective_id,
				profile_id: profile.id,
				department_id: profile.department_id,
				budget: 0,
				isNew: true,
			},
		];
	};

	/** Handle field edit */
	const handleEditPlan = (index: number, field: string, value: any, isNew: boolean) => {
		if (isNew) {
			newPlans[index] = { ...newPlans[index], [field]: value }; // Update new plans
		} else {
			actionPlans[index] = { ...actionPlans[index], [field]: value, isEdited: true }; // Mark the plan as edited
		}
	};

	/** Delete an existing plan */
	const deletePlan = async (id: number) => {
		try {
			const { error } = await supabase
				.from("action_plans")
				.delete()
				.eq("id", id);

			if (error) throw error;

			// Refresh data
			await fetchActionPlans();
			successMessage = "Plan deleted successfully!";
		} catch (error) {
			console.error("Error deleting plan:", error);
			errorMessage = "Failed to delete plan.";
		}
	};

	/** Delete a new plan */
	const deleteNewPlan = (index: number) => {
		newPlans = newPlans.filter((_, i) => i !== index);
	};


	/** Save individual plan */
	const saveIndividualPlan = async (index: number, isNew: boolean) => {
		try {
			let plan;
			if (isNew) {
				plan = newPlans[index];
			} else {	
				plan = actionPlans[index];
			}

			const { isEdited, isNew: _, ...sanitizedPlan } = plan;

			const { data, error } = await supabase
				.from("action_plans")
				.upsert(sanitizedPlan, { onConflict: "id" })
				.select();

			if (error) throw error;

			if (data && data.length > 0) {
			// Add saved plan to recent events
			const savedPlan = data[0];
			const { data: departmentData, error: departmentError } = await supabase
				.from("departments")
				.select("name")
				.eq("id", savedPlan.department_id)
				.single();

			if (departmentError) {
				console.error(`Error fetching department name for plan ${savedPlan.id}`);
			} else {
				const departmentName = departmentData?.name || "Unknown Department";

				// Add to recent events
				await supabase.from("recent_events").insert({
					event_id: savedPlan.id,
					event_type: "action_plan",
					description: `${departmentName} created or updated an action plan`,
				});
			}
		}


			if (isNew) {
				newPlans = newPlans.filter((_, i) => i !== index); // Remove from new plans
				await fetchActionPlans();
			} else {
				actionPlans[index].isEdited = false; // Mark as saved
			}

			successMessage = "Plan saved successfully!";
		} catch (error) {
			console.error("Error saving plan:", error);
			errorMessage = "Failed to save plan.";
		}
	};

	/** Fetch data on mount */
	onMount(async () => {
		try {
			const { params } = $page;
			objective_id = parseInt(params.id);

			if (!objective_id) {
				errorMessage = "Objective ID is missing.";
				console.error("Objective ID is null or invalid:", params.id);
				return;
			}

			const user = await supabase.auth.getUser();
			if (!user?.data?.user) {
				errorMessage = "User not logged in.";
				return;
			}

			const { data: profileData, error: profileError } = await supabase
				.from("profiles")
				.select("id, department_id")
				.eq("id", user.data.user.id)
				.single();

			if (profileError || !profileData) {
				errorMessage = "Failed to fetch user profile details.";
				return;
			}

			profile = profileData;
			await fetchStrategicObjectiveAndGoal(objective_id);
			await fetchActionPlans();
		} catch (error) {
			console.error("Error during initialization:", error);
			errorMessage = "Initialization failed.";
		}
	});
</script>

<div class="flex flex-col gap-4 p-4 container mx-auto">
	<!-- Alerts -->
	{#if successMessage}
		<div class="p-4 rounded-lg bg-green-100 text-green-800">{successMessage}</div>
	{/if}
	{#if errorMessage}
		<div class="p-4 rounded-lg bg-red-100 text-red-800">{errorMessage}</div>
	{/if}

	<!-- Strategic Details -->
	<div class="bg-card border border-border rounded-lg shadow p-6">
		<h1 class="text-2xl font-bold">Strategic Planning Details</h1>
		{#if strategicGoal && strategicObjective}
			<div class="mt-4 space-y-2">
				<h5 class="text-md font-medium">
					Strategic Goal:
					<span class="ml-2 text-muted-foreground">{strategicGoal.goal_no} - {strategicGoal.name}</span>
				</h5>
				<h5 class="text-md font-medium">
					Strategic Objective:
					<span class="ml-2 text-muted-foreground">{strategicObjective.name}</span>
				</h5>
			</div>
		{:else}
			<p class="text-muted-foreground">Loading strategic details...</p>
		{/if}
	</div>

	<!-- Action Plans -->
	<div class="bg-card rounded-lg shadow border border-border p-6">
		<h2 class="text-xl font-semibold mb-4">Action Plans</h2>
		{#if isLoading}
			<div class="flex justify-center p-8">
				<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
			</div>
		{:else}
			<div class="space-y-4">
				{#each actionPlans as plan, index (plan.id)}
					<PlanCard
						data={plan}
						planNumber={index + 1}
						onEdit={(field, value) => handleEditPlan(index, field, value, false)}
						onSave={() => saveIndividualPlan(index, false)}
						onDelete={() => deletePlan(plan.id!)}
					/>
				{/each}

				{#each newPlans as newPlan, index}
					<PlanCard
						data={newPlan}
						planNumber={actionPlans.length + index + 1}
						onEdit={(field, value) => handleEditPlan(index, field, value, true)}
						onSave={() => saveIndividualPlan(index, true)}
						onDelete={() => deleteNewPlan(index)}
					/>
				{/each}
			</div>

			<div class="flex justify-end mt-4 gap-4">
				<button onclick={addNewPlan} class="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
					<Plus class="w-4 h-4 mr-2" />
					Add New Plan
				</button>
			</div>
		{/if}
	</div>
</div>
