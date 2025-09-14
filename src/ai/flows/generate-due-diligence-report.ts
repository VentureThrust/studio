'use server';
/**
 * @fileOverview Generates an initial draft of a due diligence report from startup data and documents.
 *
 * - generateDueDiligenceReport - A function that generates the due diligence report.
 * - GenerateDueDiligenceReportInput - The input type for the generateDueDiligenceReport function.
 * - GenerateDueDiligenceReportOutput - The return type for the generateDueDiligenceReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDueDiligenceReportInputSchema = z.object({
  startupName: z.string().describe('The name of the startup.'),
  email: z.string().email().describe('The email address of the startup.'),
  yearOfRegistration: z.number().describe('The year the startup was registered.'),
  numberOfEmployees: z.number().describe('The number of employees in the startup.'),
  field: z.string().describe('The field or industry of the startup.'),
  registrationCertificate: z
    .string()
    .describe(
      "The registration certificate of the startup, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    )
    .optional(),
  rbiLicense: z
    .string()
    .describe(
      "The RBI license of the startup, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    )
    .optional(),
  clinicalLicense: z
    .string()
    .describe(
      "The clinical license of the startup, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    )
    .optional(),
  balanceSheet: z
    .string()
    .describe(
      "The balance sheet of the startup, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    )
    .optional(),
  employeeRecords: z
    .string()
    .describe(
      "The employee records of the startup, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    )
    .optional(),
  employeeProof: z
    .string()
    .describe(
      "Proof of employees of the startup, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    )
    .optional(),
});
export type GenerateDueDiligenceReportInput = z.infer<typeof GenerateDueDiligenceReportInputSchema>;

const GenerateDueDiligenceReportOutputSchema = z.object({
  report: z.string().describe('The generated due diligence report.'),
});
export type GenerateDueDiligenceReportOutput = z.infer<typeof GenerateDueDiligenceReportOutputSchema>;

export async function generateDueDiligenceReport(
  input: GenerateDueDiligenceReportInput
): Promise<GenerateDueDiligenceReportOutput> {
  return generateDueDiligenceReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDueDiligenceReportPrompt',
  input: {schema: GenerateDueDiligenceReportInputSchema},
  output: {schema: GenerateDueDiligenceReportOutputSchema},
  prompt: `You are an AI assistant that specializes in generating initial drafts of due diligence reports for startups.

  Based on the information provided, generate a comprehensive report.

  Startup Name: {{{startupName}}}
  Email: {{{email}}}
  Year of Registration: {{{yearOfRegistration}}}
  Number of Employees: {{{numberOfEmployees}}}
  Field/Industry: {{{field}}}

  {{#if registrationCertificate}}
  Registration Certificate: {{media url=registrationCertificate}}
  {{/if}}
  {{#if rbiLicense}}
  RBI License: {{media url=rbiLicense}}
  {{/if}}
  {{#if clinicalLicense}}
  Clinical License: {{media url=clinicalLicense}}
  {{/if}}
  {{#if balanceSheet}}
  Balance Sheet: {{media url=balanceSheet}}
  {{/if}}
  {{#if employeeRecords}}
  Employee Records: {{media url=employeeRecords}}
  {{/if}}
   {{#if employeeProof}}
  Employee Proof: {{media url=employeeProof}}
  {{/if}}

  Report:`,
});

const generateDueDiligenceReportFlow = ai.defineFlow(
  {
    name: 'generateDueDiligenceReportFlow',
    inputSchema: GenerateDueDiligenceReportInputSchema,
    outputSchema: GenerateDueDiligenceReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
