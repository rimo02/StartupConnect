"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter, useParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebase";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { useState } from "react";

const jobSchema = z.object({
    jobName: z.string().min(2),
    description: z.string().min(10),
    payScale: z.string().min(1),
    skills: z.string().min(1)
});

type JobFormValues = z.infer<typeof jobSchema>;

export default function CreateJobPage() {
    const form = useForm<JobFormValues>({
        resolver: zodResolver(jobSchema),
        defaultValues: {
            jobName: "",
            description: "",
            payScale: "",
            skills: ""
        }
    });

    const [loading, setLoading] = useState(false);
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;

    const onSubmit = async (data: JobFormValues) => {
        setLoading(true);
        try {
            const docRef = await addDoc(collection(db, "jobs"), {
                ...data,
                startupSlug: slug,
                createdAt: Timestamp.now()
            });
            const jobId = docRef.id;
            router.push(`/startup/${slug}/job/${jobId}`)
        } catch (err) {
            console.error("Job post error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-6 flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
                <h2 className="text-2xl font-semibold mb-4">Post a Job Opening</h2>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="jobName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Job Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Frontend Developer" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Job Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            rows={5}
                                            placeholder="Describe the responsibilities and requirements..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="payScale"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Pay Scale</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., ₹10,000 – ₹20,000/month" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="skills"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Skills Required</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., React, Firebase, TypeScript" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" disabled={loading}>
                            {loading ? "Posting..." : "Post Job"}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
}
