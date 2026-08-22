"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ElementType, ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: ElementType;
  /** Narrative weight of the reveal. Larger scenes travel slightly further. */
  variant?: "micro" | "small" | "medium" | "large";
};

const distance: Record<NonNullable<RevealProps["variant"]>, number> = {
  micro: 6,
  small: 12,
  medium: 20,
  large: 32,
};

const duration: Record<NonNullable<RevealProps["variant"]>, number> = {
  micro: 0.32,
  small: 0.5,
  medium: 0.7,
  large: 0.95,
};

/**
 * Scroll reveal used across the storytelling sections.
 *
 * Motion is presentation only and always resolves to the final visible state,
 * so content and interaction never depend on animation completing.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
  as = "div",
  variant = "small",
}: RevealProps) {
  const shouldReduceMotion = useReducedMotion();

  const MotionTag = motion[as as keyof typeof motion] as ElementType;

  return (
    <MotionTag
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : distance[variant] }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: shouldReduceMotion ? 0.01 : duration[variant],
        delay: shouldReduceMotion ? 0 : delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </MotionTag>
  );
}

/**
 * Staggers children of a scene without changing their DOM order.
 */
export function RevealGroup({
  children,
  className = "",
  step = 0.08,
  variant = "small",
}: {
  children: ReactNode[];
  className?: string;
  step?: number;
  variant?: RevealProps["variant"];
}) {
  return (
    <div className={className}>
      {children.map((child, index) => (
        <Reveal key={index} delay={index * step} variant={variant}>
          {child}
        </Reveal>
      ))}
    </div>
  );
}
