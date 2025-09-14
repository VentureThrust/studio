'use server';

/**
 * @fileOverview Summarizes uploaded documents using GenAI.
 *
 * - summarizeDocuments - A function that summarizes a list of document URLs.
 * - SummarizeDocumentsInput - The input type for the summarizeDocuments function.
 * - SummarizeDocumentsOutput - The return type for the summarizeDocuments function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeDocumentsInputSchema = z.object({
  documentUrls: z
    .array(z.string())
    .describe('List of document URLs to summarize.'),
});
export type SummarizeDocumentsInput = z.infer<typeof SummarizeDocumentsInputSchema>;

const SummarizeDocumentsOutputSchema = z.object({
  summary: z.string().describe('A summary of the documents.'),
  progress: z.string().describe('Progress of the summarization task.'),
});
export type SummarizeDocumentsOutput = z.infer<typeof SummarizeDocumentsOutputSchema>;

export async function summarizeDocuments(input: SummarizeDocumentsInput): Promise<SummarizeDocumentsOutput> {
  return summarizeDocumentsFlow(input);
}

const summarizeDocumentsPrompt = ai.definePrompt({
  name: 'summarizeDocumentsPrompt',
  input: {schema: SummarizeDocumentsInputSchema},
  output: {schema: SummarizeDocumentsOutputSchema},
  prompt: `You are an expert summarizer. Please summarize the following documents:\n\n{
    {#each documentUrls}}
      Document URL: {{{this}}}\n
    {{/each}}
}`,
});

const summarizeDocumentsFlow = ai.defineFlow(
  {
    name: 'summarizeDocumentsFlow',
    inputSchema: SummarizeDocumentsInputSchema,
    outputSchema: SummarizeDocumentsOutputSchema,
  },
  async input => {
    const {output} = await summarizeDocumentsPrompt(input);
    return {
      summary: output!.summary,
      progress: 'Generated a short summary of the uploaded documents.',
    };
  }
);
