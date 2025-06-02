"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter, useParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { db } from "@/lib/firebase";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { useState } from "react";
import { uploadCVToFirebase } from "@/lib/utils";

const applySchema = z.object({
  email: z.string().email(),
  qualifications: z.string().min(10),
  cv: z
    .any()
    .refine((file) => file instanceof File, "CV is required")
    .refine((file) => file?.type === "application/pdf", "Only PDF files are allowed")
    .refine((file) => file?.size <= 5 * 1024 * 1024, "File size must be <= 5MB")
});


type ApplyFormValues = z.infer<typeof applySchema>;

export default function JobApplyPage() {
  const form = useForm({
    resolver: zodResolver(applySchema),
    defaultValues: {
      email: "",
      qualifications: "",
      cv: undefined
    }
  });

  const router = useRouter();
  const { slug, jobId } = useParams();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: ApplyFormValues) => {
    setLoading(true);

    try {
      const cvURL = await uploadCVToFirebase(data.cv);

      await addDoc(collection(db, "applications"), {
        jobId,
        email: data.email,
        qualifications: data.qualifications,
        cvURL,
        appliedAt: Timestamp.now()
      });

      alert("Application submitted!");
      router.push(`/startup/${slug}/job/${jobId}`);
    } catch (err) {
      console.error("Error submitting application", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Apply for this Job</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="you@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="qualifications"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Qualifications</FormLabel>
                <FormControl>
                  <Textarea placeholder="Briefly describe your qualifications" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cv"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Upload CV</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => field.onChange(e.target.files?.[0])}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Application"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
