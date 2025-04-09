"use server";

import { createOpenAI } from "@ai-sdk/openai";
import { generateText, streamText, tool } from "ai";
import { z } from "zod";
import { getNumberOfUserTripsAction } from "@/app/actions";

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateAnswer(prompt: string) {
  try {
    const { text: answer } = await generateText({
      model: openai.chat("gpt-4o-mini"),
      tools: {
        calculate: tool({
          description:
            "A tool to get the total number of trips the" +
            "user has and the information of each trip",

          parameters: z.object({ expression: z.string() }),
          execute: async () => getNumberOfUserTripsAction(),
        }),
      },
      maxSteps: 5,
      system:
        "You are personal assistance for corporate and individual sales people. " +
        "Reason step by step. " +
        "Use the server actions to get the information. " +
        "When you give the final answer, " +
        "provide a clear answer for the user to easily understand.",

      prompt: prompt,
    });
    return answer;
  } catch (error) {
    return "Lo siento, hubo un error al procesar tu solicitud.";
  }
}

export async function testAnswer(prompt: string) {
  // Simulate 2 second delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return (
    "This is an extensive test answer that demonstrates a longer response format. " +
    "I am providing multiple paragraphs of text to show how a lengthy response would look. " +
    "This could be useful for testing text formatting, display handling, and UI components. " +
    "\n\n" +
    "The purpose of this test answer is to simulate real-world scenarios where responses " +
    "might contain substantial amounts of information, detailed explanations, or complex " +
    "instructions that span multiple lines and paragraphs. "
  );
}
