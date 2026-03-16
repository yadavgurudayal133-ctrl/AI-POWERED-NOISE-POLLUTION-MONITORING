import {z} from 'zod';

export const GetHealthSuggestionsOutputSchema = z.object({
  suggestions: z.array(z.object({
    title: z.string().describe('A short, catchy title for the suggestion.'),
    description: z.string().describe('A brief explanation of the health suggestion.'),
  })).describe('A list of health suggestions to mitigate the effects of noise pollution.'),
});
