'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/classify-noise.ts';
import '@/ai/flows/get-health-suggestions.ts';
import '@/ai/flows/get-general-suggestions.ts';
import '@/ai/flows/generate-noise-image.ts';
