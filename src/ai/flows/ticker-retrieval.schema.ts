/**
 * @fileOverview Zod schemas and TypeScript types for the ticker retrieval flow.
 *
 * - TickerInputSchema - The Zod schema for the input of the getTickerSymbol function.
 * - TickerInput - The TypeScript type for the input.
 * - TickerOutputSchema - The Zod schema for the output of the getTickerSymbol function.
 * - TickerOutput - The TypeScript type for the output.
 */

import { z } from 'zod';

export const TickerInputSchema = z.object({
  query: z.string().describe('The company name or ticker symbol to look up.'),
});
export type TickerInput = z.infer<typeof TickerInputSchema>;

export const TickerOutputSchema = z.object({
  ticker: z.string().describe('The official stock market ticker symbol.'),
});
export type TickerOutput = z.infer<typeof TickerOutputSchema>;
