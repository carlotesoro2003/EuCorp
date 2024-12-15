import OpenAI from "openai";
import { j as json } from "../../../../../chunks/index2.js";
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});
const POST = async ({ request }) => {
  try {
    const { target, evaluation } = await request.json();
    if (!target || !evaluation) {
      return json(
        { error: "Target and evaluation are required." },
        { status: 400 }
      );
    }
    const messages = [
      {
        role: "user",
        content: `The target is: "${target}". Based on the following evaluation: "${evaluation}", analyze whether the goal has been achieved. Your explanation must:
1. Ensure all provided data is evaluated strictly against the target criteria, avoiding assumptions or misinterpretations.
2. Verify that each element of the target (quantitative and qualitative) is addressed explicitly, and confirm whether the data satisfies, exceeds, or falls short of the requirements.
3. Highlight any inconsistencies, missing details, or misalignments between the evaluation, the data, and the target criteria.
4. Avoid introducing unrelated information or interpretations beyond what is provided in the target or data.
5. Be meticulous with typographical errors, grammar, and punctuation.
6. make it brief and direct to the point.
7. If the quantitative value exceeds the target, consider it as achieved. If it falls short, consider it as not achieved. If it is equal, consider it as achieved. 


Respond in a concise, logical paragraph that directly analyzes the data and evaluation. Do not use phrases such as "yes" or "no" to start the explanation. Avoid structured formats like bullet points, and focus solely on the provided details to ensure clarity and accuracy.`
      }
    ];
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages,
      temperature: 0.26,
      max_tokens: 2048,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0
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
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
};
export {
  POST
};
