'use client';

import Link from 'next/link';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function Header() {
  const router = useRouter();

  return (
    <header className="bg-card shadow-sm sticky top-0 z-40">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2 text-foreground">
          <FileText className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">Diligence AI</span>
        </Link>
        
        <div className="flex items-center gap-4">
           <Button asChild>
              <Link href="/diligence/new">Get Started</Link>
            </Button>
        </div>
      </nav>
    </header>
  );
}
