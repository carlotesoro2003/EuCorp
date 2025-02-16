<script lang="ts">
  import { onMount } from "svelte";
  import {
    ChevronLeft,
    Plus,
    PlusCircle,
    Save,
    Target,
    TriangleAlert,
  } from "lucide-svelte";
  import RiskCard from "$lib/components/dept-risks-table/RiskCard.svelte";
  import Loading from "$lib/components/dept-risks-table/Loading.svelte";
  import Alerts from "$lib/components/dept-risks-table/Alerts.svelte";
  import { supabase } from "$lib/supabaseClient";
  import { fade } from "svelte/transition";

  interface Risk {
    id?: string;
    rrn: string;
    risk_statement: string;
    classification: number | null;
    actions: string;
    key_persons: string;
    budget: number;
    profile_id: string;
    department_id: string;
	school_year: number;
    isNew?: boolean;
    isEdited?: boolean;
  }

  interface Classification {
    id: number;
    name: string;
  }

  let schoolYear: any = $state(null);
  let risks: Risk[] = $state([]);
  let classification: Classification[] = $state([]);
  let profile: any = $state(null);
  let departmentName: string = $state("");
  let isLoading: boolean = $state(true);
  let isSaving: boolean = $state(false);
  let successMessage: string | null = $state(null);
  let errorMessage: string | null = $state(null);
  let nextRrnNumber: number = $state(1);
  let currentYear: number | null = $state(null);

  /** Function to fetch current school year */
  const fetchCurrentSchoolYear = async () => {
    try {
      const today = new Date().toISOString().split("T")[0]; 

      // Query the school_years table
      const { data, error } = await supabase
        .from("school_years")
        .select("id, school_year, start_date, end_date") 
        .lte("start_date", today)
        .gte("end_date", today)
        .maybeSingle();

      console.log("School Year Query Result:", data); 

      if (error) {
        console.error("Error fetching school year:", error.message);
        throw error;
      }

      if (data) {
        schoolYear = data; // Store the school_year object
        currentYear = parseInt(data.school_year.split("-")[0]); // Extract the starting year
        console.log(
          "Current School Year:",
          schoolYear,
          "Current Year:",
          currentYear
        );
      } else {
        console.warn("No matching school year found for today:", today);
        schoolYear = null;
        currentYear = new Date().getFullYear(); // Fallback to the current year
      }
    } catch (error) {
      console.error("Error fetching current school year:", error);
      schoolYear = null;
      currentYear = new Date().getFullYear(); // Fallback to the current year
    }
  };

  /** Function to fetch profile,risks,classification */
  const fetchAllData = async () => {
    try {
      await fetchUserProfile();
      await fetchCurrentSchoolYear();
      await fetchRisks();
      await fetchNextRrnNumber();
      await fetchClassification();
    } catch (error) {
      console.error("Error fetching data:", error);
      errorMessage = "Failed to fetch data. Please try again.";
    }
  };

  /** Function to fetch user profile */
  const fetchUserProfile = async () => {
    try {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();
      if (sessionError) throw sessionError;

      const userId = sessionData?.session?.user?.id;
      if (!userId) throw new Error("No logged-in user found.");

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("id, department_id")
        .eq("id", userId)
        .single();

      if (profileError) throw profileError;
      profile = profileData;

      const { data: departmentData, error: departmentError } = await supabase
        .from("departments")
        .select("name")
        .eq("id", profile.department_id)
        .single();

      if (departmentError) throw departmentError;
      departmentName = departmentData.name;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      errorMessage = "Failed to fetch profile details.";
    }
  };

  /** Function to fetch classification */
  const fetchClassification = async () => {
    try {
      const { data, error } = await supabase
        .from("classification")
        .select("id, name");
      if (error) throw error;
      classification = data || [];
    } catch (error) {
      console.error("Error fetching classifications:", error);
      errorMessage = "Failed to fetch classifications.";
    }
  };

  /** Function to fetch risks */
  const fetchRisks = async () => {
    try {
      const { data, error } = await supabase
        .from("risks")
        .select("*")
        .eq("department_id", profile?.department_id)
        .order("rrn", { ascending: true });
      if (error) throw error;

      risks = data || [];
    } catch (error) {
      console.error("Error fetching risks:", error);
      errorMessage = "Failed to fetch risks.";
    }
  };

  /** Function to fetch next RRN number */
  const fetchNextRrnNumber = async () => {
    try {
      const { data, error } = await supabase
        .from("risks")
        .select("rrn")
        .eq("profile_id", profile?.id)
        .ilike("rrn", `%${currentYear}`)
        .order("rrn", { ascending: false })
        .limit(1);

      if (error) throw error;

      if (data.length > 0) {
        const lastRrn = data[0].rrn;
        const lastNumberMatch = lastRrn.match(/(\d{3})-\d{4}$/);
        nextRrnNumber = lastNumberMatch
          ? parseInt(lastNumberMatch[1], 10) + 1
          : 1;
      } else {
        nextRrnNumber = 1;
      }
    } catch (error) {
      console.error("Error fetching next RRN number:", error);
      errorMessage = "Failed to determine the next RRN number.";
    }
  };

  /** Add New Risk Row */
  const addRow = () => {
    const formattedRrn = `RRN-${departmentName}-${String(nextRrnNumber).padStart(3, "0")}-${currentYear}`;
    nextRrnNumber++;
    risks = [
      ...risks,
      {
        rrn: formattedRrn,
        risk_statement: "",
        classification: null,
        actions: "",
        key_persons: "",
        budget: 0,
        profile_id: profile?.id || "",
        department_id: profile?.department_id || "",
		school_year: schoolYear?.id || "",
        isNew: true,
      },
    ];
  };

  /** Mark Edited Risk */
  const markRiskAsEdited = (index: number) => {
    if (risks[index]) {
      risks[index].isEdited = true;
    }
  };

  /** Save Risks */
  const saveRisks = async () => {
    isSaving = true;
    try {
      // Filter new or edited risks
      const newOrEditedRisks = risks.filter(
        (risk) => risk.isNew || risk.isEdited
      );

      // Remove `isNew` and `isEdited` before saving
      const sanitizedRisks = newOrEditedRisks.map(
        ({ isNew, isEdited, id, ...rest }) => ({
			...rest,
			school_year: schoolYear?.id || "",
		})
      );

      if (sanitizedRisks.length > 0) {
        // Save new or updated risks
        const { data, error } = await supabase
          .from("risks")
          .upsert(sanitizedRisks, { onConflict: "rrn" })
          .select();

        if (error) throw error;

        if (data && data.length > 0) {
          // Add to recent events
          const events = data.map((risk) => ({
            event_id: risk.id,
            event_type: "risk",
            description: `${departmentName} updated or added a new risk: "${risk.risk_statement}"`,
            created_at: new Date().toISOString(),
          }));

          await supabase.from("recent_events").insert(events);
        }

        // Fetch the latest risks to refresh the list
        const { data: updatedRisks, error: fetchError } = await supabase
          .from("risks")
          .select("*")
          .eq("profile_id", profile?.id);

        if (fetchError) throw fetchError;

        risks = updatedRisks || [];
        successMessage = "Risks saved successfully!";
      } else {
        successMessage = "No changes to save.";
      }

      setTimeout(() => {
        successMessage = null;
      }, 3000);
    } catch (error) {
      console.error("Error saving risks:", error);
      errorMessage = "Failed to save risks.";
      setTimeout(() => {
        errorMessage = null;
      }, 3000);
    } finally {
      isSaving = false;
    }
  };

  /** Remove risk row */
  const removeRow = async (index: number) => {
    const riskToDelete = risks[index];

    if (riskToDelete.isNew) {
      // If the risk is new and not saved in the database, just remove it locally
      risks = risks.filter((_, i) => i !== index);
      nextRrnNumber--; // Adjust RRN for new risks
      return;
    }

    try {
      // Delete the risk from the database
      const { error } = await supabase
        .from("risks")
        .delete()
        .eq("rrn", riskToDelete.rrn);

      if (error) throw error;

      // Remove the risk from local state
      risks = risks.filter((_, i) => i !== index);
      successMessage = "Risk deleted successfully!";
    } catch (error) {
      console.error("Error deleting risk:", error);
      errorMessage = "Failed to delete risk.";
    } finally {
      setTimeout(() => {
        successMessage = null;
        errorMessage = null;
      }, 3000);
    }
  };

  onMount(async () => {
    isLoading = true;
    await fetchAllData();
    isLoading = false;
  });
</script>

<div class="flex flex-col gap-4 p-4 container mx-auto">
  <!-- Alerts -->
  {#if successMessage}
    <div
      transition:fade
      class="flex items-center p-4 rounded-lg bg-green-100 text-green-800"
    >
      <span>{successMessage}</span>
    </div>
  {/if}
  {#if errorMessage}
    <div
      transition:fade
      class="flex items-center p-4 rounded-lg bg-red-100 text-red-800"
    >
      <span>{errorMessage}</span>
    </div>
  {/if}

  <!-- Header -->
  <div
    class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
  >
    <div class="flex items-center gap-2">
      <TriangleAlert class="w-8 h-8 text-primary" />
      <h1 class="text-2xl font-bold">{departmentName} Risk Register</h1>
    </div>
  </div>

  <!-- Content -->
  <div class="bg-card rounded-lg shadow border border-border p-6">
    <!-- <div class="flex justify-between items-center mb-6">
			<h2 class="text-xl font-semibold">Department Risks</h2>
		</div> -->

    {#if isLoading}
      <div class="flex justify-center p-8">
        <div
          class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"
        />
      </div>
    {:else}
      <!-- Risk Cards -->
      <div class="grid grid-cols-1 gap-4 mb-6">
        {#each risks as risk, index}
          <RiskCard
            {risk}
            {classification}
            {index}
            removeRow={(index) => removeRow(index)}
            onUpdate={(index) => markRiskAsEdited(index)}
          />
        {/each}
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-wrap gap-4">
        <button
          onclick={addRow}
          class="inline-flex items-center px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors"
        >
          <Plus class="w-4 h-4 mr-2" />
          Add Risk
        </button>

        <button
          onclick={saveRisks}
          disabled={isSaving}
          class="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {#if isSaving}
            <div
              class="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2"
            ></div>
          {:else}
            <PlusCircle class="w-4 h-4 mr-2" />
          {/if}
          Submit Risks
        </button>
      </div>
    {/if}
  </div>
</div>
