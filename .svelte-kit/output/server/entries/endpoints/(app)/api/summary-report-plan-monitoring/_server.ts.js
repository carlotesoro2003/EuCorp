import { GoogleGenerativeAI } from "@google/generative-ai";
import { j as json } from "../../../../../chunks/index2.js";
const API_KEY = process.env.VITE_GEMINI_API_KEY || "";
const client = new GoogleGenerativeAI(API_KEY);
const POST = async ({ request }) => {
  try {
    const { plans } = await request.json();
    if (!plans || !Array.isArray(plans) || plans.length === 0) {
      return json(
        { error: "Plans data is required and must be a non-empty array." },
        { status: 400 }
      );
    }
    const formattedPlans = plans.map(
      (plan) => `The plan involved the following action: "${plan.actions_taken}". The key performance indicator (KPI) for this plan was "${plan.kpi}". The plan was ${plan.is_accomplished ? "successfully achieved" : "not achieved"}, with the following evaluation: "${plan.evaluation || "Pending evaluation"}".`
    ).join(" ");
    const prompt = `
            You are a professional analyst tasked with creating a summary report based on the provided action plans. Here is the data for the action plans:
            
${formattedPlans}

            Please write a detailed, cohesive, and professional narrative summarizing the overall performance of the plans. Highlight key achievements, areas needing improvement, and overall insights in essay format for stakeholders. 
            only use paragaph form, avoid bullet points and dont use unnecessary asterisks, dont start the report with conclusion words such as overall etc. and ensure the tone is formal and professional.
        `;
    const model = client.getGenerativeModel({ model: "gemini-pro" });
    const response = await model.generateContent(prompt);
    const summaryReport = response.response?.text?.();
    if (!summaryReport) {
      throw new Error("No response received from the AI model.");
    }
    return json({ summaryReport });
  } catch (error) {
    console.error("[ERROR] Error generating summary report:", error);
    return json(
      { error: "Internal Server Error", details: error.message || String(error) },
      { status: 500 }
    );
  }
};
export {
  POST
};
