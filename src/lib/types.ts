import * as z from 'zod';

export const Industries = [
    'FinTech',
    'HealthTech',
    'EdTech',
    'AgriTech',
    'E-commerce',
    'SaaS',
    'AI/ML',
    'Blockchain',
    'CleanTech',
    'Gaming',
    'IoT',
    'Robotics',
    'Cybersecurity',
    'Biotech',
    'Real Estate Tech',
    'FoodTech',
    'TravelTech',
    'Media/Entertainment',
    'Social Media',
    'General Startup'
] as const;
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
    'EdTech': ['registrationCertificate', 'balanceSheet', 'employeeProof'],
    'AgriTech': ['registrationCertificate', 'balanceSheet', 'employeeProof'],
    'E-commerce': ['registrationCertificate', 'balanceSheet', 'employeeProof'],
    'SaaS': ['registrationCertificate', 'balanceSheet', 'employeeProof'],
    'AI/ML': ['registrationCertificate', 'balanceSheet', 'employeeProof'],
    'Blockchain': ['registrationCertificate', 'balanceSheet', 'employeeProof'],
    'CleanTech': ['registrationCertificate', 'balanceSheet', 'employeeProof'],
    'Gaming': ['registrationCertificate', 'balanceSheet', 'employeeProof'],
    'IoT': ['registrationCertificate', 'balanceSheet', 'employeeProof'],
    'Robotics': ['registrationCertificate', 'balanceSheet', 'employeeProof'],
    'Cybersecurity': ['registrationCertificate', 'balanceSheet', 'employeeProof'],
    'Biotech': ['registrationCertificate', 'clinicalLicense', 'employeeRecords'],
    'Real Estate Tech': ['registrationCertificate', 'balanceSheet', 'employeeProof'],
    'FoodTech': ['registrationCertificate', 'balanceSheet', 'employeeProof'],
    'TravelTech': ['registrationCertificate', 'balanceSheet', 'employeeProof'],
    'Media/Entertainment': ['registrationCertificate', 'balanceSheet', 'employeeProof'],
    'Social Media': ['registrationCertificate', 'balanceSheet', 'employeeProof'],
    'General Startup': ['registrationCertificate', 'balanceSheet', 'employeeProof'],
};

export type Documents = Partial<Record<DocumentType, File>>;
