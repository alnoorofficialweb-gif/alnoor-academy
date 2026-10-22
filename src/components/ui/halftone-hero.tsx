"use client";

import React, { useEffect, useRef } from "react";

interface HalftoneHeroProps {
  text?: string;
  className?: string;
}

interface Dot {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  isText: boolean;
  alpha: number;
  baseAlpha: number;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  speed: number;
}

export default function HalftoneHero({
  text = "AL-Noor",
  className = "",
}: HalftoneHeroProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;
    let dpr = 1;

    let dots: Dot[] = [];
    const ripples: Ripple[] = [];

    const mouse = {
      x: -9999,
      y: -9999,
      prevX: -9999,
      prevY: -9999,
      isHovered: false,
    };

    // Check dark mode
    let isDark = document.documentElement.classList.contains("dark");
    const themeObserver = new MutationObserver(() => {
      isDark = document.documentElement.classList.contains("dark");
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const initDots = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = container.clientWidth;
      height = container.clientHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);

      // Create an offscreen canvas to sample the wordmark typography
      const offscreen = document.createElement("canvas");
      offscreen.width = width;
      offscreen.height = height;
      const offCtx = offscreen.getContext("2d");
      if (!offCtx) return;

      offCtx.clearRect(0, 0, width, height);

      // Font size scaling based on container width
      const fontSize = Math.min(width * 0.22, 160);
      offCtx.font = `900 ${fontSize}px Inter, system-ui, -apple-system, sans-serif`;
      offCtx.textAlign = "center";
      offCtx.textBaseline = "middle";
      offCtx.fillStyle = "#ffffff";

      // Center the wordmark vertically in the top 45% of the hero
      const centerY = height * 0.42;
      offCtx.fillText(text, width / 2, centerY);

      // Sample pixel data from offscreen canvas
      const imgData = offCtx.getImageData(0, 0, width, height).data;

      dots = [];
      const step = Math.max(8, Math.floor(width / 95)); // adaptive grid step

      for (let y = step; y < height - step; y += step) {
        for (let x = step; x < width - step; x += step) {
          const index = (y * width + x) * 4;
          const alpha = imgData[index + 3]; // 0 - 255

          if (alpha > 40) {
            // Dot inside the wordmark
            const normalizedAlpha = alpha / 255;
            const r = 1.6 + normalizedAlpha * 2.8;
            dots.push({
              x,
              y,
              originX: x,
              originY: y,
              vx: 0,
              vy: 0,
              radius: r,
              baseRadius: r,
              isText: true,
              alpha: Math.min(0.25 + normalizedAlpha * 0.45, 0.7),
              baseAlpha: Math.min(0.25 + normalizedAlpha * 0.45, 0.7),
            });
          } else if (Math.random() < 0.16) {
            // Ambient halftone dot scattered in background
            const r = 0.8 + Math.random() * 0.7;
            dots.push({
              x,
              y,
              originX: x,
              originY: y,
              vx: 0,
              vy: 0,
              radius: r,
              baseRadius: r,
              isText: false,
              alpha: 0.08 + Math.random() * 0.08,
              baseAlpha: 0.08 + Math.random() * 0.08,
            });
          }
        }
      }
    };

    initDots();

    const handleResize = () => {
      initDots();
    };

    window.addEventListener("resize", handleResize);

    // Mouse events
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.isHovered = true;
    };

    const handleMouseLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
      mouse.isHovered = false;
    };

    const handleClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      ripples.push({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        radius: 0,
        maxRadius: 320,
        speed: 7,
      });
    };

    // Touch events for mobile
    const handleTouchMove = (e: TouchEvent) => {
      if (!e.touches[0]) return;
      const rect = container.getBoundingClientRect();
      mouse.x = e.touches[0].clientX - rect.left;
      mouse.y = e.touches[0].clientY - rect.top;
      mouse.isHovered = true;
    };

    const handleTouchEnd = () => {
      mouse.x = -9999;
      mouse.y = -9999;
      mouse.isHovered = false;
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);
    container.addEventListener("click", handleClick);
    container.addEventListener("touchmove", handleTouchMove, { passive: true });
    container.addEventListener("touchend", handleTouchEnd);

    // Animation Render Loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Expand & update click ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const ripple = ripples[i];
        ripple.radius += ripple.speed;
        if (ripple.radius > ripple.maxRadius) {
          ripples.splice(i, 1);
        }
      }

      // Physics constants
      const mouseRadius = 140;
      const mouseRadiusSq = mouseRadius * mouseRadius;

      // Color pallette based on mode
      const primaryTextDot = isDark ? "52, 211, 153" : "6, 78, 59"; // Emerald 400 vs Emerald 900
      const ambientDot = isDark ? "16, 185, 129" : "5, 150, 105"; // Mint vs Emerald 600

      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];

        // 1. Mouse physics (parting around cursor)
        const dx = dot.x - mouse.x;
        const dy = dot.y - mouse.y;
        const distSq = dx * dx + dy * dy;

        if (distSq < mouseRadiusSq && mouse.isHovered) {
          const dist = Math.sqrt(distSq);
          const force = (1 - dist / mouseRadius) * (dot.isText ? 32 : 18);
          const angle = Math.atan2(dy, dx);
          dot.vx += Math.cos(angle) * force * 0.4;
          dot.vy += Math.sin(angle) * force * 0.4;

          // Warm up dot size & alpha near cursor
          dot.radius = dot.baseRadius * (1 + (1 - dist / mouseRadius) * 0.6);
          dot.alpha = Math.min(dot.baseAlpha * 1.6, 0.95);
        } else {
          dot.radius += (dot.baseRadius - dot.radius) * 0.1;
          dot.alpha += (dot.baseAlpha - dot.alpha) * 0.1;
        }

        // 2. Click Shockwave ripple impulse
        for (let r = 0; r < ripples.length; r++) {
          const rip = ripples[r];
          const rx = dot.x - rip.x;
          const ry = dot.y - rip.y;
          const rDist = Math.hypot(rx, ry);
          const waveDist = Math.abs(rDist - rip.radius);

          if (waveDist < 30) {
            const waveForce = (1 - waveDist / 30) * 8;
            const rAngle = Math.atan2(ry, rx);
            dot.vx += Math.cos(rAngle) * waveForce;
            dot.vy += Math.sin(rAngle) * waveForce;
          }
        }

        // 3. Spring back to origin (no jittering)
        const springK = 0.07;
        const damping = 0.82;
        const homeDx = dot.originX - dot.x;
        const homeDy = dot.originY - dot.y;

        dot.vx += homeDx * springK;
        dot.vy += homeDy * springK;
        dot.vx *= damping;
        dot.vy *= damping;

        dot.x += dot.vx;
        dot.y += dot.vy;

        // 4. Draw Dot
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, Math.max(0.2, dot.radius), 0, Math.PI * 2);
        const rgb = dot.isText ? primaryTextDot : ambientDot;
        ctx.fillStyle = `rgba(${rgb}, ${dot.alpha})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      themeObserver.disconnect();
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      container.removeEventListener("click", handleClick);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [text]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden select-none pointer-events-auto ${className}`}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
      {/* Subtle radial fade overlay to ensure foreground hero text is 100% crystal-clear */}
      <div className="absolute inset-0 bg-radial from-transparent via-white/50 dark:via-zinc-950/40 to-white/90 dark:to-zinc-950/80 pointer-events-none" />
    </div>
  );
}
