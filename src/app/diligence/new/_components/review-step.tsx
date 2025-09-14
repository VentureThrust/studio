"use client";

import { BasicDetails, Documents, DocumentLabels, DocumentType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { File, Loader2 } from 'lucide-react';

interface Props {
    basicDetails: BasicDetails;
    documents: Documents;
    onBack: () => void;
    onSubmit: () => void;
    isSubmitting: boolean;
}

export default function ReviewStep({ basicDetails, documents, onBack, onSubmit, isSubmitting }: Props) {
    return (
        <div className="space-y-6">
            <CardHeader className="p-0">
                <CardTitle>Step 3: Review and Submit</CardTitle>
                <CardDescription>Please review all the information before submitting.</CardDescription>
            </CardHeader>
            
            <div className="space-y-4 rounded-lg border p-4">
                <h3 className="font-semibold text-lg">Basic Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex flex-col space-y-1">
                        <span className="text-muted-foreground">Startup Name</span>
                        <span className="font-medium">{basicDetails.startupName}</span>
                    </div>
                    <div className="flex flex-col space-y-1">
                        <span className="text-muted-foreground">Email</span>
                        <span className="font-medium">{basicDetails.email}</span>
                    </div>
                    <div className="flex flex-col space-y-1">
                        <span className="text-muted-foreground">Year of Registration</span>
                        <span className="font-medium">{basicDetails.yearOfRegistration}</span>
                    </div>
                    <div className="flex flex-col space-y-1">
                        <span className="text-muted-foreground">Number of Employees</span>
                        <span className="font-medium">{basicDetails.numberOfEmployees}</span>
                    </div>
                     <div className="flex flex-col space-y-1 md:col-span-2">
                        <span className="text-muted-foreground">Industry</span>
                        <span className="font-medium">{basicDetails.field}</span>
                    </div>
                </div>
            </div>

            <div className="space-y-4 rounded-lg border p-4">
                 <h3 className="font-semibold text-lg">Uploaded Documents</h3>
                 <ul className="space-y-2 text-sm">
                    {Object.entries(documents).map(([type, file]) => {
                        if (!file) return null;
                        return (
                            <li key={type} className="flex items-center justify-between p-2 rounded-md bg-secondary">
                                <div className="flex items-center gap-2">
                                    <File className="h-4 w-4 text-muted-foreground" />
                                    <span>{DocumentLabels[type as DocumentType]}</span>
                                </div>
                                <span className="text-muted-foreground truncate max-w-[200px]">{file.name}</span>
                            </li>
                        )
                    })}
                 </ul>
            </div>

            <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={onBack} disabled={isSubmitting}>Back</Button>
                <Button onClick={onSubmit} disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Confirm and Submit
                </Button>
            </div>
        </div>
    );
}
