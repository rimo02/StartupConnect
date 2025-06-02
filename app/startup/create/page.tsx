"use client";

import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectItem } from "@/components/ui/select";
import { SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { generateSlug, uploadImageToFirebase } from "@/lib/utils";
import { collection, addDoc, Timestamp } from 'firebase/firestore'
import { db } from "@/lib/firebase";

const formSchema = z.object({
    name: z.string().min(2, { message: "Startup name must be at least 2 characters." }),
    description: z.string().min(10, { message: "Description must be at least 10 characters." }).max(300, { message: "Description must be less than 300 characters." }),
    pitch: z.string().min(50, { message: "Pitch must be at least 50 characters." }).max(1000, { message: "Pitch must be less than 1000 characters." }),
    industry: z.string().min(1, { message: "Please select an industry." }),
    fundingStage: z.string().min(1, { message: "Please select a funding stage." }),
    location: z.string().min(2, { message: "Location must be at least 2 characters." }),
    website: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal("")),
    teamSize: z.coerce.number().int().min(1, { message: "Team size must be at least 1." }),
    image: z.instanceof(File).optional().nullable().refine((file) => !file || file.size <= 5 * 1024 * 1024, {
        message: "Image must be less than 5MB.",
    }),
    founderName: z.string(),
});

export default function Page() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            pitch: "",
            industry: "",
            fundingStage: "",
            image: null,
            location: "",
            website: "",
            teamSize: 1,
            founderName: "",
        },
    });
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if (!session?.user?.name) return;
        setIsSubmitting(true)
        try {
            let imageUrl: string | null = null;
            if (values.image instanceof File) {
                imageUrl = await uploadImageToFirebase(values.image);
            }
            const slug = generateSlug(values.name)
            await addDoc(collection(db, "startups"), {
                name: values.name,
                slug: slug,
                description: values.description,
                pitch: values.pitch,
                industry: values.industry,
                fundingStage: values.fundingStage,
                location: values.location,
                website: values.website || null,
                image: imageUrl,
                founderName: values.founderName,
                teamSize: values.teamSize,
                createdAt: Timestamp.now(),
                createdBy: session?.user?.id,
            })
            router.push(`/startup/${slug}`);
        } catch (error) {
            console.error("Error creating startup:", error);
        } finally {
            setIsSubmitting(false);
        }
    }



    if (status === "loading") {
        return <div className="container py-10">Loading...</div>;
    }

    if (status === "unauthenticated") {
        redirect("/auth/signin");
    }



    return (
        <div className="py-10 px-4 sm:px-6 lg:px-8 flex justify-center">
            <div className="w-full max-w-4xl">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Create Your Startup</h1>
                    <p className="text-muted-foreground">Share your venture with the world and find your perfect team</p>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Startup Details</CardTitle>
                        <CardDescription>
                            Fill out the information below to create your startup profile
                        </CardDescription>
                    </CardHeader>
                    <Form {...form}>
                        <form className="px-6 pb-6 space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                            <CardContent className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Startup Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="eg. Technovate" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                This is how your startup will appear to others.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Short Description</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="A brief description of your startup (max 300 characters)" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                A concise summary of what your startup does.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="image"
                                    render={({ }) => (
                                        <FormItem>
                                            <FormLabel>Startup Cover Image</FormLabel>

                                            {previewImage && (
                                                <div className="mb-4">
                                                    <img
                                                        src={previewImage}
                                                        alt="Startup Preview"
                                                        className="rounded-lg object-cover w-80 max-h-180 border"
                                                    />
                                                </div>
                                            )}

                                            <FormControl>
                                                <Input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            const reader = new FileReader();
                                                            reader.onloadend = () => {
                                                                setPreviewImage(reader.result as string);
                                                            };
                                                            reader.readAsDataURL(file);
                                                        }
                                                        form.setValue("image", file || null);
                                                    }}
                                                />
                                            </FormControl>

                                            <FormDescription>Upload an image that represents your startup.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="pitch"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Detailed Pitch</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Describe your startup's vision, mission, and what problem you're solving"
                                                    {...field}
                                                    rows={5}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Explain your startup&apos;s purpose, goals, and value proposition.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="industry"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Industry</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select an industry" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="AI & Machine Learning">AI & Machine Learning</SelectItem>
                                                    <SelectItem value="Blockchain">Blockchain</SelectItem>
                                                    <SelectItem value="CleanTech">CleanTech</SelectItem>
                                                    <SelectItem value="E-commerce">E-commerce</SelectItem>
                                                    <SelectItem value="EdTech">EdTech</SelectItem>
                                                    <SelectItem value="FinTech">FinTech</SelectItem>
                                                    <SelectItem value="HealthTech">HealthTech</SelectItem>
                                                    <SelectItem value="IoT">IoT</SelectItem>
                                                    <SelectItem value="SaaS">SaaS</SelectItem>
                                                    <SelectItem value="Security">Security</SelectItem>
                                                    <SelectItem value="Other">Other</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="fundingStage"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Funding Stage</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select funding stage" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="pre-seed">Pre-seed</SelectItem>
                                                    <SelectItem value="seed">Seed</SelectItem>
                                                    <SelectItem value="series-a">Series A</SelectItem>
                                                    <SelectItem value="series-b">Series B</SelectItem>
                                                    <SelectItem value="series-c">Series C</SelectItem>
                                                    <SelectItem value="established">Established</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="location"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Location</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g., San Francisco, CA" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="teamSize"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Current Team Size</FormLabel>
                                            <FormControl>
                                                <Input type="number" min="1" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="founderName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Founder&apos;s Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter Founder's name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                            <FormDescription>
                                                Enter your founder&apos;s name.
                                            </FormDescription>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="website"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Website (Optional)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://yourstartup.com" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                Your startup&apos;s website or landing page.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                            <CardFooter className="gap-4">
                                <Button variant="outline" type="button" onClick={() => router.back()}>
                                    Cancel
                                </Button>
                                <Button type={`submit`} disabled={isSubmitting}>
                                    {isSubmitting ? "Creating..." : "Create Startup"}
                                </Button>
                            </CardFooter>
                        </form>
                    </Form>


                </Card>
            </div>
        </div>

    )

}   