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
  | 'employeeProof'
  | 'articlesOfIncorporation'
  | 'businessPlan'
  | 'financialStatements'
  | 'taxReturns'
  | 'intellectualProperty'
  | 'shareholderAgreement'
  | 'customerContracts'
  | 'vendorContracts'
  | 'insurancePolicies'
  | 'capTable';

export const DocumentLabels: Record<string, string> = {
    registrationCertificate: 'Registration Certificate',
    rbiLicense: 'RBI License',
    balanceSheet: 'Balance Sheet',
    clinicalLicense: 'Clinical License',
    employeeRecords: 'Employee Records',
    employeeProof: 'Employee Proof',
    articlesOfIncorporation: 'Articles of Incorporation',
    businessPlan: 'Business Plan',
    financialStatements: 'Financial Statements (3 years)',
    taxReturns: 'Tax Returns (3 years)',
    intellectualProperty: 'IP Agreements/Patents',
    shareholderAgreement: 'Shareholder Agreement',
    customerContracts: 'Sample Customer Contracts',
    vendorContracts: 'Sample Vendor Contracts',
    insurancePolicies: 'Insurance Policies',
    capTable: 'Capitalization Table'
}

const standardDocs: DocumentType[] = [
    'registrationCertificate', 
    'balanceSheet', 
    'employeeProof', 
    'articlesOfIncorporation',
    'businessPlan',
    'financialStatements',
    'taxReturns',
    'shareholderAgreement',
    'insurancePolicies',
    'capTable'
];


export const IndustryDocuments: Record<Industry, DocumentType[]> = {
    'FinTech': ['registrationCertificate', 'rbiLicense', 'balanceSheet', 'financialStatements', 'taxReturns', 'cybersecurity', 'businessPlan', 'capTable', 'shareholderAgreement', 'insurancePolicies', 'customerContracts'],
    'HealthTech': ['registrationCertificate', 'clinicalLicense', 'employeeRecords', 'balanceSheet', 'financialStatements', 'taxReturns', 'businessPlan', 'capTable', 'shareholderAgreement', 'insurancePolicies', 'intellectualProperty'],
    'Biotech': ['registrationCertificate', 'clinicalLicense', 'employeeRecords', 'balanceSheet', 'financialStatements', 'taxReturns', 'businessPlan', 'capTable', 'shareholderAgreement', 'insurancePolicies', 'intellectualProperty'],
    'EdTech': standardDocs,
    'AgriTech': standardDocs,
    'E-commerce': standardDocs,
    'SaaS': standardDocs,
    'AI/ML': [...standardDocs, 'intellectualProperty'],
    'Blockchain': [...standardDocs, 'intellectualProperty'],
    'CleanTech': standardDocs,
    'Gaming': [...standardDocs, 'intellectualProperty'],
    'IoT': [...standardDocs, 'intellectualProperty'],
    'Robotics': [...standardDocs, 'intellectualProperty'],
    'Cybersecurity': [...standardDocs, 'intellectualProperty'],
    'Real Estate Tech': standardDocs,
    'FoodTech': standardDocs,
    'TravelTech': standardDocs,
    'Media/Entertainment': [...standardDocs, 'intellectualProperty'],
    'Social Media': standardDocs,
    'General Startup': standardDocs,
};

export type Documents = Partial<Record<string, File>>;