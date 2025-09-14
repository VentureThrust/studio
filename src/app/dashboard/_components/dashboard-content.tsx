"use client";

import { useState, useEffect } from "react";
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/components/auth-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FileText, ArrowRight, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Submission {
    id: string;
    startupName: string;
    field: string;
    status: 'processing' | 'completed' | 'error';
    createdAt: { toDate: () => Date; };
}

export function DashboardContent() {
    const { user, loading: authLoading } = useAuth();
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [dataLoading, setDataLoading] = useState(true);

    useEffect(() => {
        if (user) {
            const fetchSubmissions = async () => {
                if (!dataLoading) setDataLoading(true);
                try {
                    const q = query(
                        collection(db, 'submissions'),
                        where('userId', '==', user.uid),
                        orderBy('createdAt', 'desc')
                    );
                    const querySnapshot = await getDocs(q);
                    const subs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Submission));
                    setSubmissions(subs);
                } catch (error) {
                    console.error("Error fetching submissions: ", error);
                } finally {
                    setDataLoading(false);
                }
            };
            fetchSubmissions();
        } else if (!authLoading) {
            setDataLoading(false);
        }
    }, [user, authLoading]);

    if (authLoading || dataLoading) {
        return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }
    
    if (!user) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Authentication Required</CardTitle>
                    <CardDescription>Please sign in to view your submissions.</CardDescription>
                </CardHeader>
                 <CardContent>
                    <Button asChild><Link href="/auth">Sign In</Link></Button>
                 </CardContent>
            </Card>
        )
    }

    if (submissions.length === 0) {
        return (
            <Card className="text-center py-12">
                <CardHeader>
                    <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                    <CardTitle className="mt-4">No Submissions Yet</CardTitle>
                    <CardDescription>Get started by creating your first due diligence submission.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild>
                        <Link href="/diligence/new">Create New Submission</Link>
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Startup</TableHead>
                            <TableHead className="hidden sm:table-cell">Industry</TableHead>
                            <TableHead className="hidden md:table-cell">Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead><span className="sr-only">Actions</span></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {submissions.map((sub) => (
                            <TableRow key={sub.id}>
                                <TableCell className="font-medium">{sub.startupName}</TableCell>
                                <TableCell className="hidden sm:table-cell">{sub.field}</TableCell>
                                <TableCell className="hidden md:table-cell">{sub.createdAt.toDate().toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <Badge variant={sub.status === 'completed' ? 'default' : sub.status === 'processing' ? 'secondary' : 'destructive'} className="capitalize">
                                        {sub.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button asChild variant="ghost" size="sm">
                                        <Link href={`/dashboard/submissions/${sub.id}`}>
                                            View <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
