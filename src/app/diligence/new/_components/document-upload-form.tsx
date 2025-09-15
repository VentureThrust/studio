"use client";

import { useState, useMemo } from 'react';
import { Industry, DocumentType, IndustryDocuments, DocumentLabels, Documents } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileUp, CheckCircle, XCircle, PlusCircle, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Props {
    industry: Industry;
    onNext: (data: Documents) => void;
    onBack: () => void;
    initialData: Documents;
}

interface AdditionalDoc {
    id: number;
    name: string;
}

export default function DocumentUploadForm({ industry, onNext, onBack, initialData }: Props) {
    const requiredDocs = useMemo(() => IndustryDocuments[industry], [industry]);
    const [files, setFiles] = useState<Documents>(initialData);
    const [additionalDocs, setAdditionalDocs] = useState<AdditionalDoc[]>([]);
    const { toast } = useToast();
    
    const handleFileChange = (docType: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFiles(prev => ({ ...prev, [docType]: file }));
        }
    };

    const handleAdditionalDocNameChange = (id: number, newName: string) => {
        const oldDoc = additionalDocs.find(d => d.id === id);
        if (oldDoc && oldDoc.name !== newName) {
            const oldFile = files[oldDoc.name];
            const newFiles = { ...files };
            if (oldFile) {
                delete newFiles[oldDoc.name];
                newFiles[newName] = oldFile;
                setFiles(newFiles);
            }
        }
        setAdditionalDocs(docs => docs.map(doc => doc.id === id ? { ...doc, name: newName } : doc));
    }

    const addAdditionalDoc = () => {
        const newId = Date.now();
        const newDocName = `customDoc${newId}`;
        setAdditionalDocs(prev => [...prev, { id: newId, name: newDocName }]);
    };
    
    const removeAdditionalDoc = (id: number) => {
        const docToRemove = additionalDocs.find(d => d.id === id);
        if (docToRemove) {
            const newFiles = { ...files };
            delete newFiles[docToRemove.name];
            setFiles(newFiles);
        }
        setAdditionalDocs(prev => prev.filter(d => d.id !== id));
    };

    const handleSubmit = () => {
        const allDocsUploaded = requiredDocs.every(doc => files[doc]);
        if (!allDocsUploaded) {
            toast({ variant: 'destructive', title: 'Missing Documents', description: 'Please upload all required documents.' });
            return;
        }

        const customDocsValid = additionalDocs.every(doc => {
            const isNameValid = doc.name.trim() !== '' && !files[doc.name.trim()];
            const isFileUploaded = files[doc.name.trim()];
            return isNameValid && isFileUploaded;
        });

        // A check for if a name is provided but no file
        const customDocMissingFile = additionalDocs.some(doc => doc.name.trim() !== '' && !files[doc.name.trim()]);
        if(customDocMissingFile) {
             toast({ variant: 'destructive', title: 'Missing File', description: 'One or more custom documents has a name but no file uploaded.' });
             return;
        }

        const finalFiles = { ...files };
        additionalDocs.forEach(doc => {
            const originalKey = `customDoc${doc.id}`;
            const file = finalFiles[originalKey];
            if (file) {
                 finalFiles[doc.name] = file;
                 delete finalFiles[originalKey];
            } else if (finalFiles[doc.name]) {
                // already there
            }
        });


        onNext(finalFiles);
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

            <div className="space-y-4 pt-4 border-t">
                 <h3 className="font-medium">Additional Documents (Optional)</h3>
                {additionalDocs.map((doc, index) => (
                    <div key={doc.id} className="space-y-2">
                         <div className="flex items-center gap-2">
                            <Input 
                                placeholder="Enter document name"
                                onChange={(e) => handleAdditionalDocNameChange(doc.id, e.target.value)}
                                className="flex-grow"
                            />
                             <Button variant="ghost" size="icon" onClick={() => removeAdditionalDoc(doc.id)} aria-label="Remove document">
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                        </div>
                        <div className="flex items-center gap-4">
                             <div className="relative flex-grow">
                                <FileUp className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input 
                                    id={`custom-${doc.id}`}
                                    type="file" 
                                    onChange={(e) => handleFileChange(doc.name, e)}
                                    className="pl-10 file:text-sm file:font-medium"
                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                />
                            </div>
                            {files[doc.name] ? (
                                <div className="flex items-center shrink-0 gap-2 text-green-600">
                                    <CheckCircle className="h-5 w-5"/>
                                    <span className="text-sm font-medium truncate max-w-xs">{files[doc.name]?.name}</span>
                                </div>
                            ) : (
                                 <div className="flex items-center shrink-0 gap-2 text-muted-foreground">
                                    <XCircle className="h-5 w-5"/>
                                    <span className="text-sm font-medium">Not Uploaded</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                 <Button variant="outline" onClick={addAdditionalDoc} className="w-full">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Another Document
                </Button>
            </div>

            <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={onBack}>Back</Button>
                <Button onClick={handleSubmit}>Next Step</Button>
            </div>
        </div>
    );
}