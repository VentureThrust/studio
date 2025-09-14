"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BasicDetails, BasicDetailsSchema, Industries } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface Props {
    onNext: (data: BasicDetails) => void;
    initialData: BasicDetails | null;
}

export default function BasicDetailsForm({ onNext, initialData }: Props) {
    const form = useForm<BasicDetails>({
        resolver: zodResolver(BasicDetailsSchema),
        defaultValues: initialData || {
            startupName: '',
            email: '',
            yearOfRegistration: new Date().getFullYear(),
            numberOfEmployees: 1,
            field: 'General Startup',
        },
    });

    const onSubmit = (data: BasicDetails) => {
        onNext(data);
    };

    return (
        <div className="space-y-6">
            <CardHeader className="p-0">
                <CardTitle>Step 1: Basic Details</CardTitle>
                <CardDescription>Provide some basic information about your startup.</CardDescription>
            </CardHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField control={form.control} name="startupName" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Startup Name</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl><Input type="email" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField control={form.control} name="yearOfRegistration" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Year of Registration</FormLabel>
                                <FormControl><Input type="number" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="numberOfEmployees" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Number of Employees</FormLabel>
                                <FormControl><Input type="number" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>
                     <FormField control={form.control} name="field" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Field/Industry</FormLabel>
                             <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select an industry" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {Industries.map(industry => (
                                        <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <div className="flex justify-end pt-4">
                        <Button type="submit">Next Step</Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
