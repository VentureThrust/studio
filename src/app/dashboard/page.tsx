import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { DashboardContent } from './_components/dashboard-content';

export default function DashboardPage() {
    return (
        <div className="container py-12">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">An overview of your due diligence submissions.</p>
                </div>
                <Button asChild>
                    <Link href="/diligence/new">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        New Submission
                    </Link>
                </Button>
            </div>
            <DashboardContent />
        </div>
    );
}
