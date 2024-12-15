import { I as fallback, E as escape_html, J as attr, K as bind_props, C as pop, A as push, Q as ensure_array_like } from "../../../../../../chunks/index.js";
import "../../../../../../chunks/client.js";
import { s as supabase } from "../../../../../../chunks/supabaseClient.js";
import { T as Trash_2 } from "../../../../../../chunks/trash-2.js";
import { P as Plus } from "../../../../../../chunks/plus.js";
function PlanCard($$payload, $$props) {
  push();
  let data = $$props["data"];
  let planNumber = $$props["planNumber"];
  let onSave = fallback($$props["onSave"], () => {
  });
  let onEdit = fallback($$props["onEdit"], () => {
  });
  let onDelete = fallback($$props["onDelete"], () => {
  });
  $$payload.out += `<div class="bg-card rounded-lg p-4 border border-border hover:shadow-lg transition-shadow"><div class="flex justify-between items-start mb-4"><h3 class="text-lg font-semibold">Plan ${escape_html(planNumber)}</h3> <div class="flex gap-2">`;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <button class="text-red-500 hover:text-red-700 transition-colors p-2">`;
  Trash_2($$payload, { class: "w-5 h-5" });
  $$payload.out += `<!----></button></div></div> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div class="space-y-4"><div><label class="block text-sm font-medium mb-1">Action Plan</label> <textarea class="w-full h-24 px-3 py-2 bg-card rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/50">`;
  const $$body = escape_html(data.actions_taken);
  if ($$body) {
    $$payload.out += `${$$body}`;
  }
  $$payload.out += `</textarea></div> <div><label class="block text-sm font-medium mb-1">KPI</label> <textarea class="w-full h-24 px-3 py-2 bg-card rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/50">`;
  const $$body_1 = escape_html(data.kpi);
  if ($$body_1) {
    $$payload.out += `${$$body_1}`;
  }
  $$payload.out += `</textarea></div></div> <div class="space-y-4"><div><label class="block text-sm font-medium mb-1">Target Output</label> <textarea class="w-full h-24 px-3 py-2 bg-card rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/50">`;
  const $$body_2 = escape_html(data.target_output);
  if ($$body_2) {
    $$payload.out += `${$$body_2}`;
  }
  $$payload.out += `</textarea></div> <div><label class="block text-sm font-medium mb-1">Budget</label> <input type="number"${attr("value", data.budget)} class="w-full px-3 py-2 bg-card rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"></div> <div><label class="block text-sm font-medium mb-1">Key Person Responsible</label> <textarea class="w-full h-24 px-3 py-2 bg-card rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/50">`;
  const $$body_3 = escape_html(data.key_person_responsible);
  if ($$body_3) {
    $$payload.out += `${$$body_3}`;
  }
  $$payload.out += `</textarea></div></div></div></div>`;
  bind_props($$props, { data, planNumber, onSave, onEdit, onDelete });
  pop();
}
function _page($$payload, $$props) {
  push();
  let actionPlans = [];
  let newPlans = [];
  let profile = null;
  let objective_id = null;
  let successMessage = null;
  let errorMessage = null;
  const fetchActionPlans = async () => {
    {
      errorMessage = "Objective ID or Department ID is missing.";
      console.error("Missing IDs: ", {
        objective_id,
        department_id: profile?.department_id
      });
      return;
    }
  };
  const handleEditPlan = (index, field, value, isNew) => {
    if (isNew) {
      newPlans[index] = { ...newPlans[index], [field]: value };
    } else {
      actionPlans[index] = {
        ...actionPlans[index],
        [field]: value,
        isEdited: true
      };
    }
  };
  const deletePlan = async (id) => {
    try {
      const { error } = await supabase.from("action_plans").delete().eq("id", id);
      if (error) throw error;
      await fetchActionPlans();
      successMessage = "Plan deleted successfully!";
    } catch (error) {
      console.error("Error deleting plan:", error);
      errorMessage = "Failed to delete plan.";
    }
  };
  const deleteNewPlan = (index) => {
    newPlans = newPlans.filter((_, i) => i !== index);
  };
  const saveIndividualPlan = async (index, isNew) => {
    try {
      let plan;
      if (isNew) {
        plan = newPlans[index];
      } else {
        plan = actionPlans[index];
      }
      const { isEdited, isNew: _, ...sanitizedPlan } = plan;
      const { error } = await supabase.from("action_plans").upsert(sanitizedPlan, { onConflict: "id" });
      if (error) throw error;
      if (isNew) {
        newPlans = newPlans.filter((_2, i) => i !== index);
        await fetchActionPlans();
      } else {
        actionPlans[index].isEdited = false;
      }
      successMessage = "Plan saved successfully!";
    } catch (error) {
      console.error("Error saving plan:", error);
      errorMessage = "Failed to save plan.";
    }
  };
  $$payload.out += `<div class="flex flex-col gap-4 p-4 container mx-auto">`;
  if (successMessage) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="p-4 rounded-lg bg-green-100 text-green-800">${escape_html(successMessage)}</div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> `;
  if (errorMessage) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="p-4 rounded-lg bg-red-100 text-red-800">${escape_html(errorMessage)}</div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <div class="bg-card rounded-lg shadow border border-border p-6"><h2 class="text-xl font-semibold mb-4">Action Plans</h2> `;
  {
    $$payload.out += "<!--[!-->";
    const each_array = ensure_array_like(actionPlans);
    const each_array_1 = ensure_array_like(newPlans);
    $$payload.out += `<div class="space-y-4"><!--[-->`;
    for (let index = 0, $$length = each_array.length; index < $$length; index++) {
      let plan = each_array[index];
      PlanCard($$payload, {
        data: plan,
        planNumber: index + 1,
        onEdit: (field, value) => handleEditPlan(index, field, value, false),
        onSave: () => saveIndividualPlan(index, false),
        onDelete: () => deletePlan(plan.id)
      });
    }
    $$payload.out += `<!--]--> <!--[-->`;
    for (let index = 0, $$length = each_array_1.length; index < $$length; index++) {
      let newPlan = each_array_1[index];
      PlanCard($$payload, {
        data: newPlan,
        planNumber: actionPlans.length + index + 1,
        onEdit: (field, value) => handleEditPlan(index, field, value, true),
        onSave: () => saveIndividualPlan(index, true),
        onDelete: () => deleteNewPlan(index)
      });
    }
    $$payload.out += `<!--]--></div> <div class="flex justify-end mt-4 gap-4"><button class="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">`;
    Plus($$payload, { class: "w-4 h-4 mr-2" });
    $$payload.out += `<!----> Add New Plan</button></div>`;
  }
  $$payload.out += `<!--]--></div></div>`;
  pop();
}
export {
  _page as default
};
