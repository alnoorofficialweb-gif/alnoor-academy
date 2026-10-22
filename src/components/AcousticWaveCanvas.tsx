"use client";

import React, { useEffect, useRef } from "react";

interface AcousticWaveCanvasProps {
  isPlaying: boolean;
  audioRef?: React.RefObject<HTMLAudioElement | null>;
  className?: string;
}

/**
 * Concentric Acoustic Radar Waves with Live Audio-Reactive Vibration & Ambient Floating Particles
 * - Pure native audio playback: ZERO Web Audio hijacking, ensuring 100% loud & clear audio sound.
 * - Dynamic Audio-Reactive Vibration: Rings visibly vibrate, surge, and pulse in sync with the recitation.
 * - Exact Transparency: Deep dark contrast when playing, faint whisper (9% opacity) when paused.
 * - Floating Particles: Soft, satisfying stardust motes with gentle transparency.
 */
export default function AcousticWaveCanvas({
  isPlaying,
  audioRef,
  className = "",
}: AcousticWaveCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 260);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener("resize", handleResize);

    // 1. Satisfying Floating Ambient Particles ("halki transparency ke sath")
    const PARTICLE_COUNT = 28;
    const particles: Array<{
      x: number;
      y: number;
      r: number;
      baseAlpha: number;
      vx: number;
      vy: number;
      wobbleSpeed: number;
      wobbleOffset: number;
    }> = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const baseAlpha = Math.random() * 0.2 + 0.1; // Soft, subtle transparency
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.3 + 0.5,
        baseAlpha: baseAlpha,
        vx: (Math.random() - 0.5) * 0.2,
        vy: -(Math.random() * 0.3 + 0.1), // Gentle upward drift
        wobbleSpeed: Math.random() * 0.02 + 0.01,
        wobbleOffset: Math.random() * Math.PI * 2,
      });
    }

    let time = 0;
    let ripplePulse = 0;

    let isVisible = true;
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    observer.observe(canvas);

    const render = () => {
      if (isVisible) {
        ctx.clearRect(0, 0, width, height);

        const audio = audioRef?.current;
        const curTime = audio && !isNaN(audio.currentTime) ? audio.currentTime : time;

        // 2. Audio-Reactive Tilawat Cadence & Energy Simulation
        // Simulates natural phrase surges, Madd vowels, and breath pauses
        let energy = 0.08;
        if (isPlaying) {
          const breathPhase = Math.sin(curTime * 0.8); // Natural breath pauses every ~6s
          const isBreathPause = breathPhase < -0.75;

          if (isBreathPause) {
            energy = 0.15; // Decelerates during breath pause
          } else {
            const syllable1 = Math.sin(curTime * 4.6) * 0.35;
            const syllable2 = Math.cos(curTime * 2.1) * 0.25;
            const vibratoWave = Math.sin(curTime * 9.5) * 0.2;
            energy = Math.max(0.2, Math.min(0.95, 0.5 + syllable1 + syllable2 + vibratoWave));
          }
        }

        // Speed modulation in sync with speech rhythm
        const speed = isPlaying ? 0.012 + energy * 0.015 : 0.002;
        time += speed;

        // Dynamic radar wave expansion: smooth, clearly moving ripples when playing, frozen when paused
        const pulseSpeed = isPlaying ? 0.95 + energy * 1.3 : 0;
        ripplePulse += pulseSpeed;

        const centerX = width * 0.5;
        const centerY = height * 0.5;
        const maxRadius = Math.sqrt(centerX * centerX + centerY * centerY) * 1.05;

        // 3. FLOATING PARTICLES (Very faint, soft ambient motes)
        particles.forEach((p) => {
          p.x += p.vx + Math.sin(time * 2 + p.wobbleOffset) * 0.15;
          p.y += p.vy * (isPlaying ? 0.8 + energy * 0.4 : 0.3);

          if (p.y < -10) {
            p.y = height + 10;
            p.x = Math.random() * width;
          }
          if (p.x < -10) p.x = width + 10;
          if (p.x > width + 10) p.x = -10;

          const pAlpha = isPlaying
            ? p.baseAlpha * 0.35
            : p.baseAlpha * 0.08;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(167, 243, 208, ${pAlpha})`;
          ctx.fill();
        });

        // 4. Subtle Center Horizontal Acoustic Datum Line (Subtle dark emerald)
        const beamAlpha = isPlaying ? 0.09 : 0.04;
        const beamGrad = ctx.createLinearGradient(0, centerY, width, centerY);
        beamGrad.addColorStop(0, "rgba(5, 150, 105, 0)");
        beamGrad.addColorStop(0.25, `rgba(5, 150, 105, ${beamAlpha * 0.4})`);
        beamGrad.addColorStop(0.5, `rgba(16, 185, 129, ${beamAlpha})`);
        beamGrad.addColorStop(0.75, `rgba(5, 150, 105, ${beamAlpha * 0.4})`);
        beamGrad.addColorStop(1, "rgba(5, 150, 105, 0)");
        ctx.fillStyle = beamGrad;
        ctx.fillRect(0, centerY - 0.5, width, 1.0);

        // 5. Concentric Acoustic Sound Wave Rings with Dark-Emerald Aesthetic
        // When stopped: softly visible ("halki halki nazar aati rahe" ~8-9%)
        // When playing: dark elegant emerald tone (~20-26% alpha, "2-3 ho lekin dark ho")
        const RING_COUNT = 8;
        ctx.save();
        ctx.shadowBlur = 0; // Zero neon glare for a clean dark look

        for (let i = 0; i < RING_COUNT; i++) {
          const rawRadius = (ripplePulse + (i * maxRadius) / RING_COUNT) % maxRadius;
          const progress = rawRadius / maxRadius; // 0 to 1

          let alpha = isPlaying
            ? Math.sin(progress * Math.PI) * (0.20 + energy * 0.07)
            : Math.sin(progress * Math.PI) * 0.085;

          if (progress < 0.08) alpha *= progress / 0.08;

          if (rawRadius > 10) {
            // Harmonic acoustic micro-vibration that pulses with recitation
            const acousticVibration = isPlaying
              ? Math.sin(curTime * 16 + i * 1.5) * (energy * 3.5) +
                Math.cos(time * 6 + i) * (energy * 1.8)
              : 0;

            const activeRadius = Math.max(6, rawRadius + acousticVibration);

            ctx.beginPath();
            ctx.arc(centerX, centerY, activeRadius, 0, Math.PI * 2);

            if (i % 2 === 0) {
              ctx.strokeStyle = `rgba(16, 185, 129, ${alpha * 1.05})`;
              ctx.lineWidth = isPlaying ? 1.0 : 0.6;
            } else {
              ctx.strokeStyle = `rgba(5, 150, 105, ${alpha * 0.9})`;
              ctx.lineWidth = isPlaying ? 0.8 : 0.5;
            }
            ctx.stroke();

            // 6. Lateral Spherical Lens Arcs (Delicate dark crescent highlights)
            if (activeRadius > 35 && activeRadius < maxRadius * 0.88) {
              const arcSpan = Math.PI * 0.32;
              const arcAlpha = alpha * (isPlaying ? 1.2 : 0.75);

              // Right lateral lens arc
              ctx.beginPath();
              ctx.arc(centerX, centerY, activeRadius, -arcSpan * 0.5, arcSpan * 0.5);
              ctx.strokeStyle = `rgba(52, 211, 153, ${arcAlpha})`;
              ctx.lineWidth = isPlaying ? 1.2 : 0.6;
              ctx.stroke();

              // Left lateral lens arc
              ctx.beginPath();
              ctx.arc(centerX, centerY, activeRadius, Math.PI - arcSpan * 0.5, Math.PI + arcSpan * 0.5);
              ctx.strokeStyle = `rgba(52, 211, 153, ${arcAlpha})`;
              ctx.lineWidth = isPlaying ? 1.2 : 0.6;
              ctx.stroke();
            }
          }
        }
        ctx.restore();

        // 7. Central Sound Core Emitter (Dark emerald whisper glow)
        const corePulse = Math.sin(time * 3) * (isPlaying ? 2 + energy * 3 : 0.5);
        const coreGrad = ctx.createRadialGradient(
          centerX,
          centerY,
          0,
          centerX,
          centerY,
          22 + corePulse
        );
        coreGrad.addColorStop(0, `rgba(16, 185, 129, ${isPlaying ? 0.15 : 0.05})`);
        coreGrad.addColorStop(0.5, `rgba(5, 150, 105, ${isPlaying ? 0.06 : 0.02})`);
        coreGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.fillStyle = coreGrad;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 32 + corePulse, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
    };
  }, [isPlaying, audioRef]);

  return (
    <div
      className={`absolute inset-0 w-full h-full pointer-events-none overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* 1. Exact Concentric Radar Waves Image: ~12% when playing, ~7% when stopped */}
      <img
        src="/images/concentric-sound-wave.jpg"
        alt=""
        className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ${
          isPlaying
            ? "opacity-[0.14] scale-[1.01] filter brightness-70 contrast-115"
            : "opacity-[0.08] scale-100 filter brightness-60 contrast-105"
        }`}
        aria-hidden="true"
      />

      {/* 2. Deep Obsidian-Emerald Radial Vignette ensuring 100% button & time bar contrast */}
      <div className="absolute inset-0 bg-radial from-transparent via-[#010a06]/70 to-[#010906]/98" />

      {/* 3. Live Audio-Reactive Canvas with Real Vibration & Floating Particles */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        aria-hidden="true"
      />
    </div>
  );
}
