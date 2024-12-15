import { J as attr, C as pop, Q as ensure_array_like, E as escape_html, A as push, R as stringify } from "../../../../chunks/index.js";
import { s as supabase } from "../../../../chunks/supabaseClient.js";
import "jspdf";
import "jspdf-autotable";
import { D as Download } from "../../../../chunks/download.js";
import { S as Search } from "../../../../chunks/search.js";
import { C as Clipboard_list, T as Triangle_alert } from "../../../../chunks/triangle-alert.js";
import { L as Lightbulb } from "../../../../chunks/lightbulb.js";
function PlanSummary($$payload, $$props) {
  push();
  let plansData = [];
  let loading = true;
  let searchQuery = "";
  let sortField = "id";
  const filteredPlans = plansData.filter((goal) => {
    `
				${goal.id}
                    ${goal.name} 
                    ${goal.goal_no}
                    ${goal.description}
                    ${goal.strategic_objectives.map((obj) => `${obj.name} 
                         ${obj.kpi} 
                         ${obj.action_plans.map((plan) => `${plan.actions_taken} 
                              ${plan.kpi} 
                              ${plan.target_output}
                              ${plan.key_person_responsible}`).join(" ")}`).join(" ")}
                `.toLowerCase();
    const matchesSearch = searchQuery === "";
    return matchesSearch;
  }).sort((a, b) => {
    const aValue = String(a[sortField]);
    const bValue = String(b[sortField]);
    return aValue.localeCompare(bValue);
  });
  const fetchPlansData = async () => {
    try {
      loading = true;
      const { data: plansDataRaw, error: plansError } = await supabase.from("strategic_goals").select(`
            id,
            goal_no,
            name,
            description,
            kpi,
            strategic_objectives (
            id,
            name,
            strategic_initiatives,
            kpi,
            persons_involved,
            target,
            eval_measures,
            action_plans (
                id,
                actions_taken,
                kpi,
                target_output,
                budget,
                key_person_responsible
            )
            )
        `);
      if (plansError) {
        console.error("Error fetching plans data:", plansError.message);
        return;
      }
      const { data: monitoringData, error: monitoringError } = await supabase.from("plan_monitoring").select(`
            action_plan_id,
            evaluation,
            statement,
            is_accomplished,
            time_completed
        `);
      if (monitoringError) {
        console.error("Error fetching plan monitoring data:", monitoringError.message);
        return;
      }
      plansData = plansDataRaw.map((goal) => ({
        ...goal,
        strategic_objectives: goal.strategic_objectives.map((objective) => ({
          ...objective,
          action_plans: objective.action_plans.map((actionPlan) => ({
            ...actionPlan,
            plan_monitoring: monitoringData.find((monitor) => monitor.action_plan_id === actionPlan.id) || null
            // Attach the corresponding plan_monitoring or null if not found
          }))
        }))
      }));
    } catch (error) {
      console.error("Unexpected error fetching plans data:", error);
    } finally {
      loading = false;
    }
  };
  fetchPlansData();
  $$payload.out += `<div class="w-full min-h-screen"><div class="max-w-7xl mx-auto p-6"><div class="flex justify-between items-center mb-8"><h1 class="text-2xl font-bold">Strategic Planning Summary Report</h1> <button class="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 justify-center flex-1 md:flex-initial"${attr("disabled", loading, true)}>`;
  Download($$payload, { class: "w-4 h-4" });
  $$payload.out += `<!----> Export PDF</button></div> <div class="flex flex-col md:flex-row gap-4 mb-6 items-center justify-between"><div class="relative flex-1 md:max-w-[300px]">`;
  Search($$payload, {
    class: "absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground",
    size: 20
  });
  $$payload.out += `<!----> <input type="text"${attr("value", searchQuery)} placeholder="Search plans..." class="pl-10 pr-4 py-2 bg-secondary rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-ring"></div></div> `;
  if (loading) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="flex justify-center items-center p-12"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>`;
  } else {
    $$payload.out += "<!--[!-->";
    const each_array = ensure_array_like(filteredPlans);
    $$payload.out += `<div class="space-y-8"><!--[-->`;
    for (let $$index_2 = 0, $$length = each_array.length; $$index_2 < $$length; $$index_2++) {
      let goal = each_array[$$index_2];
      const each_array_1 = ensure_array_like(goal.strategic_objectives);
      $$payload.out += `<div class="bg-card rounded-lg p-4 border border-border shadow-sm"><h2 class="text-xl text-primary font-semibold mb-4">Strategic Goal ${escape_html(goal.goal_no)} - ${escape_html(goal.name)}</h2> <p class="mb-6">${escape_html(goal.description)}</p> <div class="space-y-6"><!--[-->`;
      for (let $$index_1 = 0, $$length2 = each_array_1.length; $$index_1 < $$length2; $$index_1++) {
        let objective = each_array_1[$$index_1];
        const each_array_2 = ensure_array_like(objective.action_plans);
        $$payload.out += `<div class="border-l-4 border-primary-600 pl-4"><h3 class="font-medium mb-3 text-red-400">Strategic Objective: ${escape_html(objective.name)}</h3> <div class="grid gap-4 md:grid-cols-2 mb-4"><div class="p-3 rounded"><span class="text-sm font-medium">KPI:</span> <p class="mt-1">${escape_html(objective.kpi)}</p></div> <div class="p-3 rounded"><span class="text-sm font-medium">Target:</span> <p class="mt-1">${escape_html(objective.target)}</p></div></div> <div class="space-y-4"><!--[-->`;
        for (let $$index = 0, $$length3 = each_array_2.length; $$index < $$length3; $$index++) {
          let plan = each_array_2[$$index];
          $$payload.out += `<div class="bg-card rounded-lg p-4 border border-border"><h4 class="font-medium mb-2 text-yellow-600">Action Plan: ${escape_html(plan.actions_taken)}</h4> <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><div><span class="text-sm font-medium">KPI</span> <p class="mt-1 text-sm">${escape_html(plan.kpi)}</p></div> <div><span class="text-sm font-medium">Target Output</span> <p class="mt-1">${escape_html(plan.target_output)}</p></div> <div><span class="text-sm font-medium">Budget</span> <p class="mt-1">$${escape_html(plan.budget)}</p></div> <div><span class="text-sm font-medium">Responsible</span> <p class="mt-1">${escape_html(plan.key_person_responsible)}</p></div></div> `;
          if (plan.plan_monitoring) {
            $$payload.out += "<!--[-->";
            $$payload.out += `<div class="mt-4 pt-4 border-t"><h5 class="text-md font-medium mb-3">Monitoring Details</h5> <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><div><span class="text-sm font-medium">Actions Taken to Achieve Action Plan</span> <p class="mt-1">${escape_html(plan.plan_monitoring.evaluation)}</p></div> <div><span class="text-sm font-medium">Statement</span> <p class="mt-1">${escape_html(plan.plan_monitoring.statement)}</p></div> <div><span class="text-sm font-medium">Remarks</span> <p class="mt-1"><span${attr("class", plan.plan_monitoring.is_accomplished ? "text-green-600" : "text-red-600")}>${escape_html(plan.plan_monitoring.is_accomplished ? "Accomplished" : "Pending")}</span></p></div> <div><span class="text-sm font-medium">Completed</span> <p class="mt-1">${escape_html(plan.plan_monitoring.time_completed ? new Date(plan.plan_monitoring.time_completed).toLocaleString() : "Not Yet")}</p></div></div></div>`;
          } else {
            $$payload.out += "<!--[!-->";
          }
          $$payload.out += `<!--]--></div>`;
        }
        $$payload.out += `<!--]--></div></div>`;
      }
      $$payload.out += `<!--]--></div></div>`;
    }
    $$payload.out += `<!--]--></div>`;
  }
  $$payload.out += `<!--]--></div></div>`;
  pop();
}
function _page($$payload) {
  let activeTab = "Plans";
  const tabs = [
    {
      id: "Plans",
      label: "Plans",
      icon: Clipboard_list
    },
    {
      id: "Risks",
      label: "Risks",
      icon: Triangle_alert
    },
    {
      id: "Opportunities",
      label: "Opportunities",
      icon: Lightbulb
    }
  ];
  const each_array = ensure_array_like(tabs);
  $$payload.out += `<div class="min-h-screen"><div class="container mx-auto px-4 py-8"><div class="flex justify-between items-center mb-6"><div class="flex items-center gap-2">`;
  Clipboard_list($$payload, { class: "w-6 h-6 text-primary" });
  $$payload.out += `<!----> <h1 class="text-2xl font-bold">Summary Report</h1></div></div> <div class="rounded-lg shadow-sm mb-6"><div class="flex flex-wrap gap-2 p-2"><!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let tab = each_array[$$index];
    $$payload.out += `<button${attr("class", `flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ${stringify(activeTab === tab.id ? "bg-primary hover:bg-primary/90 text-white" : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300")}`)}><!---->`;
    tab.icon?.($$payload, { size: 18 });
    $$payload.out += `<!----> <span>${escape_html(tab.label)}</span></button>`;
  }
  $$payload.out += `<!--]--></div></div> <div class="rounded-lg shadow-sm p-6">`;
  {
    $$payload.out += "<!--[-->";
    PlanSummary($$payload);
  }
  $$payload.out += `<!--]--></div></div></div>`;
}
export {
  _page as default
};
