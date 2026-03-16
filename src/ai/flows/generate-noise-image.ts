
'use server';

/**
 * @fileOverview Generates an image based on a noise type.
 *
 * - generateNoiseImage - A function that creates an image for a given noise.
 * - GenerateNoiseImageInput - The input type for the function.
 * - GenerateNoiseImageOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import { NoiseClassification } from '@/context/noise-context';
import {z} from 'zod';

const GenerateNoiseImageInputSchema = z.object({
  classification: z.object({
    name: z.string(),
    description: z.string(),
    isHuman: z.boolean(),
  })
});
export type GenerateNoiseImageInput = z.infer<typeof GenerateNoiseImageInputSchema>;

const GenerateNoiseImageOutputSchema = z.object({
  imageDataUri: z.string().describe("The generated image as a data URI or URL."),
});
export type GenerateNoiseImageOutput = z.infer<typeof GenerateNoiseImageOutputSchema>;

export async function generateNoiseImage(input: GenerateNoiseImageInput): Promise<GenerateNoiseImageOutput> {
  return generateNoiseImageFlow(input);
}

const generateNoiseImageFlow = ai.defineFlow(
  {
    name: 'generateNoiseImageFlow',
    inputSchema: GenerateNoiseImageInputSchema,
    outputSchema: GenerateNoiseImageOutputSchema,
  },
  async ({ classification }) => {
    // This flow previously used a billed API (Imagen) which caused errors for non-billed users.
    // It has been updated to use placeholder images instead,
    // with a special case for human-generated sounds.
    
    if (classification.isHuman) {
      return { imageDataUri: "/human-chatter.jpg" };
    }

    const seed = classification.name.replace(/\s+/g, '-').toLowerCase();
    const imageUrl = `https://picsum.photos/seed/${seed}/400/400`;

    return { imageDataUri: imageUrl };
  }
);
