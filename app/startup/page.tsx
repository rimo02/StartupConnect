'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { useInfiniteScroll } from '@/hook/infinite-scroll'
import { SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Plus, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useMemo, useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import { useDebounce } from 'use-debounce';

export default function StartupPage() {
    const router = useRouter();
    const [industry, setIndustry] = useState('all');
    const [fundingStage, setFundingStage] = useState("all");
    const [search, setSearch] = useState('');
    const [debouncedSearch] = useDebounce(search, 1000);

    const filters = useMemo(() => ({ industry, fundingStage, search: debouncedSearch }), [industry, fundingStage, debouncedSearch]);
    const { postList, loading, hasMore, lastPostRef } = useInfiniteScroll(`startups`, filters);

    return (
        <div className='p-6 md:p-10'>
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6'>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Startups Directory</h1>
                    <p className="text-muted-foreground">Discover innovative startups across all industries and stages</p>
                </div>

                <Button onClick={() => router.push('/startup/create/')}>
                    <Plus className="mr-2 h-4 w-4" />
                    Post Your Startup
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="relative w-full col-span-1 sm:col-span-2">
                    <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search startups..."
                        className="w-full pl-8"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="w-full">
                    <Select onValueChange={setIndustry}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Industry" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Industry</SelectItem>
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
                </div>

                <div className="w-full">
                    <Select onValueChange={setFundingStage}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Funding Stage" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Stages</SelectItem>
                            <SelectItem value="pre-seed">Pre-seed</SelectItem>
                            <SelectItem value="seed">Seed</SelectItem>
                            <SelectItem value="series-a">Series A</SelectItem>
                            <SelectItem value="series-b">Series B+</SelectItem>
                            <SelectItem value="established">Established</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-5'>
                {postList.map((startup, index) => (
                    <motion.div
                        key={startup.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            delay: index * 0.1,
                            duration: 0.3,
                            ease: `easeInOut`,
                        }}
                        ref={(postList.length - 1 === index) ? lastPostRef : null}
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
                {loading && <p className="text-center col-span-1 sm:col-span-2 md:col-span-2 xlg:col-span-3">Loading more startups...</p>}
                {!hasMore && !loading && (
                    <p className="text-center col-span-1 sm:col-span-2 md:col-span-2 xlg:col-span-3 text-gray-500">No more Startups.</p>
                )}
            </div>
        </div>
    )
}