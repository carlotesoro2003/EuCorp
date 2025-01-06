import OpenAI from "openai";
import { json } from "@sveltejs/kit";


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


export const POST = async ({ request }) => {
    try {
      const { target, evaluation, strategicGoal, strategicObjective, actionPlan, kpi } = await request.json();
  
      if (!target || !evaluation || !strategicGoal || !strategicObjective || !actionPlan || !kpi) {
        return json(
          { error: "Target, evaluation, strategic goal, strategic objective, action plan, and KPI are required." },
          { status: 400 }
        );
      }
  
      const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
        {
          role: "user" as const,
          content: `
  The analysis should consider the following information:
  
  Strategic Goal: "${strategicGoal}"
  Strategic Objective: "${strategicObjective}"
  Action Plan: "${actionPlan}"
  KPI: "${kpi}"
  Target: "${target}"
  Evaluation: "${evaluation}"
  
  Analyze whether the goal has been achieved based on the above information. Your explanation must:
  1. Evaluate how well the action plan aligns with the strategic goal and objective, as well as its contribution to achieving the KPI.
  2. Explicitly compare the evaluation data to the target and determine if the target has been satisfied, exceeded, or fallen short.
  3. Ensure that the analysis identifies any gaps, inconsistencies, or areas of improvement.
  4. Avoid introducing unrelated details or assumptions beyond what is provided.
  5. Make the explanation concise, logical, and strictly based on the provided information.
  6. Clearly determine if the goal is achieved or not based on whether the quantitative and qualitative elements of the target are satisfied.
  7. Make the statement as brief as possible. A good 2-3 sentence response is ideal.
  
  Respond in a single, concise paragraph. Avoid starting with "yes" or "no" and ensure the response focuses on evaluating all provided elements comprehensively and accurately.
          `,
        },
      ];
  
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages,
        temperature: 0.26,
        max_tokens: 2048,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });
  
      if (!response.choices || !response.choices.length || !response.choices[0].message.content) {
        return json(
          { error: "No response received from the AI model." },
          { status: 500 }
        );
      }
  
      const aiEvaluation = response.choices[0].message.content;
  
      return json({ aiEvaluation });
    } catch (error) {
      console.error("Error during chat session:", error);
      return json(
        { error: "Internal Server Error", details: error instanceof Error ? error.message : "Unknown error occurred" },
        { status: 500 }
      );
    }
  };
  