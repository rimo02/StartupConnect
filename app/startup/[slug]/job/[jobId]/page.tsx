"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";

interface Job {
  jobName: string;
  description: string;
  payScale: string;
  skills: string;
}

export default function JobDetailsPage() {
  const params = useParams();
  const slug = params.slug as string;
  const jobId = params.jobId as string;

  console.log(slug, jobId);
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);

  useEffect(() => {
    const fetchJob = async () => {
      const jobRef = doc(db, "jobs", jobId as string);
      const snapshot = await getDoc(jobRef);
      if (snapshot.exists()) {
        setJob(snapshot.data() as Job);
      }
    };
    fetchJob();
  }, [jobId]);

  if (!job) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-4">{job.jobName}</h1>
      <p className="mb-2 text-muted-foreground">{job.description}</p>
      <p><strong>Pay Scale:</strong> {job.payScale}</p>
      <p><strong>Skills Required:</strong> {job.skills}</p>

      <div className="mt-6">
        <Button onClick={() => router.push(`/startup/${slug}/job/${jobId}/apply`)}>
          Apply Now
        </Button>
      </div>
    </div>
  );
}
