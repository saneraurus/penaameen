"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ElementType } from "react";

type RevealProps = {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: ElementType;
};

export function Reveal({
  children,
  delay = 0,
  className = "",
  as = "div",
}: RevealProps) {
  const shouldReduceMotion = useReducedMotion();

  const MotionTag = motion[as as keyof typeof motion] as ElementType;

  return (
    <MotionTag
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: shouldReduceMotion ? 0.01 : 0.6,
        delay: shouldReduceMotion ? 0 : delay,
        ease: "easeOut",
      }}
      className={className}
    >
      {children}
    </MotionTag>
  );
}
