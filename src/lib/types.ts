import * as z from 'zod';

export const Industries = ['FinTech', 'HealthTech', 'General Startup'] as const;
export type Industry = typeof Industries[number];

export const BasicDetailsSchema = z.object({
  startupName: z.string().min(2, "Startup name must be at least 2 characters."),
  email: z.string().email(),
  yearOfRegistration: z.coerce.number().min(1900, "Invalid year.").max(new Date().getFullYear(), "Year cannot be in the future."),
  numberOfEmployees: z.coerce.number().min(1, "There must be at least one employee."),
  field: z.enum(Industries),
});

export type BasicDetails = z.infer<typeof BasicDetailsSchema>;

export type DocumentType = 
    | 'registrationCertificate'
    | 'rbiLicense'
    | 'balanceSheet'
    | 'clinicalLicense'
    | 'employeeRecords'
    | 'employeeProof';

export const DocumentLabels: Record<DocumentType, string> = {
    registrationCertificate: 'Registration Certificate',
    rbiLicense: 'RBI License',
    balanceSheet: 'Balance Sheet',
    clinicalLicense: 'Clinical License',
    employeeRecords: 'Employee Records',
    employeeProof: 'Employee Proof',
}

export const IndustryDocuments: Record<Industry, DocumentType[]> = {
    'FinTech': ['registrationCertificate', 'rbiLicense', 'balanceSheet'],
    'HealthTech': ['registrationCertificate', 'clinicalLicense', 'employeeRecords'],
    'General Startup': ['registrationCertificate', 'balanceSheet', 'employeeProof'],
};

export type Documents = Partial<Record<DocumentType, File>>;
