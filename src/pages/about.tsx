import React from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  Code, 
  Smartphone, 
  Globe, 
  Rocket, 
  Heart, 
  Zap, 
  Target, 
  Users,
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import PageContainer from "@/components/PageContainer";
import { FadeIn, SlideInRight } from "@/components/animations/MotionComponents";
import { Button } from "@/components/ui/button";
import { 
  SiReact, 
  SiNextdotjs, 
  SiTypescript, 
  SiTailwindcss, 
  SiNodedotjs, 
  SiAmazonaws, 
  SiDocker, 
  SiFirebase, 
  SiMongodb, 
  SiPostgresql,
  SiPython
} from "react-icons/si";

const values = [
  {
    title: "Craftsmanship over Speed",
    description: "I believe in building software that isn't just functional, but maintainable, scalable, and a joy to use.",
    icon: Heart,
    color: "text-rose-500",
    bg: "bg-rose-50"
  },
  {
    title: "Pragmatic Engineering",
    description: "Choosing the right tool for the job. I prioritize solutions that solve business problems over technical hype.",
    icon: Zap,
    color: "text-amber-500",
    bg: "bg-amber-50"
  },
  {
    title: "Radical Transparency",
    description: "Clear communication, honest trade-off discussions, and consistent updates are the bedrock of my partnerships.",
    icon: Target,
    color: "text-blue-500",
    bg: "bg-blue-50"
  },
  {
    title: "User-First Thinking",
    description: "Every line of code serves a user. I keep the end-user experience at the forefront of every technical decision.",
    icon: Users,
    color: "text-emerald-500",
    bg: "bg-emerald-50"
  }
];

const technologies = [
  { name: "React / Next.js", icon: SiNextdotjs, level: "Expert" },
  { name: "TypeScript", icon: SiTypescript, level: "Expert" },
  { name: "React Native", icon: SiReact, level: "Expert" },
  { name: "Tailwind CSS", icon: SiTailwindcss, level: "Expert" },
  { name: "Node.js", icon: SiNodedotjs, level: "Advanced" },
  { name: "Python", icon: SiPython, level: "Advanced" },
  { name: "PostgreSQL", icon: SiPostgresql, level: "Advanced" },
  { name: "MongoDB", icon: SiMongodb, level: "Advanced" },
  { name: "AWS / Cloud", icon: SiAmazonaws, level: "Advanced" },
  { name: "Docker", icon: SiDocker, level: "Advanced" },
  { name: "Firebase", icon: SiFirebase, level: "Expert" },
];

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>About - Karthik Nishanth | Product-Minded Software Engineer</title>
        <meta 
          name="description" 
          content="Learn about Karthik Nishanth's journey, values, and technical expertise in building high-performance web and mobile products." 
        />
        <link rel="canonical" href="https://karthiknish.com/about" />
      </Head>

      <PageContainer>
        <div className="min-h-screen">
          {/* Hero Section */}
          <section className="relative pt-36 pb-20 md:pt-48 md:pb-32 overflow-hidden">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.08),_transparent_40%)]" />
            <div className="max-w-6xl mx-auto px-6 sm:px-10 md:px-12">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <FadeIn>
                  <div className="space-y-6">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-100 text-slate-600 rounded-full text-sm font-bold">
                      The Story So Far
                    </span>
                    <h1 className="font-heading text-4xl md:text-6xl text-slate-900 leading-tight">
                      Crafting digital products with <span className="text-blue-600">purpose</span> and precision.
                    </h1>
                    <p className="text-xl text-slate-600 leading-relaxed max-w-xl">
                      I'm Karthik Nishanth, a software engineer based in Liverpool, UK. I partner with ambitious founders to build resilient software that users love.
                    </p>
                  </div>
                </FadeIn>
                
                <SlideInRight>
                  <div className="relative aspect-square max-w-md mx-auto md:ml-auto">
                    <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-3xl opacity-10 rotate-3" />
                    <div className="relative h-full w-full rounded-2xl overflow-hidden bg-slate-200 border-4 border-white shadow-2xl">
                       <Image 
                        src="/hero-back.jpeg" 
                        alt="Karthik Nishanth" 
                        fill 
                        className="object-cover"
                      />
                    </div>
                  </div>
                </SlideInRight>
              </div>
            </div>
          </section>

          {/* Bio Section */}
          <section className="py-20 bg-slate-50/50">
            <div className="max-w-4xl mx-auto px-6">
              <div className="prose prose-slate prose-lg max-w-none">
                <h2 className="font-heading text-3xl text-slate-900 mb-8">My Engineering Philosophy</h2>
                <div className="space-y-6 text-slate-600">
                  <p>
                    For over 4 years, I've been deep in the trenches of product development, helping startups and established companies launch over 40 products across web and mobile.
                  </p>
                  <p>
                    My approach is rooted in **pragmatism**. I don't just write code; I think about the business impact, the long-term maintainability, and the psychological health of the engineers who will work on the system after me.
                  </p>
                  <p>
                    Whether I'm architecting a complex healthcare platform or polishing the micro-interactions of a consumer app, I bring a level of craft that turns average software into experiences that feel premium and trustworthy.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Values Grid */}
          <section className="py-24 max-w-6xl mx-auto px-6 sm:px-10 md:px-12">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="font-heading text-3xl md:text-5xl text-slate-900 mb-6">Core Values</h2>
              <p className="text-lg text-slate-600">These principles guide every partnership and code review I undertake.</p>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-8">
              {values.map((value, index) => (
                <FadeIn key={value.title} delay={index * 0.1}>
                  <div className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                    <div className={`w-14 h-14 rounded-2xl ${value.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                      <value.icon className={`h-7 w-7 ${value.color}`} />
                    </div>
                    <h3 className="font-heading text-xl text-slate-900 mb-3">{value.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{value.description}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </section>

          {/* Skills / Tech Stack Section */}
          <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/5 -skew-x-12 transform translate-x-1/2 -z-0" />
            <div className="max-w-6xl mx-auto px-6 sm:px-10 md:px-12 relative z-10">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-8">
                  <h2 className="font-heading text-3xl md:text-5xl">Technical Depth</h2>
                  <p className="text-lg text-slate-400 leading-relaxed">
                    I believe in T-shaped expertise. While I'm deeply specialized in the React ecosystem, I maintain strong capabilities across the entire modern stack to provide end-to-end value.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      "Distributed Systems",
                      "Cloud-Native Design",
                      "Performance Auditing",
                      "CI/CD Pipelines",
                      "Schema Architecture",
                      "UX Strategy"
                    ].map((skill) => (
                      <div key={skill} className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-blue-500" />
                        <span className="text-slate-300 font-medium">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                  {technologies.map((tech) => (
                    <div key={tech.name} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center text-center group hover:bg-white/10 transition-colors">
                      <tech.icon className="h-8 w-8 mb-3 text-white group-hover:text-blue-400 transition-colors" />
                      <span className="text-sm font-bold mb-1">{tech.name}</span>
                      <span className="text-[10px] uppercase tracking-widest text-slate-500">{tech.level}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-24 md:py-32">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <div className="p-12 md:p-16 rounded-[3rem] bg-blue-600 text-white shadow-2xl shadow-blue-200 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Rocket size={120} />
                </div>
                <h2 className="font-heading text-4xl md:text-6xl mb-8 relative z-10">
                  Ready to build something <span className="text-cyan-300">exceptional</span>?
                </h2>
                <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto relative z-10">
                  I'm currently accepting new projects for Q2 2026. Let's discuss how we can bring your vision to life.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                  <Link href="/contact">
                    <Button size="lg" className="h-14 px-10 bg-white text-blue-600 hover:bg-slate-100 rounded-2xl font-bold text-lg">
                      Start a consultation
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/services">
                    <Button size="lg" variant="outline" className="h-14 px-10 border-white/30 bg-white/10 text-white hover:bg-white/20 rounded-2xl font-bold text-lg">
                      View my services
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </PageContainer>
    </>
  );
}
