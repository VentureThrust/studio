import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col">
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-card">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                  Streamline Your Startup Due Diligence
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Diligence AI uses cutting-edge technology to automate and simplify the due diligence process, helping you make smarter investment decisions, faster.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                  <Link href="/diligence/new">
                    Start Due Diligence
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                    <Link href="/dashboard">View Dashboard</Link>
                </Button>
              </div>
            </div>
            <Image
              src="https://picsum.photos/seed/1/600/400"
              width={600}
              height={400}
              alt="Hero"
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
              data-ai-hint="team meeting"
            />
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">Key Features</div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">How It Works</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our platform guides you through a simple, three-step process to get your comprehensive AI-powered due diligence report.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 lg:max-w-none mt-12">
            <div className="grid gap-1 text-center p-6 rounded-lg bg-card shadow-md">
              <h3 className="text-lg font-bold">1. Submit Details</h3>
              <p className="text-sm text-muted-foreground">
                Fill out a simple form with your startup's basic information and industry.
              </p>
            </div>
            <div className="grid gap-1 text-center p-6 rounded-lg bg-card shadow-md">
              <h3 className="text-lg font-bold">2. Upload Documents</h3>
              <p className="text-sm text-muted-foreground">
                Securely upload required documents based on your industry. We handle the rest.
              </p>
            </div>
            <div className="grid gap-1 text-center p-6 rounded-lg bg-card shadow-md">
              <h3 className="text-lg font-bold">3. Get Your Report</h3>
              <p className="text-sm text-muted-foreground">
                Receive an AI-generated initial report, highlighting key insights and potential red flags.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
