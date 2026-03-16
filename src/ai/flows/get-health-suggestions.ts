
'use server';

/**
 * @fileOverview Generates health suggestions based on noise pollution data.
 *
 * - getHealthSuggestions - A function that provides health tips.
 * - GetHealthSuggestionsInput - The input type for the function.
 * - GetHealthSuggestionsOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import { GetHealthSuggestionsOutputSchema } from '../schemas/suggestion-schema';

const GetHealthSuggestionsInputSchema = z.object({
  noiseType: z.string().describe('The type of noise detected (e.g., Traffic, Construction).'),
  noiseLevel: z.number().describe('The noise level in decibels (dB).'),
});
export type GetHealthSuggestionsInput = z.infer<typeof GetHealthSuggestionsInputSchema>;

export type GetHealthSuggestionsOutput = z.infer<typeof GetHealthSuggestionsOutputSchema>;

export async function getHealthSuggestions(input: GetHealthSuggestionsInput): Promise<GetHealthSuggestionsOutput> {
  return getHealthSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getHealthSuggestionsPrompt',
  input: {schema: GetHealthSuggestionsInputSchema},
  output: {schema: GetHealthSuggestionsOutputSchema},
  prompt: `
    You are an audiologist and public health expert specializing in the effects of noise pollution.
    A user is being exposed to high levels of noise.

    Noise Type: {{{noiseType}}}
    Noise Level: {{{noiseLevel}}} dB

    Based on this information, provide a short, actionable list of 3-4 health suggestions to help them mitigate the potential health risks.
    Focus on practical, immediate actions they can take. Frame the suggestions in a positive and helpful tone.
    For each suggestion, provide a short title and a one-sentence description.
  `,
});

const getHealthSuggestionsFlow = ai.defineFlow(
  {
    name: 'getHealthSuggestionsFlow',
    inputSchema: GetHealthSuggestionsInputSchema,
    outputSchema: GetHealthSuggestionsOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
