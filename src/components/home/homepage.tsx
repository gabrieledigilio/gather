"use client";

import { motion } from "framer-motion";
import { ArrowRight, Brain, Code2, Rocket } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const HIGHLIGHTS = [
  {
    icon: Brain,
    text: "AI learns your stack, interests, and hackathon vibe",
  },
  {
    icon: Code2,
    text: "Hackathons, meetups, and workshops — ranked for builders",
  },
  {
    icon: Rocket,
    text: "One perfect event match, ready when you open the app",
  },
];

export function Homepage() {
  return (
    <div className="relative flex min-h-dvh flex-col">
      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-6 py-8 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center"
        >
          <p className="text-sm font-medium text-rainbow">AI for builders & hackathon crews</p>
          <h1 className="mt-3 font-heading text-4xl leading-[1.1] tracking-tight sm:text-5xl">
            Open the app.{" "}
            <span className="text-rainbow">Your event</span> is already chosen.
          </h1>
          <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
            Gather uses AI to find the one event you should hit today — hackathons,
            dev meetups, demo days, workshops. Built for technical people who’d
            rather ship than scroll.
          </p>
        </motion.div>

        <motion.ul
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="mt-6 space-y-2.5"
        >
          {HIGHLIGHTS.map(({ icon: Icon, text }) => (
            <li key={text} className="glass-card flex items-center gap-3 px-4 py-3.5">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-rainbow shadow-sm">
                <Icon className="size-4 text-white" strokeWidth={2.25} />
              </div>
              <span className="text-sm">{text}</span>
            </li>
          ))}
        </motion.ul>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          className="mt-6 flex justify-center"
        >
          <Button
            asChild
            size="lg"
            className="btn-rainbow h-14 w-full max-w-sm rounded-full text-base font-semibold sm:w-auto sm:px-12"
          >
            <Link href="/onboarding">
              Let&apos;s have fun!
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </motion.div>
      </main>
    </div>
  );
}
