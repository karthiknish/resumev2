import React from "react";
import Link from "next/link";
import Head from "next/head";
import { motion } from "framer-motion";
import { Icons } from "@/components/ui/icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";

function About() {
  const skills = {
    "Frontend Development": [
      { name: "React.js", icon: "react" },
      { name: "Next.js", icon: "react" },
      { name: "TypeScript", icon: "component" },
      { name: "Tailwind CSS", icon: "tailwind" },
      { name: "HTML5/CSS3", icon: "component" },
      { name: "JavaScript (ES6+)", icon: "component" },
    ],
    "Backend Development": [
      { name: "Node.js", icon: "component" },
      { name: "Express.js", icon: "component" },
      { name: "MongoDB", icon: "component" },
      { name: "PostgreSQL", icon: "component" },
      { name: "RESTful APIs", icon: "component" },
      { name: "GraphQL", icon: "component" },
    ],
    "DevOps & Tools": [
      { name: "Git", icon: "github" },
      { name: "Docker", icon: "component" },
      { name: "AWS", icon: "component" },
      { name: "CI/CD", icon: "component" },
      { name: "Linux", icon: "component" },
      { name: "Vercel", icon: "component" },
    ],
    "Design & Other": [
      { name: "UI/UX Design", icon: "component" },
      { name: "Figma", icon: "component" },
      { name: "Adobe XD", icon: "component" },
      { name: "Performance Optimization", icon: "component" },
      { name: "SEO", icon: "component" },
      { name: "Analytics", icon: "google" },
    ],
  };

  return (
    <>
      <Head>
        <title>About Me - Karthik Nishanth | Full Stack Developer</title>
        <meta
          name="description"
          content="Full Stack Developer specializing in modern web technologies, based in Liverpool. Expertise in React, Node.js, and cloud technologies."
        />
      </Head>
      <div className="min-h-screen bg-black/95 p-8 relative">
        <BackgroundBeamsWithCollision className="absolute inset-0 -z-10" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto space-y-8"
        >
          <Card className="border-none bg-black/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-4xl md:text-5xl font-bold text-white">
                About Me
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-xl text-gray-300">
                Hey! I&apos;m Karthik Nishanth, a Full Stack Developer based in
                Liverpool with a passion for building elegant, efficient, and
                user-friendly web applications.
              </p>
              <p className="text-xl text-gray-300">
                Currently freelancing and open to new opportunities, I combine
                technical expertise with creative problem-solving to deliver
                outstanding digital solutions.
              </p>
              <p className="text-xl text-gray-300">
                With over 5 years of experience in web development, I've had the
                privilege of working with diverse clients across various
                industries. My approach combines technical excellence with a
                deep understanding of business needs.
              </p>
            </CardContent>
          </Card>

          <Card className="border-none bg-black/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-white">
                Technical Expertise
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {Object.entries(skills).map(([category, skillList]) => (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="space-y-4"
                  >
                    <h3 className="text-xl font-semibold text-blue-400">
                      {category}
                    </h3>
                    <Separator className="bg-gray-800" />
                    <div className="flex flex-wrap gap-2">
                      {skillList.map((skill) => (
                        <Badge
                          key={skill.name}
                          variant="secondary"
                          className="bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 transition-colors"
                        >
                          {skill.icon && Icons[skill.icon] && (
                            <span className="mr-1">
                              {Icons[skill.icon]({
                                className: "h-3 w-3 inline",
                              })}
                            </span>
                          )}
                          {skill.name}
                        </Badge>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-none bg-black/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-white">
                Work Philosophy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xl text-gray-300">
                I believe in writing clean, maintainable code that scales. My
                development approach focuses on three core principles:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 rounded-lg bg-gray-800/30">
                  <h4 className="text-lg font-semibold text-blue-400 mb-2">
                    Performance First
                  </h4>
                  <p className="text-gray-300">
                    Optimizing for speed and efficiency at every level of the
                    application stack.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-gray-800/30">
                  <h4 className="text-lg font-semibold text-blue-400 mb-2">
                    User-Centered Design
                  </h4>
                  <p className="text-gray-300">
                    Creating intuitive interfaces that provide excellent user
                    experiences.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-gray-800/30">
                  <h4 className="text-lg font-semibold text-blue-400 mb-2">
                    Future-Proof Solutions
                  </h4>
                  <p className="text-gray-300">
                    Building scalable applications that can grow with your
                    business.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none bg-black/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-white">
                Professional Journey
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xl text-gray-300">
                My journey in tech has been driven by continuous learning and
                adaptation to new technologies. I've worked with startups,
                established businesses, and everything in between, helping them
                achieve their digital transformation goals.
              </p>
              <p className="text-xl text-gray-300">
                Whether it's building complex web applications, optimizing
                performance, or implementing robust backend systems, I bring a
                wealth of experience and a problem-solving mindset to every
                project.
              </p>
            </CardContent>
          </Card>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center space-y-4"
          >
            <p className="text-xl text-gray-300">
              Ready to bring your project to life?
            </p>
            <Button
              asChild
              size="lg"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold"
            >
              <Link href="/contact">Let&apos;s Work Together →</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}

export default About;
