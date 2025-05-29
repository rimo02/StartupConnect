import HeroSection from "@/components/sections/hero";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import { ArrowRight, Briefcase, Rocket, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <section className="bg-background p-10">
        <div className="w-full">
          <div className="text-center flex-col">
            <h2 className="text-3xl font-bold tracking-tight mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Connect with innovative startups or find talented individuals to join your venture in just a few simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-12">
            {[
              {
                icon: <Rocket size={40} className="text-primary" />,
                title: "Create your Profile",
                description:
                  "Sign up and build your profile to showcase your skills and experience.",
              },
              {
                icon: <Briefcase size={40} className="text-primary" />,
                title: "Post or Find Opportunities",
                description:
                  "List your startup or browse existing ventures looking for talent.",
              },
              {
                icon: <Users size={40} className="text-primary" />,
                title: "Connect and Collaborate",
                description:
                  "Apply to positions or review applications to build your perfect team.",
              },
            ].map((item, index) => (
              <Card
                key={index}
                className="flex flex-col items-center text-center p-6"
              >
                <CardHeader className="flex flex-col items-center gap-4">
                  {item.icon}
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                </CardHeader>
                <CardDescription className="text-muted-foreground">
                  {item.description}
                </CardDescription>
              </Card>
            ))}
          </div>
            <div className="mt-12 flex items-center justify-center">
            <Button className="flex gap-2 items-" size={`lg`}>
              Explore Startups
              <ArrowRight/>
            </Button>
            </div>

        </div>

      </section>
    </div>
  );
}
