"use client";

import React, { useRef } from "react";
import Link from "next/link";

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
  const btnRef = useRef<HTMLAnchorElement>(null);

  const updateCoordinates = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    btnRef.current.style.setProperty("--x", `${x}px`);
    btnRef.current.style.setProperty("--y", `${y}px`);
  };

  const updateTouchCoordinates = (e: React.TouchEvent<HTMLAnchorElement>) => {
    if (!btnRef.current || !e.touches[0]) return;
    const rect = btnRef.current.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const y = e.touches[0].clientY - rect.top;
    btnRef.current.style.setProperty("--x", `${x}px`);
    btnRef.current.style.setProperty("--y", `${y}px`);
  };

  return (
    <Link
      ref={btnRef}
      href={href}
      onMouseEnter={updateCoordinates}
      onMouseMove={updateCoordinates}
      onTouchStart={updateTouchCoordinates}
      className={`btn-150-islamic w-fit max-w-fit shrink-0 inline-flex items-center justify-center ${className}`}
      aria-label={label}
    >
      {/* Left sliding SVG arrow (slides into view from entry point on hover) */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="button-icon button-icon-left shrink-0"
        viewBox="0 0 24 24"
      >
        <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
      </svg>

      {/* Button text with pulsing status dot */}
      <span className="button-text whitespace-nowrap">
        <span className="pulse-dot" />
        <span>{label}</span>
      </span>

      {/* Right sliding SVG arrow (slides out to right on hover) */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="button-icon button-icon-right shrink-0"
        viewBox="0 0 24 24"
      >
        <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
      </svg>
    </Link>
  );
}
