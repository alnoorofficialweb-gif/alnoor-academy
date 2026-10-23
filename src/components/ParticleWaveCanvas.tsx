"use client";

import React, { useEffect, useRef } from "react";

interface ParticleWaveCanvasProps {
  className?: string;
}

/**
 * 3D Architectural Ribbed Slat Wave Sculpture
 * Features:
 * - Smooth undulating flowing motion on the 3D green ribbed pattern
 * - Deep dark contrast overlay (lower transparency) ensuring 100% crystal-clear text readability
 * - Rich ambient celestial particle field (increased particle density with gentle floating & twinkling)
 */
export default function ParticleWaveCanvas({
  className = "",
}: ParticleWaveCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 420);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      const newWidth = canvas.parentElement.clientWidth;
      const newHeight = canvas.parentElement.clientHeight;
      if (newWidth > 0 && newHeight > 0) {
        width = canvas.width = newWidth;
        height = canvas.height = newHeight;
      }
    };

    window.addEventListener("resize", handleResize);

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    // Increased particle count (richer stardust field)
    const DUST_COUNT = 85;
    const dustParticles: Array<{
      x: number;
      y: number;
      r: number;
      baseAlpha: number;
      alpha: number;
      speedY: number;
      driftX: number;
      twinkleSpeed: number;
      twinklePhase: number;
    }> = [];

    for (let i = 0; i < DUST_COUNT; i++) {
      const baseAlpha = Math.random() * 0.5 + 0.25;
      dustParticles.push({
        x: Math.random() * width,
        y: Math.random() * (height * 0.75),
        r: Math.random() * 1.5 + 0.5,
        baseAlpha,
        alpha: baseAlpha,
        speedY: Math.random() * 0.25 + 0.06,
        driftX: (Math.random() - 0.5) * 0.15,
        twinkleSpeed: Math.random() * 0.03 + 0.015,
        twinklePhase: Math.random() * Math.PI * 2,
      });
    }

    let isVisible = true;
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    observer.observe(canvas);

    let frameCount = 0;

    const render = () => {
      if (isVisible) {
        frameCount++;
        ctx.clearRect(0, 0, width, height);

        // 1. Subtle procedural flowing emerald light ripple across the lower wave area
        const wavePhase = frameCount * 0.018;
        ctx.save();
        ctx.globalCompositeOperation = "screen";

        const waveGrad = ctx.createLinearGradient(0, height * 0.45, 0, height);
        waveGrad.addColorStop(0, "rgba(5, 150, 105, 0)");
        waveGrad.addColorStop(0.5, "rgba(16, 185, 129, 0.06)");
        waveGrad.addColorStop(1, "rgba(52, 211, 153, 0.12)");

        ctx.beginPath();
        ctx.moveTo(0, height);
        for (let x = 0; x <= width; x += 20) {
          const waveY =
            height * 0.7 +
            Math.sin(x * 0.01 + wavePhase) * 12 +
            Math.cos(x * 0.018 - wavePhase * 0.8) * 8;
          ctx.lineTo(x, waveY);
        }
        ctx.lineTo(width, height);
        ctx.closePath();
        ctx.fillStyle = waveGrad;
        ctx.fill();
        ctx.restore();

        // 2. Rich celestial particles drifting gently with subtle twinkling
        dustParticles.forEach((p) => {
          p.y -= p.speedY;
          p.x += p.driftX;
          p.twinklePhase += p.twinkleSpeed;
          p.alpha = Math.max(0.1, p.baseAlpha + Math.sin(p.twinklePhase) * 0.25);

          // Wrap around top or sides
          if (p.y < 4) {
            p.y = height * 0.72;
            p.x = Math.random() * width;
          }
          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;

          // Soft glowing stardust dot
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(167, 243, 208, ${p.alpha})`;
          ctx.fill();

          // Subtle glow halo for larger focal particles
          if (p.r > 1.2) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r * 2.2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(52, 211, 153, ${p.alpha * 0.2})`;
            ctx.fill();
          }
        });
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div
      className={`absolute inset-0 w-full h-full pointer-events-none overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* 1. 3D Architectural Ribbed Slat Wave with Smooth Flowing Undulation */}
      <img
        src="/images/architectural-wave.jpg"
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-bottom animate-wave-flow"
        aria-hidden="true"
      />

      {/* 2. Enhanced Contrast Dark Overlay (Reduced Transparency - 100% Crisp Text Readability) */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#010906] via-[#010906]/94 to-[#010906]/65" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_65%_at_50%_35%,_rgba(1,9,6,0.94)_0%,_rgba(1,9,6,0.72)_60%,_transparent_100%)]" />

      {/* 3. Subtle Bottom Horizon Shade */}
      <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#010906] to-transparent opacity-80" />

      {/* 4. Live Floating Celestial Stardust Canvas Overlay */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        aria-hidden="true"
      />
    </div>
  );
}
