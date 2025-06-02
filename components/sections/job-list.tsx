'use client'
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { Card, CardContent } from '../ui/card';
import Link from 'next/link';
import { Button } from '../ui/button';
interface Job {
    id: string;
    jobName: string;
    payScale: string;
    skills: string;
    description: string;
}

interface JobListProps {
    slug: string;
}

const JobList: React.FC<JobListProps> = ({ slug }) => {
    console.log(slug);
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const q = query(collection(db, 'jobs'), where('startupSlug', `==`, slug));
                const querySnapshot = await getDocs(q);
                console.log(querySnapshot);
                const jobsData: Job[] = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                })) as Job[];
                setJobs(jobsData);
            }
            catch (error) {
                console.error('Error fetching jobs:', error);
            } finally {
                setLoading(false)
            }
        }
        fetchJobs();
    }, [])

    if (loading) return <div>Loading jobs...</div>;
    if (jobs.length === 0) return <div>No job openings yet.</div>;
    return (
        <div className="space-y-4">
            {jobs.map(job => (
                <Card key={job.id}>
                    <CardContent className="p-4">
                        <h3 className="text-lg font-semibold">{job.jobName}</h3>
                        <p className="text-sm text-muted-foreground">{job.skills}</p>
                        <Link href={`/startup/${slug}/job/${job.id}`}>
                            <Button variant={`outline`} className="mt-2 p-2 h-auto">View Details</Button>
                        </Link>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

export default JobList