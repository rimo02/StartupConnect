"use client"
import { motion } from 'framer-motion'
import { Button } from '../ui/button'
import { ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function HeroSection() {
    const router = useRouter();

    return (
        <section className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/4 to-secondary/7">
                <div className="absolute inset-0 overflow-hidden">
                    <motion.div
                        className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 0.5 }}
                        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                    />
                    <motion.div
                        className="absolute top-1/2 -left-20 h-60 w-60 rounded-full bg-secondary/10"
                        initial={{ scale: 1, opacity: 0 }}
                        animate={{ scale: 1.2, opacity: 0.5 }}
                        transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", delay: 0.5 }}
                    />
                </div>
            </div>
            <div className='relative flex justify-center min-h-screen'>
                <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px] p-10">
                    <motion.div
                        className='flex flex-col justify-center space-y-5'
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className='space-y-4'>
                            <h1 className='text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-8xl'>
                                Connect, Create, <span className="text-primary">Launch</span>
                            </h1>
                            <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                                Find your perfect team or join the next billion-dollar startup. StartupConnect brings together innovators and talent.
                            </p>
                        </div>

                        <div className='flex flex-col gap-2 md:flex-row'>
                            <Button size='lg' type='button' onClick={() => router.push(`/startup`)} >
                                Explore Startups <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                type="button"
                                onClick={() => {
                                    console.log("Button clicked!");
                                    router.push(`/startup/create`);
                                }}
                            >
                                Create One
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}