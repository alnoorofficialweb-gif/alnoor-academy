"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface AnimatedProgramButtonProps {
  href: string;
  label?: string;
  className?: string;
}

export default function AnimatedProgramButton({
  href,
  label = "View All Programs",
  className = "",
}: AnimatedProgramButtonProps) {
  return (
    <Link
      href={href}
      className={`btn-150-islamic group ${className}`}
      aria-label={label}
    >
      <span>{label}</span>
      <ArrowRight className="button-icon w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
    </Link>
  );
}
