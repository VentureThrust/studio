"use client";

import { useEffect, useState } from 'react';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/components/auth-provider';
import { useParams, useRouter } from 'next/navigation';
import { BasicDetails, DocumentType, DocumentLabels } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, File, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface SubmissionData extends BasicDetails {
    userId: string;
    documents: Partial<Record<DocumentType, string>>;
    report: string;
    status: 'processing' | 'completed' | 'error';
}

export default function SubmissionDetailPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [submission, setSubmission] = useState<SubmissionData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (authLoading || !id) return;
        if (!user) {
            router.push('/auth');
            return;
        }

        const docRef = doc(db, 'submissions', id);
        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data() as SubmissionData;
                if (data.userId === user.uid) {
                    setSubmission(data);
                } else {
                    router.push('/dashboard');
                }
            } else {
                router.push('/dashboard');
            }
            setLoading(false);
        });
        
        return () => unsubscribe();
    }, [id, user, authLoading, router]);

    if (loading || authLoading) {
        return <div className="flex justify-center items-center h-[calc(100vh-8rem)]"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    if (!submission) {
        return <div className="container py-12 text-center">Submission not found or you do not have permission to view it.</div>;
    }

    return (
        <div className="container py-12">
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold">{submission.startupName} - Due Diligence</h1>
                    <p className="text-muted-foreground">Generated Report and Submitted Information</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8 items-start">
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>AI-Generated Due Diligence Report</CardTitle>
                                <CardDescription>This is an initial draft based on the provided information.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {submission.status === 'processing' ? (
                                    <div className="flex flex-col items-center gap-4 text-muted-foreground p-8 justify-center min-h-[200px] bg-secondary rounded-md">
                                        <Loader2 className="h-8 w-8 animate-spin"/>
                                        <p className="font-medium">Your report is being generated...</p>
                                        <p className="text-sm text-center">This may take a few moments. The page will update automatically.</p>
                                    </div>
                                ) : (
                                    <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:font-headline prose-p:text-foreground prose-li:text-foreground prose-strong:text-foreground">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                            {submission.report}
                                        </ReactMarkdown>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                    <div className="space-y-6 lg:sticky lg:top-24">
                        <Card>
                             <CardHeader>
                                <CardTitle>Submission Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="text-sm flex justify-between"><strong>Email:</strong> <span>{submission.email}</span></div>
                                <div className="text-sm flex justify-between"><strong>Industry:</strong> <span>{submission.field}</span></div>
                                <div className="text-sm flex justify-between"><strong>Year Registered:</strong> <span>{submission.yearOfRegistration}</span></div>
                                <div className="text-sm flex justify-between"><strong>Employees:</strong> <span>{submission.numberOfEmployees}</span></div>
                            </CardContent>
                        </Card>
                         <Card>
                             <CardHeader>
                                <CardTitle>Submitted Documents</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3">
                                   {Object.entries(submission.documents).map(([type, url]) => (
                                       <li key={type}>
                                           <Button asChild variant="outline" className="w-full justify-between">
                                               <a href={url} target="_blank" rel="noopener noreferrer">
                                                   <div className="flex items-center gap-2">
                                                        <File className="h-4 w-4"/>
                                                        <span>{DocumentLabels[type as DocumentType]}</span>
                                                   </div>
                                                   <Download className="h-4 w-4 text-muted-foreground"/>
                                               </a>
                                           </Button>
                                       </li>
                                   ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
