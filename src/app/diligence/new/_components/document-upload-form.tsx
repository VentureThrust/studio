"use client";

import { useState, useMemo } from 'react';
import { Industry, DocumentType, IndustryDocuments, DocumentLabels, Documents } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileUp, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Props {
    industry: Industry;
    onNext: (data: Documents) => void;
    onBack: () => void;
    initialData: Documents;
}

export default function DocumentUploadForm({ industry, onNext, onBack, initialData }: Props) {
    const requiredDocs = useMemo(() => IndustryDocuments[industry], [industry]);
    const [files, setFiles] = useState<Documents>(initialData);
    const { toast } = useToast();
    
    const handleFileChange = (docType: DocumentType, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFiles(prev => ({ ...prev, [docType]: file }));
        }
    };
    
    const handleSubmit = () => {
        const allDocsUploaded = requiredDocs.every(doc => files[doc]);
        if (!allDocsUploaded) {
            toast({ variant: 'destructive', title: 'Missing Documents', description: 'Please upload all required documents.' });
            return;
        }
        onNext(files);
    };

    return (
        <div className="space-y-6">
            <CardHeader className="p-0">
                <CardTitle>Step 2: Document Upload</CardTitle>
                <CardDescription>Upload the required documents for the <span className="font-semibold">{industry}</span> industry.</CardDescription>
            </CardHeader>
            <div className="space-y-4">
                {requiredDocs.map(docType => (
                    <div key={docType} className="space-y-2">
                        <Label htmlFor={docType}>{DocumentLabels[docType]}</Label>
                        <div className="flex items-center gap-4">
                           <div className="relative flex-grow">
                                <FileUp className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input 
                                    id={docType}
                                    type="file" 
                                    onChange={(e) => handleFileChange(docType, e)}
                                    className="pl-10 file:text-sm file:font-medium"
                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                />
                            </div>
                            {files[docType] ? (
                                <div className="flex items-center shrink-0 gap-2 text-green-600">
                                    <CheckCircle className="h-5 w-5"/>
                                    <span className="text-sm font-medium truncate max-w-xs">{files[docType]?.name}</span>
                                </div>
                            ) : (
                                <div className="flex items-center shrink-0 gap-2 text-destructive">
                                    <XCircle className="h-5 w-5"/>
                                    <span className="text-sm font-medium">Required</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={onBack}>Back</Button>
                <Button onClick={handleSubmit}>Next Step</Button>
            </div>
        </div>
    );
}
