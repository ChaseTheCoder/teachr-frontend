import { openai } from "../../../../../utils/openai";

export async function lessonAi(prompt: string) {
  const promptResponse = await openai.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'gpt-3.5-turbo-0125',
  });
  return promptResponse.choices[0].message.content;
}