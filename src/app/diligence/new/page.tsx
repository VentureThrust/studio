'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BasicDetails, Documents } from '@/lib/types';
import BasicDetailsForm from './_components/basic-details-form';
import DocumentUploadForm from './_components/document-upload-form';
import ReviewStep from './_components/review-step';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { submitDiligenceReport } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function NewDiligencePage() {
    const router = useRouter();
    const { toast } = useToast();

    const [step, setStep] = useState(1);
    const [submitting, setSubmitting] = useState(false);
    const [basicDetails, setBasicDetails] = useState<BasicDetails | null>(null);
    const [documents, setDocuments] = useState<Documents>({});

    const handleNextStep1 = (data: BasicDetails) => {
        setBasicDetails(data);
        setStep(2);
    };

    const handleNextStep2 = (data: Documents) => {
        setDocuments(data);
        setStep(3);
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    const handleSubmit = async () => {
        if (!basicDetails) {
            toast({ variant: 'destructive', title: 'Error', description: 'Basic details are missing.' });
            return;
        }

        setSubmitting(true);
        try {
            const formData = new FormData();
            
            Object.entries(basicDetails).forEach(([key, value]) => {
                formData.append(key, String(value));
            });
            
            Object.entries(documents).forEach(([key, file]) => {
                if (file) {
                    formData.append(key, file);
                }
            });

            const result = await submitDiligenceReport(formData);

            if (result.success && result.submissionId) {
                toast({ title: 'Submission successful!', description: 'Your report is being generated.' });
                router.push(`/dashboard/submissions/${result.submissionId}`);
            } else {
                throw new Error(result.error || 'An unknown error occurred.');
            }
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Submission Failed', description: error.message });
        } finally {
            setSubmitting(false);
        }
    };

    const progress = (step / 3) * 100;

    return (
        <div className="container max-w-4xl mx-auto py-12">
            <div className="space-y-6">
                <div className="space-y-2 text-center">
                    <h1 className="text-3xl font-bold">Due Diligence Submission</h1>
                    <p className="text-muted-foreground">Follow the steps below to submit your startup's information.</p>
                </div>
                
                <Progress value={progress} className="w-full" />

                <Card>
                    <CardContent className="p-6 md:p-8">
                        {step === 1 && <BasicDetailsForm onNext={handleNextStep1} initialData={basicDetails} />}
                        {step === 2 && basicDetails && <DocumentUploadForm industry={basicDetails.field} onNext={handleNextStep2} onBack={handleBack} initialData={documents} />}
                        {step === 3 && basicDetails && <ReviewStep basicDetails={basicDetails} documents={documents} onBack={handleBack} onSubmit={handleSubmit} isSubmitting={submitting} />}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
