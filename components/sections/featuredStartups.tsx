'use client'

import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Startup } from '@/lib/types'
import { collection, getDocs, limit, query } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Card, CardContent, CardHeader } from '../ui/card'
import Image from 'next/image'
import { Badge } from '../ui/badge'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

const FeaturedStartups = () => {
    const [featured, setFeatured] = useState<Startup[]>([])
    const router = useRouter();

    useEffect(() => {
        const fetchStartups = async () => {
            try {
                const q = query(collection(db, 'startups'), limit(3))
                const querySnapshot = await getDocs(q)
                const data = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                })) as Startup[]
                setFeatured(data)
            } catch (error) {
                console.error('Error fetching startups:', error)
            }
        }
        fetchStartups()
    }, [])

    return (
        <section className="p-10 bg-muted/15">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 w-full">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight mb-2">Featured Startups</h2>
                    <p className="text-muted-foreground">Discover innovative startups looking for talent</p>
                </div>
                <Button variant="link" size="sm" asChild className="mt-4 md:mt-0">
                    <Link href="/startups">
                        View all startups <ArrowUpRight className="ml-1 h-4 w-4" />
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {featured.map((startup, index) => (
                    <motion.div
                        key={startup.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            delay: index * 0.6,
                            duration: 0.5,
                            ease: 'easeOut',
                        }}
                    >
                        <Card
                            key={startup.id}
                            className="p-5 shadow-sm hover:shadow-md transition-all"
                        >
                            <CardHeader className="flex flex-row items-center gap-4 p-0">
                                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-muted">
                                    <Image
                                        src={startup.image}
                                        alt={startup.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <h3 className="text-lg font-bold leading-tight">{startup.name}</h3>
                                    <span className="text-sm text-muted-foreground">{startup.location}</span>
                                </div>
                            </CardHeader>

                            <CardContent className="p-0">
                                <p className="text-sm text-semibold mb-3 line-clamp-3">
                                    {startup.description}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    <Badge variant="secondary">{startup.industry}</Badge>
                                    <Badge variant="secondary">{startup.fundingStage}</Badge>
                                </div>

                                <Button variant="outline" className="w-full cursor-pointer hover:bg-background/100" onClick={() => router.push(`/startup/${startup.slug}`)}>
                                    View Details
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </section>
    )
}

export default FeaturedStartups
