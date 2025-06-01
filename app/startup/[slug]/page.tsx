"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase, Globe, MapPin, Users, ChevronLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import type { Startup } from "@/lib/types";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function StartupDetailsPage() {
    const { slug } = useParams();
    const [startup, setStartup] = useState<Startup>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStartupDetails() {
            try {
                const q = query(collection(db, 'startups'), where('slug', '==', slug))
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    const doc = querySnapshot.docs[0];
                    setStartup({ id: doc.id, ...doc.data() } as Startup);
                }
            }
            catch (error) {
                console.error("Error fetching startup details:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchStartupDetails();

    }, [slug]);

    if (loading) {
        return (
            <div className="container py-10">
                <div className="animate-pulse">
                    <div className="h-8 w-64 bg-muted rounded mb-4"></div>
                    <div className="h-4 w-32 bg-muted rounded"></div>
                </div>
            </div>
        );
    }

    if (!startup) {
        return (
            <div className="container py-10">
                <h1 className="text-2xl font-bold mb-4">Startup not found</h1>
                <Button variant="outline" asChild>
                    <Link href="/startups">
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Back to Startups
                    </Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="p-10">
            {/* Header */}
            <div className="mb-8">
                <Button variant="outline" asChild className="mb-6">
                    <Link href="/startups">
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Back to Startups
                    </Link>
                </Button>

                <div className="flex items-start gap-6">
                    <div className="h-60 w-80 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                        {startup.image ? (
                            <img src={startup.image} alt={startup.name} className="h-full w-full object-cover" />
                        ) : (
                            <Briefcase className="h-10 w-10 text-muted-foreground" />
                        )}
                    </div>

                    <div className="flex-1">
                        <h1 className="text-3xl font-bold tracking-tight mb-2">{startup.name}</h1>
                        <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-4">
                            <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                <span>{startup.location}</span>
                            </div>
                            {startup.website && (
                                <Link
                                    href={startup.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                                >
                                    <Globe className="h-4 w-4" />
                                    <span>Website</span>
                                    <ExternalLink className="h-3 w-3" />
                                </Link>
                            )}
                            <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                <span>{startup.teamSize} team members</span>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Badge variant="outline">{startup.industry}</Badge>
                            <Badge variant="outline" className="capitalize">
                                {startup.fundingStage.replace("-", " ")}
                            </Badge>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <Tabs defaultValue="about" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="about">About</TabsTrigger>
                    <TabsTrigger value="team">Team</TabsTrigger>
                    <TabsTrigger value="positions">Open Positions</TabsTrigger>
                </TabsList>

                <TabsContent value="about">
                    <div className="grid gap-6 md:grid-cols-3">
                        <div className="md:col-span-2 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>About {startup.name}</CardTitle>
                                    <CardDescription>Learn more about our mission and vision</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="prose dark:prose-invert">
                                        <p className="text-muted-foreground mb-6">{startup.description}</p>
                                        <h3 className="text-lg font-semibold mb-2">Our Vision</h3>
                                        <p className="text-muted-foreground whitespace-pre-wrap">{startup.pitch}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="space-y-6">

                            <Card>
                                <CardHeader>
                                    <CardTitle>Quick Facts</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <div className="text-sm font-medium mb-1">Founded</div>
                                        <div className="text-muted-foreground">
                                            {new Date(startup.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium mb-1">Industry</div>
                                        <div className="text-muted-foreground">{startup.industry}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium mb-1">Stage</div>
                                        <div className="text-muted-foreground capitalize">
                                            {startup.fundingStage.replace("-", " ")}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium mb-1">Location</div>
                                        <div className="text-muted-foreground">{startup.location}</div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="team">
                    <Card>
                        <CardHeader>
                            <CardTitle>Team Members</CardTitle>
                            <CardDescription>Meet the people behind {startup.name}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-12">
                                <h3 className="text-lg font-medium mb-2">Coming Soon</h3>
                                <p className="text-muted-foreground mb-4">
                                    Team member profiles will be available soon.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="positions">
                    <Card>
                        <CardHeader>
                            <CardTitle>Open Positions</CardTitle>
                            <CardDescription>Join our team and help us build the future</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-12">
                                <h3 className="text-lg font-medium mb-2">No open positions</h3>
                                <p className="text-muted-foreground mb-4">
                                    There are currently no open positions at {startup.name}.
                                </p>
                                <Button variant="outline" asChild>
                                    <Link href="/positions">Browse All Positions</Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}