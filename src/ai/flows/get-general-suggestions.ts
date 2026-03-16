
'use server';

/**
 * @fileOverview Generates general health suggestions for living in a noisy environment.
 *
 * - getGeneralSuggestions - A function that provides general health tips.
 * - GetGeneralSuggestionsOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import { GetHealthSuggestionsOutputSchema } from '../schemas/suggestion-schema';

export type GetGeneralSuggestionsOutput = z.infer<typeof GetHealthSuggestionsOutputSchema>;

export async function getGeneralSuggestions(): Promise<GetGeneralSuggestionsOutput> {
  return getGeneralSuggestionsFlow();
}

const prompt = ai.definePrompt({
  name: 'getGeneralSuggestionsPrompt',
  output: {schema: GetHealthSuggestionsOutputSchema},
  prompt: `
    You are a public health expert specializing in urban well-being.
    Provide a short, actionable list of 3-4 general health suggestions for someone living in a typical city environment.
    Focus on practical, evergreen advice for well-being, stress reduction, and creating a peaceful home environment.
    These are general tips, not responses to a specific loud noise event.
    For each suggestion, provide a short title and a one-sentence description.
  `,
});

const getGeneralSuggestionsFlow = ai.defineFlow(
  {
    name: 'getGeneralSuggestionsFlow',
    outputSchema: GetHealthSuggestionsOutputSchema,
  },
  async () => {
    const {output} = await prompt();
    return output!;
  }
);
