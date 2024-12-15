import { N as spread_props, O as slot, P as sanitize_props, C as pop, A as push, E as escape_html, J as attr, R as stringify, Q as ensure_array_like } from "./index.js";
import { I as Icon } from "./Icon.js";
import { s as supabase } from "./supabaseClient.js";
import "chart.js/auto";
import "jspdf";
import "jspdf-autotable";
import { S as Search } from "./search.js";
import { D as Download } from "./download.js";
import { L as Loader_circle } from "./loader-circle.js";
function Building_2($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "path",
      {
        "d": "M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"
      }
    ],
    [
      "path",
      { "d": "M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" }
    ],
    [
      "path",
      {
        "d": "M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"
      }
    ],
    ["path", { "d": "M10 6h4" }],
    ["path", { "d": "M10 10h4" }],
    ["path", { "d": "M10 14h4" }],
    ["path", { "d": "M10 18h4" }]
  ];
  Icon($$payload, spread_props([
    { name: "building-2" },
    $$sanitized_props,
    {
      iconNode,
      children: ($$payload2) => {
        $$payload2.out += `<!---->`;
        slot($$payload2, $$props, "default", {});
        $$payload2.out += `<!---->`;
      },
      $$slots: { default: true }
    }
  ]));
}
function Chevron_down($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [["path", { "d": "m6 9 6 6 6-6" }]];
  Icon($$payload, spread_props([
    { name: "chevron-down" },
    $$sanitized_props,
    {
      iconNode,
      children: ($$payload2) => {
        $$payload2.out += `<!---->`;
        slot($$payload2, $$props, "default", {});
        $$payload2.out += `<!---->`;
      },
      $$slots: { default: true }
    }
  ]));
}
function Circle_alert($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "circle",
      { "cx": "12", "cy": "12", "r": "10" }
    ],
    [
      "line",
      {
        "x1": "12",
        "x2": "12",
        "y1": "8",
        "y2": "12"
      }
    ],
    [
      "line",
      {
        "x1": "12",
        "x2": "12.01",
        "y1": "16",
        "y2": "16"
      }
    ]
  ];
  Icon($$payload, spread_props([
    { name: "circle-alert" },
    $$sanitized_props,
    {
      iconNode,
      children: ($$payload2) => {
        $$payload2.out += `<!---->`;
        slot($$payload2, $$props, "default", {});
        $$payload2.out += `<!---->`;
      },
      $$slots: { default: true }
    }
  ]));
}
function File_text($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "path",
      {
        "d": "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"
      }
    ],
    ["path", { "d": "M14 2v4a2 2 0 0 0 2 2h4" }],
    ["path", { "d": "M10 9H8" }],
    ["path", { "d": "M16 13H8" }],
    ["path", { "d": "M16 17H8" }]
  ];
  Icon($$payload, spread_props([
    { name: "file-text" },
    $$sanitized_props,
    {
      iconNode,
      children: ($$payload2) => {
        $$payload2.out += `<!---->`;
        slot($$payload2, $$props, "default", {});
        $$payload2.out += `<!---->`;
      },
      $$slots: { default: true }
    }
  ]));
}
function Monitor($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "rect",
      {
        "width": "20",
        "height": "14",
        "x": "2",
        "y": "3",
        "rx": "2"
      }
    ],
    [
      "line",
      {
        "x1": "8",
        "x2": "16",
        "y1": "21",
        "y2": "21"
      }
    ],
    [
      "line",
      {
        "x1": "12",
        "x2": "12",
        "y1": "17",
        "y2": "21"
      }
    ]
  ];
  Icon($$payload, spread_props([
    { name: "monitor" },
    $$sanitized_props,
    {
      iconNode,
      children: ($$payload2) => {
        $$payload2.out += `<!---->`;
        slot($$payload2, $$props, "default", {});
        $$payload2.out += `<!---->`;
      },
      $$slots: { default: true }
    }
  ]));
}
function Notepad_text($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    ["path", { "d": "M8 2v4" }],
    ["path", { "d": "M12 2v4" }],
    ["path", { "d": "M16 2v4" }],
    [
      "rect",
      {
        "width": "16",
        "height": "18",
        "x": "4",
        "y": "4",
        "rx": "2"
      }
    ],
    ["path", { "d": "M8 10h6" }],
    ["path", { "d": "M8 14h8" }],
    ["path", { "d": "M8 18h5" }]
  ];
  Icon($$payload, spread_props([
    { name: "notepad-text" },
    $$sanitized_props,
    {
      iconNode,
      children: ($$payload2) => {
        $$payload2.out += `<!---->`;
        slot($$payload2, $$props, "default", {});
        $$payload2.out += `<!---->`;
      },
      $$slots: { default: true }
    }
  ]));
}
function DoughnutChart($$payload, $$props) {
  push();
  $$payload.out += `<div class="h-[200px] min-h-[200px] w-full"><canvas></canvas></div>`;
  pop();
}
function AdminPlansMonitoring($$payload, $$props) {
  push();
  let plans = [];
  let filteredPlans = [];
  let filterStatus = "all";
  let isLoading = true;
  let isGeneratingSummary = false;
  let searchQuery = "";
  let showAlert = false;
  let alertMessage = "";
  let alertType = "success";
  let currentPage = 1;
  let itemsPerPage = 5;
  let totalPages = Math.ceil(filteredPlans.length / itemsPerPage);
  let paginatedPlans = filteredPlans.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const chartData = {
    achieved: filteredPlans.filter((p) => p.is_accomplished).length,
    notAchieved: filteredPlans.filter((p) => !p.is_accomplished).length
  };
  let departments = [];
  let selectedStrategicGoal = "all";
  let strategicGoals = [];
  let strategicObjectives = [];
  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "achieved", label: "Achieved" },
    { value: "not_achieved", label: "Not Achieved" }
  ];
  const getStatusLabel = (value) => {
    return statusOptions.find((opt) => opt.value === value)?.label || "All Status";
  };
  const displayAlert = (message, type) => {
    alertMessage = message;
    alertType = type;
    showAlert = true;
    setTimeout(
      () => {
        showAlert = false;
      },
      3e3
    );
  };
  const fetchPlanMonitoring = async () => {
    isLoading = true;
    try {
      const { data, error } = await supabase.from("plan_monitoring").select(`
				id,
				action_plan_id,
				evaluation,
				statement,
				is_accomplished,
				time_completed,
				department_id,
				action_plans (
					actions_taken,
					kpi,
					target_output,
					objective_id,
					strategic_objectives (
						name,
						strategic_goal_id,
						strategic_goals (name, goal_no)
					)
				)
			`);
      if (error) throw error;
      const {
        data: departmentsData,
        error: departmentsError
      } = await supabase.from("departments").select("id, name");
      if (departmentsError) throw departmentsError;
      const departmentMap = Object.fromEntries(departmentsData.map((dept) => [dept.id, dept.name]));
      plans = data.map((plan) => ({
        id: plan.id,
        action_plan_id: plan.action_plan_id,
        evaluation: plan.evaluation,
        statement: plan.statement,
        is_accomplished: plan.is_accomplished,
        time_completed: plan.time_completed,
        department: departmentMap[plan.department_id] || "Unassigned",
        actions_taken: plan.action_plans?.actions_taken || "No Actions Taken",
        kpi: plan.action_plans?.kpi || "No KPI",
        target_output: plan.action_plans?.target_output || "No Target Output",
        objective: plan.action_plans?.strategic_objectives?.name || "No Objective",
        goal: plan.action_plans?.strategic_objectives?.strategic_goals?.name || "No Goal",
        goal_no: plan.action_plans?.strategic_objectives?.strategic_goals?.goal_no || 0
      }));
      applyFilter();
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      isLoading = false;
    }
  };
  const fetchDepartments = async () => {
    try {
      const { data, error } = await supabase.from("departments").select("name");
      if (error) throw error;
      departments = [
        "All Departments",
        ...data.map((dept) => dept.name)
      ];
    } catch (error) {
      displayAlert("Error fetching departments", "error");
    }
  };
  const fetchStrategicGoals = async () => {
    try {
      const { data, error } = await supabase.from("strategic_goals").select("name, goal_no");
      if (error) throw error;
      strategicGoals = [
        { name: "All Goals", goal_no: null },
        ...data.map((goal) => ({
          name: `${goal.goal_no} - ${goal.name}`,
          goal_no: goal.goal_no
        }))
      ];
    } catch (error) {
      console.error("Error fetching strategic goals:", error);
    }
  };
  const fetchStrategicObjectives = async () => {
    try {
      const selectedGoal = strategicGoals.find((goal) => goal.name === selectedStrategicGoal);
      let query = supabase.from("strategic_objectives").select("name, strategic_goal_id");
      if (selectedStrategicGoal !== "all" && selectedGoal?.goal_no) ;
      const { data, error } = await query;
      if (error) throw error;
      strategicObjectives = [
        "All Objectives",
        ...data.map((objective) => objective.name)
      ];
      console.log("Strategic Objectives:", strategicObjectives);
    } catch (error) {
      console.error("Error fetching strategic objectives:", error);
      strategicObjectives = ["All Objectives"];
    }
  };
  const applyFilter = () => {
    let filtered = plans;
    filteredPlans = filtered;
    currentPage = 1;
  };
  const percentage = filteredPlans.length > 0 ? (chartData.achieved / filteredPlans.length * 100).toFixed(1) : 0;
  const percentageColor = Number(percentage) >= 50 ? "text-green-600" : "text-red-600";
  fetchPlanMonitoring();
  fetchDepartments();
  fetchStrategicGoals();
  fetchStrategicObjectives();
  $$payload.out += `<div class="flex flex-col gap-4 p-4 container mx-auto">`;
  if (showAlert) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div${attr("class", `flex items-center p-4 rounded-lg ${stringify(alertType === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800")}`)}><span>${escape_html(alertMessage)}</span></div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"><div class="flex items-center gap-2">`;
  Notepad_text($$payload, { class: "w-8 h-8 text-primary" });
  $$payload.out += `<!----> <h1 class="text-2xl font-bold">Plans Monitoring</h1></div></div> <div class="grid grid-cols-1 md:grid-cols-4 gap-4"><div class="bg-card rounded-md shadow-sm border border-border p-4"><h3 class="text-sm font-medium text-muted-foreground">Total Plans</h3> <p class="text-4xl font-semibold mt-2">${escape_html(filteredPlans.length)}</p> <p class="text-md mt-3">`;
  if (filteredPlans.length > 0) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<span${attr("class", percentageColor)}>${escape_html(percentage)}%</span> <span class="text-gray-500 ml-1">achieved</span>`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<span class="text-gray-500">No plans available</span>`;
  }
  $$payload.out += `<!--]--></p></div> <div class="bg-card rounded-lg shadow border border-border p-4"><h3 class="text-sm font-medium text-muted-foreground">Achieved</h3> <p class="text-4xl font-semibold text-green-600 mt-2">${escape_html(chartData.achieved || 0)}</p></div> <div class="bg-card rounded-lg shadow border border-border p-4"><h3 class="text-sm font-medium text-muted-foreground">Not Achieved</h3> <p class="text-4xl font-semibold text-red-600 mt-2">${escape_html(chartData.notAchieved)}</p></div> <div class="bg-card rounded-lg shadow border border-border p-4 min-h-[240px]"><h3 class="text-sm font-medium text-muted-foreground mb-2">Achievement Rate</h3> `;
  DoughnutChart($$payload);
  $$payload.out += `<!----></div></div> <div class="flex flex-col md:flex-row gap-4 mb-2 items-center justify-between"><div class="flex flex-col md:flex-row gap-4 flex-1"><div class="relative flex-1 w-full md:max-w-[300px]">`;
  Search($$payload, {
    class: "absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground",
    size: 20
  });
  $$payload.out += `<!----> <input type="text"${attr("value", searchQuery)} placeholder="Search plans..." class="pl-10 pr-4 py-2 bg-secondary rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-ring"></div> <div class="relative"><button class="px-4 py-2 bg-secondary rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors flex items-center gap-2">${escape_html(getStatusLabel(filterStatus))} `;
  Chevron_down($$payload, { class: "w-4 h-4" });
  $$payload.out += `<!----></button> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div> <div class="relative"><button class="px-4 py-2 bg-secondary rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors flex items-center gap-2">`;
  Building_2($$payload, { class: "w-4 h-4" });
  $$payload.out += `<!----> ${escape_html("All Departments")} `;
  Chevron_down($$payload, { class: "w-4 h-4" });
  $$payload.out += `<!----></button> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div> <div class="relative"><button class="px-4 py-2 rounded-lg text-sm font-medium bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2">${escape_html("All Goals")} `;
  Chevron_down($$payload, { class: "w-4 h-4" });
  $$payload.out += `<!----></button> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div> <div class="relative"><button class="px-4 py-2 rounded-lg text-sm font-medium bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2">${escape_html("All Objectives")} `;
  Chevron_down($$payload, { class: "w-4 h-4" });
  $$payload.out += `<!----></button> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div></div> <div class="flex gap-2"><button class="flex items-center gap-2 bg-secondary text-foreground px-4 py-2 rounded-lg hover:bg-secondary/80 justify-center flex-1 md:flex-initial whitespace-nowrap">`;
  Download($$payload, { class: "w-4 h-4" });
  $$payload.out += `<!----> Export PDF</button> <button class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"${attr("disabled", isGeneratingSummary, true)}>`;
  {
    $$payload.out += "<!--[!-->";
    File_text($$payload, { class: "w-4 h-4" });
  }
  $$payload.out += `<!--]--> Generate Report</button></div></div> <div class="overflow-x-auto bg-card rounded-lg shadow border border-border">`;
  if (isLoading) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="flex items-center justify-center p-8">`;
    Loader_circle($$payload, { class: "w-6 h-6 animate-spin text-primary" });
    $$payload.out += `<!----> <span class="ml-2 text-muted-foreground">Loading plans...</span></div>`;
  } else {
    $$payload.out += "<!--[!-->";
    if (filteredPlans.length > 0) {
      $$payload.out += "<!--[-->";
      const each_array_4 = ensure_array_like(paginatedPlans);
      $$payload.out += `<table class="min-w-full table-auto"><thead class="bg-muted/50"><tr><th class="px-4 py-3 text-left">Department</th><th class="px-4 py-3 text-left">Action Plans</th><th class="px-4 py-3 text-left">KPI</th><th class="px-4 py-3 text-left">Target Output</th><th class="px-4 py-3 text-left">Actions Taken</th><th class="px-4 py-3 text-left">Statement</th><th class="px-4 py-3 text-left">Status</th><th class="px-4 py-3 text-left">Completed</th></tr></thead><tbody class="divide-y divide-border"><!--[-->`;
      for (let $$index_4 = 0, $$length = each_array_4.length; $$index_4 < $$length; $$index_4++) {
        let plan = each_array_4[$$index_4];
        $$payload.out += `<tr class="hover:bg-muted/50"><td class="px-4 py-3">${escape_html(plan.department)}</td><td class="px-4 py-3">${escape_html(plan.actions_taken)}</td><td class="px-4 py-3">${escape_html(plan.kpi)}</td><td class="px-4 py-3">${escape_html(plan.target_output)}</td><td class="px-4 py-3">${escape_html(plan.evaluation || "Pending")}</td><td class="px-4 py-3">${escape_html(plan.statement || "Pending")}</td><td class="px-4 py-3"><span${attr("class", `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stringify(plan.is_accomplished ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800")}`)}>${escape_html(plan.is_accomplished ? "Achieved" : "Not Achieved")}</span></td><td class="px-4 py-3 text-muted-foreground">${escape_html(plan.time_completed ? new Date(plan.time_completed).toLocaleString() : "N/A")}</td></tr>`;
      }
      $$payload.out += `<!--]--></tbody></table> <div class="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-muted/50 border-t border-border"><div class="text-sm text-muted-foreground">Showing ${escape_html((currentPage - 1) * itemsPerPage + 1)} to ${escape_html(Math.min(currentPage * itemsPerPage, filteredPlans.length))} of ${escape_html(filteredPlans.length)} results</div> <div class="flex flex-col sm:flex-row items-center gap-4"><select class="bg-secondary rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-ring"><option${attr("value", 5)}>5 per page</option><option${attr("value", 10)}>10 per page</option><option${attr("value", 25)}>25 per page</option></select> <div class="flex gap-2"><button${attr("disabled", currentPage === 1, true)} class="px-3 py-1 rounded-lg border border-border hover:bg-muted disabled:opacity-50 transition-colors">Previous</button> <button${attr("disabled", currentPage === totalPages, true)} class="px-3 py-1 rounded-lg border border-border hover:bg-muted disabled:opacity-50 transition-colors">Next</button></div></div></div>`;
    } else {
      $$payload.out += "<!--[!-->";
      $$payload.out += `<div class="text-center p-8 text-muted-foreground">No plans found matching your criteria.</div>`;
    }
    $$payload.out += `<!--]-->`;
  }
  $$payload.out += `<!--]--></div></div>`;
  pop();
}
function DeptPlansMonitoring($$payload, $$props) {
  push();
  let searchTerm = "";
  let sortBy = "strategic_goal_name";
  let selectedGoal = "all";
  let actionPlans = [];
  let currentPage = 1;
  let itemsPerPage = 5;
  const uniqueGoals = [
    "all",
    ...new Set(actionPlans.map((plan) => plan.strategic_goal_name))
  ];
  const filteredPlans = actionPlans.filter((plan) => {
    const matchesSearch = plan.strategic_goal_name.toLowerCase().includes(searchTerm.toLowerCase()) || plan.objective_name.toLowerCase().includes(searchTerm.toLowerCase()) || plan.actions_taken.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = true;
    const matchesGoal = selectedGoal === "all";
    return matchesSearch && matchesStatus && matchesGoal;
  });
  filteredPlans.sort((a, b) => {
    const compareValue = 1;
    return a[sortBy] > b[sortBy] ? compareValue : -compareValue;
  }).slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const each_array = ensure_array_like(uniqueGoals);
  $$payload.out += `<div class="flex flex-col gap-4 p-4 container mx-auto min-h-screen bg-background text-foreground"><div class="flex flex-col gap-4"><div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"><div class="flex items-center gap-2">`;
  Notepad_text($$payload, { class: "w-8 h-8 text-primary" });
  $$payload.out += `<!----> <h1 class="text-2xl font-bold">Plans Monitoring</h1></div></div> <div class="flex flex-col sm:flex-row gap-4"><div class="relative flex-1 sm:flex-none max-w-[300px]">`;
  Search($$payload, {
    class: "absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground",
    size: 20
  });
  $$payload.out += `<!----> <input type="search"${attr("value", searchTerm)} placeholder="Search plans..." class="pl-10 pr-4 py-2 bg-secondary rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-ring"></div> <select class="bg-secondary rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring w-full sm:w-[200px]"><option value="all">All Status</option><option value="achieved">Achieved</option><option value="pending">Pending</option></select> <select class="bg-secondary rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring w-full sm:w-[200px]"><!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let goal = each_array[$$index];
    $$payload.out += `<option${attr("value", goal)}>${escape_html(goal === "all" ? "All Goals" : goal)}</option>`;
  }
  $$payload.out += `<!--]--></select></div></div> <div class="flex-1">`;
  {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="flex items-center justify-center min-h-screen"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>`;
  }
  $$payload.out += `<!--]--></div> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div>`;
  pop();
}
export {
  AdminPlansMonitoring as A,
  Circle_alert as C,
  DeptPlansMonitoring as D,
  Monitor as M
};
