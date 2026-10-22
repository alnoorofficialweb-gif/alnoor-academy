"use client";

import React, { useEffect, useState, useRef } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);
  const [isBouncing, setIsBouncing] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
    const isDark =
      document.documentElement.classList.contains("dark") ||
      localStorage.getItem("theme") === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    if (isDark) {
      document.documentElement.classList.add("dark");
      setTheme("dark");
    } else {
      document.documentElement.classList.remove("dark");
      setTheme("light");
    }
  }, []);

  const spawnParticles = (x: number, y: number, nextTheme: "light" | "dark") => {
    if (typeof document === "undefined") return;
    const count = 18;
    const colors =
      nextTheme === "dark"
        ? ["#10b981", "#34d399", "#6ee7b7", "#059669", "#fbbf24"]
        : ["#f59e0b", "#fbbf24", "#fef08a", "#10b981", "#ffffff"];

    for (let i = 0; i < count; i++) {
      const particle = document.createElement("span");
      particle.className = "theme-burst-particle";
      const angle = (i / count) * 2 * Math.PI + (Math.random() - 0.5) * 0.4;
      const distance = 35 + Math.random() * 65;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;
      const size = 3 + Math.random() * 4;

      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.backgroundColor = colors[i % colors.length];
      particle.style.boxShadow = `0 0 10px ${colors[i % colors.length]}`;
      particle.style.setProperty("--tx", `${tx}px`);
      particle.style.setProperty("--ty", `${ty}px`);

      document.body.appendChild(particle);
      setTimeout(() => {
        particle.remove();
      }, 700);
    }
  };

  const triggerFallbackWave = (
    x: number,
    y: number,
    maxRadius: number,
    nextTheme: "light" | "dark"
  ) => {
    if (typeof document === "undefined") return;
    const wave = document.createElement("div");
    wave.className = "theme-splash-wave";
    const size = maxRadius * 2.2;
    wave.style.width = `${size}px`;
    wave.style.height = `${size}px`;
    wave.style.left = `${x}px`;
    wave.style.top = `${y}px`;
    wave.style.backgroundColor = nextTheme === "dark" ? "#09090b" : "#ffffff";
    document.body.appendChild(wave);
    setTimeout(() => {
      wave.remove();
    }, 650);
  };

  const applyTheme = (nextTheme: "light" | "dark") => {
    setTheme(nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const toggleTheme = (e: React.MouseEvent<HTMLButtonElement>) => {
    const nextTheme = theme === "dark" ? "light" : "dark";

    // 1. Button spring bounce animation
    setIsBouncing(true);
    setTimeout(() => setIsBouncing(false), 350);

    // 2. Calculate origin coordinates
    const rect = buttonRef.current?.getBoundingClientRect();
    const x =
      e.clientX ||
      (rect ? rect.left + rect.width / 2 : window.innerWidth / 2);
    const y =
      e.clientY || (rect ? rect.top + rect.height / 2 : 32);

    // 3. Trigger luminous particle burst
    spawnParticles(x, y, nextTheme);

    // 4. Calculate maximum radius to cover viewport
    const maxRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    // 5. High-Fidelity Circular Splash via View Transitions API
    if (typeof document !== "undefined" && "startViewTransition" in document) {
      const docWithVT = document as unknown as {
        startViewTransition: (cb: () => void) => {
          ready: Promise<void>;
        };
      };

      const transition = docWithVT.startViewTransition(() => {
        applyTheme(nextTheme);
      });

      transition.ready.then(() => {
        const clipPath = [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${maxRadius}px at ${x}px ${y}px)`,
        ];

        document.documentElement.animate(
          {
            clipPath: clipPath,
          },
          {
            duration: 650,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            pseudoElement: "::view-transition-new(root)",
          }
        );
      });
    } else {
      // Fallback circular splash wave for older browsers
      triggerFallbackWave(x, y, maxRadius, nextTheme);
      applyTheme(nextTheme);
    }
  };

  if (!mounted) {
    return (
      <div className="w-8 h-8 rounded-xl bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
    );
  }

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className={`relative w-8 h-8 rounded-xl border border-zinc-200/90 dark:border-zinc-700/80 bg-zinc-50 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 flex items-center justify-center transition-all cursor-pointer overflow-hidden ${
        isBouncing ? "scale-85" : "scale-100 hover:scale-105 active:scale-90"
      }`}
    >
      <div className="relative w-4 h-4 flex items-center justify-center pointer-events-none">
        {/* Sun Icon */}
        <span
          className={`absolute inset-0 flex items-center justify-center transition-all duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
            theme === "dark"
              ? "opacity-100 scale-100 rotate-0 text-amber-400"
              : "opacity-0 scale-40 -rotate-90 pointer-events-none text-amber-400"
          }`}
        >
          <Sun className="w-4 h-4" />
        </span>

        {/* Moon Icon */}
        <span
          className={`absolute inset-0 flex items-center justify-center transition-all duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
            theme === "dark"
              ? "opacity-0 scale-40 rotate-90 pointer-events-none text-emerald-800"
              : "opacity-100 scale-100 rotate-0 text-emerald-800"
          }`}
        >
          <Moon className="w-4 h-4" />
        </span>
      </div>
    </button>
  );
}
