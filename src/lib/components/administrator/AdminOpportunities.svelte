<script lang="ts">
	import { Download, Pencil, Search, Trash2, Plus, X, ArrowUpDown, Lightbulb } from "lucide-svelte";
	import TableRow from "$lib/components/admin-opportunities-table/TableRow.svelte";
	import OpportunityForm from "$lib/components/admin-opportunities-table/OpportunityForm.svelte";
	import jsPDF from "jspdf";
	import autoTable from "jspdf-autotable";
	import { supabase } from "$lib/supabaseClient";

	/** Opportunity type definition */
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
		profile_id: string;
		department_name: string | null;
		department_id: string | null;
		school_year: number | null;
		user_name: string | null;
	};

	type Department = {
		id: string;
		name: string;
	};

	
	type SchoolYear = {
		id: number;
		school_year: string;
		start_date: string;
		end_date: string;
  	};

	type SortField = "opt_statement" | "planned_actions" | "department_name" | "budget";
	type SortDirection = "asc" | "desc";

	// State variables
	let searchQuery: string = $state("");
	let currentPage: number = $state(1);
	let itemsPerPage: number = $state(5);
	let showForm: boolean = $state(false);
	let editingOpportunity: Opportunity | null = $state(null);
	let sortField: SortField = $state("opt_statement");
	let sortDirection: SortDirection = $state("asc");
	let departmentFilter: string = $state("all");
	let showMobileFilters: boolean = $state(false);
	let showAlert: boolean = $state(false);
	let alertMessage: string = $state("");
	let alertType: string = $state("success");
	let saving: boolean = $state(false);
	let loading: boolean = $state(true);
	let approvingId: number | null = $state(null);
	let deletingId: number | null = $state(null);
	let isLoading = false;
	let schoolYearFilter: number | "all" = $state("all");
	let currentSchoolYearId : number | null = $state(null);

	// Data state
	let opportunities: Opportunity[] = $state([]);
	let departments: Department[] = $state([]);
	let userRole: string | null = $state(null);
	let adminName: string | null = $state(null);
	let vicePresidentName: string | null = $state(null);
	let presidentName: string | null = $state(null);
	let schoolYears: SchoolYear[] = $state([]);

	// Initialize data on component mount
	const init = async () => {
		await fetchCurrentUserRole();
		await fetchCurrentSchoolYear();
		await fetchSchoolYears();
		await fetchAdminName();
		await fetchOpportunities();
		await fetchDepartments();
		await fetchVPAndPresidentNames();
		loading = false;
	};

	/** Fetch current user role */
	const fetchCurrentUserRole = async () => {
		const {
			data: { session },
		} = await supabase.auth.getSession();
		if (!session || !session.user) return;

		const { data: profile, error } = await supabase.from("profiles").select("role").eq("id", session.user.id).single();

		if (error) {
			displayAlert("Error fetching user role: " + error.message, "error");
			return;
		}

		userRole = profile.role;
	};

	const fetchSchoolYears = async () => {
		const {data, error} = await supabase
		.from('school_years')
		.select('*')

		if(error){
			displayAlert("Error fetching school years: " + error.message, "error");
			return;
		}
		else{
			schoolYears = data;
		}
	}

	const fetchCurrentSchoolYear = async() => {
		try{
			const today = new Date().toISOString().split('T')[0];
			const {data, error} = await supabase
			.from('school_years')
			.select('id')
			.lte('start_date', today)
			.gte('end_date', today)
			.maybeSingle();

			if(error){
				displayAlert("Error fetching current school year: " + error.message, "error");
				return;
			}
			else{
				currentSchoolYearId = data?.id || null;
				schoolYearFilter = currentSchoolYearId || "all";
			}
		}
		catch(error){
			displayAlert("Error fetching current school year: " + (error as Error).message, "error");
		}
	}

	const carryOverOpt = async(oppurtunity: Opportunity)  => {
		try{
			const {data, error} = await supabase
			.from('opportunities')
			.update({
				school_year: currentSchoolYearId
			})
			.eq('id', oppurtunity.id)
			.maybeSingle();

			if(error){
				displayAlert("Error carrying over opportunity: " + (error as Error).message, "error");
				return;
			}
			else{
				opportunities = opportunities.map((opportunity) => {
					if(opportunity.id === oppurtunity.id){
						return {
							...opportunity,
							school_year: currentSchoolYearId
						}
					}
					return opportunity;
				});
				displayAlert("Opportunity carried over successfully!", "success");
			}
		}
		catch(error){
			displayAlert("Error carrying over opportunity: " + (error as Error).message, "error");
		}
	}

	/** Fetch admin name */
	const fetchAdminName = async () => {
		const { data, error } = await supabase.from("profiles").select("first_name, last_name").eq("role", "admin");

		if (error) {
			displayAlert("Error fetching admin name: " + error.message, "error");
			adminName = "N/A";
			return;
		}

		adminName = data.map((admin) => `${admin.first_name} ${admin.last_name}`).join(", ");
	};

	/** Fetch VP and President names */
	const fetchVPAndPresidentNames = async () => {
		const { data, error } = await supabase.from("profiles").select("first_name, last_name, role").in("role", ["vice_president", "president"]);

		if (error) {
			displayAlert("Error fetching VP and President names: " + error.message, "error");
			vicePresidentName = "N/A";
			presidentName = "N/A";
			return;
		}

		const vp = data.find((user) => user.role === "vice_president");
		const president = data.find((user) => user.role === "president");

		vicePresidentName = vp ? `${vp.first_name} ${vp.last_name}` : "N/A";
		presidentName = president ? `${president.first_name} ${president.last_name}` : "N/A";
	};

	/** Fetch opportunities */
	const fetchOpportunities = async () => {
		const { data, error } = await supabase.from("opportunities").select(`
                *,
                profiles (
                    first_name,
                    last_name,
                    departments (name)
                )
            `);

		if (error) {
			displayAlert("Error fetching opportunities: " + error.message, "error");
			return;
		}

		opportunities = data.map((opportunity: any) => ({
			...opportunity,
			department_name: opportunity.profiles?.departments?.name || "N/A",
			user_name: `${opportunity.profiles?.first_name || ""} ${opportunity.profiles?.last_name || ""}`,
		}));
	};

	/** Fetch departments */
	const fetchDepartments = async () => {
		const { data, error } = await supabase.from("departments").select("id, name");

		if (error) {
			displayAlert("Error fetching departments: " + error.message, "error");
			return;
		}

		departments = data;
	};

	/** Display alert message */
	const displayAlert = (message: string, type: string) => {
		alertMessage = message;
		alertType = type;
		showAlert = true;

		setTimeout(() => {
			showAlert = false;
		}, 3000);
	};

	// Derived values with sorting and filtering
	const filteredItems = $derived(
		opportunities
			.filter((opportunity) => {
				const searchFields = `${opportunity.opt_statement} ${opportunity.planned_actions} ${opportunity.department_name}`.toLowerCase();
				const matchesSearch = searchFields.includes(searchQuery.toLowerCase());
				const matchesDepartment = departmentFilter === "all" || opportunity.department_name === departmentFilter;
				const matchesSchoolYear = schoolYearFilter == "all" || opportunity.school_year == schoolYearFilter;
				return matchesSearch && 
				matchesDepartment &&
				matchesSchoolYear;
			})
			.sort((a, b) => {
				const aValue = String(a[sortField]);
				const bValue = String(b[sortField]);
				return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
			})
	);

	const paginatedItems = $derived(filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
	const totalPages = $derived(Math.ceil(filteredItems.length / itemsPerPage));

	/** Toggle sort direction and field */
	const toggleSort = (field: SortField) => {
		if (sortField === field) {
			sortDirection = sortDirection === "asc" ? "desc" : "asc";
		} else {
			sortField = field;
			sortDirection = "asc";
		}
	};

	/** Export to PDF */
	const exportToPDF = () => {
		const doc = new jsPDF("landscape");

		// Set font to Times New Roman
		doc.setFont("times", "normal");

		// Title and Header Information
		doc.setFontSize(12);
		doc.text("MANUEL S. ENVERGA UNIVERSITY FOUNDATION", 14, 10);
		doc.text("Opportunities Report", 14, 16);
		doc.setFontSize(10);
		doc.text("SY 2024-2025", 14, 22);

		// Table Columns
		const columns = ["Opportunity Statement", "Planned Actions", "KPI", "Key Persons", "Target Output", "Budget", "Department"];

		// Table Rows
		const rows = filteredItems.map((opportunity) => [opportunity.opt_statement, opportunity.planned_actions, opportunity.kpi, opportunity.key_persons, opportunity.target_output, opportunity.budget.toFixed(2), opportunity.department_name || "Unknown"]);

		// Add the table using autoTable
		autoTable(doc, {
			head: [columns],
			body: rows,
			startY: 28,
			theme: "grid",
			styles: {
				font: "times",
				fontSize: 10,
			},
			headStyles: { fillColor: [41, 128, 185] },
		});

		// Signature Section
		const pageHeight = doc.internal.pageSize.height;
		const signatureStartY = pageHeight - 40;

		// Positions for signatures
		const columnWidth = doc.internal.pageSize.width / 4;
		const positions = [14, columnWidth, columnWidth * 2, columnWidth * 3];

		// Add Signatures
		doc.setFontSize(10);

		// Department Head
		const firstOpportunity = opportunities[0];
		const userName = firstOpportunity?.user_name || "Unknown";
		const departmentName = firstOpportunity?.department_name || "Unknown";

		doc.text(`${userName} (sgnd)`, positions[0], signatureStartY - 5);
		doc.text("_________________________", positions[0], signatureStartY);
		doc.text(`${departmentName} Department Head`, positions[0], signatureStartY + 5);

		// Corporate Planning Officer
		doc.text(`${adminName || "N/A"} (sgnd)`, positions[1], signatureStartY - 5);
		doc.text("_________________________", positions[1], signatureStartY);
		doc.text("Corporate Planning Officer", positions[1], signatureStartY + 5);

		// Vice President
		doc.text(`${vicePresidentName || "N/A"} (sgnd)`, positions[2], signatureStartY - 5);
		doc.text("_________________________", positions[2], signatureStartY);
		doc.text("Vice President", positions[2], signatureStartY + 5);

		// President
		doc.text(`${presidentName || "N/A"} (sgnd)`, positions[3], signatureStartY - 5);
		doc.text("_________________________", positions[3], signatureStartY);
		doc.text("President", positions[3], signatureStartY + 5);

		// Save the PDF file
		const pdfBlob = doc.output('blob');
        const blobUrl = URL.createObjectURL(pdfBlob);
        window.open(blobUrl, '_blank');
        
        // Clean up blob URL after a delay
        setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
	};

	/** Delete opportunity */
	const deleteOpportunity = async (id: number) => {
		deletingId = id;
		const { error } = await supabase.from("opportunities").delete().eq("id", id);

		if (error) {
			displayAlert("Error deleting opportunity: " + error.message, "error");
		} else {
			await fetchOpportunities();
			displayAlert("Opportunity deleted successfully!", "success");
		}
		deletingId = null;
	};

	/** Approve opportunity */
	const approveOpportunity = async (id: number) => {
		approvingId = id;
		let updateField = {};

		if (userRole === "admin") {
			updateField = { is_approved: true };
		} else if (userRole === "vice_president") {
			updateField = { is_approved_vp: true };
		} else if (userRole === "president") {
			updateField = { is_approved_president: true };
		}

		const { data, error } = await supabase.from("opportunities").update(updateField).eq("id", id).select();

		if (error) {
			displayAlert("Error approving opportunity: " + error.message, "error");
		} else {
			if (userRole === "president" && data && data.length > 0) {
				const opportunity = data[0];
				const { error: monitoringError } = await supabase.from("opt_monitoring").insert({
					opt_id: opportunity.id,
					profile_id: opportunity.profile_id,
					department_id: opportunity.department_id,
				});

				if (monitoringError) {
					displayAlert("Error adding to monitoring: " + monitoringError.message, "error");
				}
			}
			await fetchOpportunities();
			displayAlert("Opportunity approved successfully!", "success");
		}
		approvingId = null;
	};

	/** Save opportunity */
	const saveOpportunity = async (formData: Partial<Opportunity>) => {
		if (!editingOpportunity) return;

		saving = true;
		const { error } = await supabase
			.from("opportunities")
			.update({
				opt_statement: formData.opt_statement,
				planned_actions: formData.planned_actions,
				kpi: formData.kpi,
				key_persons: formData.key_persons,
				target_output: formData.target_output,
				budget: formData.budget,
			})
			.eq("id", editingOpportunity.id);

		if (error) {
			displayAlert("Error updating opportunity: " + error.message, "error");
		} else {
			await fetchOpportunities();
			displayAlert("Opportunity updated successfully!", "success");
			closeForm();
		}

		saving = false;
	};

	/** Close form */
	const closeForm = () => {
		showForm = false;
		editingOpportunity = null;
	};

	/** Approve all opportunities */
	const approveAllOpportunities = async () => {
		isLoading = true;

		let updateField = {};

		// Determine the field to update based on the user role
		if (userRole === "admin") {
			updateField = { is_approved: true };
		} else if (userRole === "vice_president") {
			updateField = { is_approved_vp: true };
		} else if (userRole === "president") {
			updateField = { is_approved_president: true };
		} else {
			isLoading = false;
			return; // Exit if the user does not have a valid role
		}

		try {
			// Update all displayed opportunities
			const { error } = await supabase
			.from("opportunities")
			.update(updateField)
			.in(
				"id",
				paginatedItems.map((opportunity) => opportunity.id) // Approve only visible opportunities
			);

			if (error) {
			displayAlert("Error approving opportunities: " + error.message, "error");
			} else {
			// If the president is approving, handle monitoring entries
			if (userRole === "president") {
				// Check existing monitoring entries to prevent duplicates
				const monitoringIds = paginatedItems.map((opportunity) => opportunity.id);
				const { data: existingEntries, error: fetchError } = await supabase
				.from("opt_monitoring")
				.select("opt_id")
				.in("opt_id", monitoringIds);

				if (fetchError) {
				displayAlert("Error fetching existing monitoring entries: " + fetchError.message, "error");
				return;
				}

				// Determine which opportunities need to be added to the monitoring table
				const existingIds = existingEntries.map((entry) => entry.opt_id);
				const newMonitoringEntries = paginatedItems
				.filter((opportunity) => !existingIds.includes(opportunity.id)) // Filter out duplicates
				.map((opportunity) => ({
					opt_id: opportunity.id,
					profile_id: opportunity.profile_id,
					department_id: opportunity.department_id,
				}));

				// Insert new monitoring entries
				if (newMonitoringEntries.length > 0) {
				const { error: insertError } = await supabase
					.from("opt_monitoring")
					.insert(newMonitoringEntries);

				if (insertError) {
					displayAlert("Error adding new monitoring entries: " + insertError.message, "error");
				}
				}
			}

			// Refresh opportunities list
			await fetchOpportunities();
			displayAlert("All displayed opportunities approved successfully!", "success");
			}
		} catch (error) {
			console.error("Unexpected error approving all opportunities:", error);
			displayAlert("An unexpected error occurred.", "error");
		} finally {
			isLoading = false;
		}
	};




	// Initialize data
	init();
</script>

<div class="flex flex-col gap-4 container mx-auto p-6">
	{#if showAlert}
		<div class="alert alert-{alertType} shadow-lg mb-4">
			<span>{alertMessage}</span>
		</div>
	{/if}

	<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
		<div class="flex items-center gap-2">
		  <Lightbulb class="w-8 h-8 text-primary" />
		  <h1 class="text-2xl font-bold">Opportunities Management</h1>
		</div>
	  </div>

	<!-- Mobile filters toggle -->
	<button onclick={() => (showMobileFilters = !showMobileFilters)} class="md:hidden w-full px-4 py-2 bg-secondary rounded-lg text-left flex justify-between items-center">
		Filters
		<ArrowUpDown size={16} class={showMobileFilters ? "rotate-180" : ""} />
	</button>

	<!-- Filters section -->
	<div class={`flex flex-col gap-4 ${showMobileFilters ? "block" : "hidden"} md:flex md:flex-row md:justify-between`}>
		<div class="flex flex-col md:flex-row gap-4 w-full md:w-auto">
			<div class="relative flex-1 md:w-[300px]">
				<Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
				<input type="text" bind:value={searchQuery} placeholder="Search opportunities..." class="pl-10 pr-4 py-2 bg-secondary border-secondary rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-ring" />
			</div>
			<select bind:value={departmentFilter} class="bg-secondary rounded-lg px-3 py-2 w-full md:w-[200px]">
				<option value="all">All Departments</option>
				{#each departments as department}
					<option value={department.name}>{department.name}</option>
				{/each}
			</select>

			<select bind:value={schoolYearFilter} class="bg-secondary rounded-lg px-3 py-2 w-full md:w-[200px]">
				<option value="all">All School Years</option>
				{#each schoolYears as schoolYear}
					<option value={schoolYear.id}>{schoolYear.school_year}</option>
				{/each}
			</select>
		</div>
		
		<div class="flex gap-2 w-full md:w-auto">

			<!-- Approve All Button -->
		{#if paginatedItems.length > 0}
		<button onclick={exportToPDF} class="flex items-center gap-2 bg-secondary px-4 py-2 rounded-lg hover:bg-secondary/80 flex-1 md:flex-initial">
			<Download size={20} />
			Export
		</button>
		<button
			class="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
			onclick={approveAllOpportunities}
			disabled={isLoading || paginatedItems.every(
				(opportunity) =>
					(userRole === "admin" && opportunity.is_approved) ||
					(userRole === "vice_president" && opportunity.is_approved_vp) ||
					(userRole === "president" && opportunity.is_approved_president)
			)}
		>
			{isLoading ? "Processing..." : "Approve All"}
		</button>
	{/if}
			
		</div>
	</div>

	<!-- Loading state -->
	{#if loading}
		<div class="flex justify-center p-8">
			<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
		</div>
	{:else}
		<!-- Opportunities table -->
		<div class="overflow-x-auto bg-card rounded-lg shadow border border-border">
			<table class="min-w-full table-auto">
				<thead class="bg-muted/50">
					<tr>
						<th class="px-4 py-3 text-left">
							<button onclick={() => toggleSort("opt_statement")} class="flex items-center gap-1 hover:text-primary">
								Statement
								<ArrowUpDown size={16} class={sortField === "opt_statement" ? "text-primary" : ""} />
							</button>
						</th>
						<th class="px-4 py-3 text-left">
							<button onclick={() => toggleSort("planned_actions")} class="flex items-center gap-1 hover:text-primary">
								Actions
								<ArrowUpDown size={16} class={sortField === "planned_actions" ? "text-primary" : ""} />
							</button>
						</th>
						<th class="px-4 py-3 text-left">KPI</th>
						<th class="px-4 py-3 text-left">Key Persons</th>
						<th class="px-4 py-3 text-left">Target</th>
						<th class="px-4 py-3 text-left">
							<button onclick={() => toggleSort("budget")} class="flex items-center gap-1 hover:text-primary">
								Budget
								<ArrowUpDown size={16} class={sortField === "budget" ? "text-primary" : ""} />
							</button>
						</th>
						<th class="px-4 py-3 text-left">
							<button onclick={() => toggleSort("department_name")} class="flex items-center gap-1 hover:text-primary">
								Department
								<ArrowUpDown size={16} class={sortField === "department_name" ? "text-primary" : ""} />
							</button>
						</th>
						<th class="px-4 py-3 text-left w-[150px]">Actions</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-border">
					{#each paginatedItems as opportunity (opportunity.id)}
						<TableRow
							{opportunity}
							{userRole}
							onEdit={(opp) => {
								editingOpportunity = opp;
								showForm = true;
							}}
							onDelete={deleteOpportunity}
							onApprove={approveOpportunity}
							onCarryOver={() => carryOverOpt(opportunity)}
							{approvingId}
							{deletingId}
							{currentSchoolYearId}
						/>
					{/each}
				</tbody>
			</table>
		</div>

		<!-- Pagination -->
		<div class="flex flex-col sm:flex-row justify-between items-center gap-4">
			<div class="text-sm text-muted-foreground">
				Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredItems.length)} of {filteredItems.length} results
			</div>
			<div class="flex flex-col sm:flex-row items-center gap-4">
				<select bind:value={itemsPerPage} class="bg-secondary rounded-lg px-2 py-1 w-full sm:w-auto">
					<option value={5}>5 per page</option>
					<option value={10}>10 per page</option>
					<option value={25}>25 per page</option>
					<option value={50}>50 per page</option>
				</select>
				<div class="flex gap-2">
					<button disabled={currentPage === 1} onclick={() => (currentPage -= 1)} class="px-3 py-1 rounded-lg border border-border hover:bg-muted disabled:opacity-50">Previous</button>
					<button disabled={currentPage === totalPages} onclick={() => (currentPage += 1)} class="px-3 py-1 rounded-lg border border-border hover:bg-muted disabled:opacity-50">Next</button>
				</div>
			</div>
		</div>
	{/if}

	<!-- Edit Modal -->
	{#if showForm}
		<div class="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
			<div class="bg-card p-3 rounded-lg w-full max-w-md relative border border-border">
				<button onclick={closeForm} class="absolute right-4 top-4 p-1 hover:bg-muted rounded-lg">
					<X size={20} />
				</button>
				<OpportunityForm opportunity={editingOpportunity} onSave={saveOpportunity} {saving} />
			</div>
		</div>
	{/if}
</div>
