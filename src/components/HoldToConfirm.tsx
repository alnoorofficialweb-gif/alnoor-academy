"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2 } from "lucide-react";

export interface HoldToConfirmProps {
  /** Callback fired when the user holds until 100% */
  onConfirm: () => void | Promise<void>;
  /** Hold duration in milliseconds (default: 1500ms) */
  duration?: number;
  /** Initial button label */
  label?: string;
  /** Label while user is actively holding */
  holdingLabel?: string;
  /** Label once confirmed */
  confirmedLabel?: string;
  /** Optional icon on the left */
  icon?: React.ReactNode;
  /** Optional icon shown upon confirmation */
  confirmedIcon?: React.ReactNode;
  /** Color & visual styling variant */
  variant?: "primary" | "destructive" | "outline";
  /** Button sizing */
  size?: "sm" | "md" | "lg";
  /** Disabled state */
  disabled?: boolean;
  /** Time in ms before resetting back to initial state (default: 2000, 0 = stay confirmed) */
  autoResetDelay?: number;
  /** Extra class names */
  className?: string;
}

export default function HoldToConfirm({
  onConfirm,
  duration = 1500,
  label = "Hold to Confirm",
  holdingLabel = "Keep Holding...",
  confirmedLabel = "Confirmed!",
  icon,
  confirmedIcon,
  variant = "primary",
  size = "md",
  disabled = false,
  autoResetDelay = 2200,
  className = "",
}: HoldToConfirmProps) {
  const [progress, setProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const requestRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const resetTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up animation frames & timeouts
  const cancelHold = useCallback(() => {
    if (isConfirmed || isLoading) return;
    setIsHolding(false);
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
      requestRef.current = null;
    }
    startTimeRef.current = null;
    setProgress(0);
  }, [isConfirmed, isLoading]);

  // Loop step for smooth 60fps progress update
  const step = useCallback(
    async (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }
      const elapsed = timestamp - startTimeRef.current;
      const currentProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(currentProgress);

      if (currentProgress < 100) {
        requestRef.current = requestAnimationFrame(step);
      } else {
        // Complete!
        setIsHolding(false);
        setIsConfirmed(true);
        setProgress(100);

        try {
          setIsLoading(true);
          await onConfirm();
        } catch (error) {
          console.error("Hold to confirm execution error:", error);
        } finally {
          setIsLoading(false);
        }

        // Auto reset if specified
        if (autoResetDelay > 0) {
          resetTimeoutRef.current = setTimeout(() => {
            setIsConfirmed(false);
            setProgress(0);
          }, autoResetDelay);
        }
      }
    },
    [duration, onConfirm, autoResetDelay]
  );

  const startHold = useCallback(() => {
    if (disabled || isConfirmed || isLoading) return;
    setIsHolding(true);
    startTimeRef.current = null;
    requestRef.current = requestAnimationFrame(step);
  }, [disabled, isConfirmed, isLoading, step]);

  useEffect(() => {
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
    };
  }, []);

  // Variant color definitions
  const variantStyles = {
    primary: {
      base: "bg-emerald-50 dark:bg-emerald-950/40 text-[#064e3b] dark:text-emerald-300 border border-emerald-200/90 dark:border-emerald-800/80 hover:border-emerald-300",
      fill: "bg-[#064e3b] dark:bg-emerald-600",
      textHold: "text-white",
      confirmed: "bg-[#064e3b] text-white border-transparent",
    },
    destructive: {
      base: "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800/80 hover:border-red-300",
      fill: "bg-red-600 dark:bg-red-600",
      textHold: "text-white",
      confirmed: "bg-red-700 text-white border-transparent",
    },
    outline: {
      base: "bg-zinc-100 dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300",
      fill: "bg-zinc-900 dark:bg-zinc-100",
      textHold: "text-white dark:text-zinc-950",
      confirmed: "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 border-transparent",
    },
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs rounded-lg gap-1.5",
    md: "px-4 py-2 text-xs sm:text-sm rounded-xl gap-2",
    lg: "px-6 py-3 text-sm sm:text-base rounded-2xl gap-2.5",
  };

  const activeVariant = variantStyles[variant];

  return (
    <button
      type="button"
      disabled={disabled || isLoading}
      onMouseDown={startHold}
      onMouseUp={cancelHold}
      onMouseLeave={cancelHold}
      onTouchStart={startHold}
      onTouchEnd={cancelHold}
      onTouchCancel={cancelHold}
      onKeyDown={(e) => {
        if ((e.key === " " || e.key === "Enter") && !isHolding) {
          e.preventDefault();
          startHold();
        }
      }}
      onKeyUp={(e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          cancelHold();
        }
      }}
      className={`relative overflow-hidden font-bold select-none cursor-pointer transition-all duration-200 flex items-center justify-center shrink-0 ${
        isConfirmed ? activeVariant.confirmed : activeVariant.base
      } ${sizeStyles[size]} ${
        isHolding ? "scale-[0.98] shadow-inner" : "shadow-xs hover:shadow-sm"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
      aria-label={label}
    >
      {/* Background Liquid Progress Fill */}
      {!isConfirmed && (
        <motion.div
          className={`absolute inset-y-0 left-0 ${activeVariant.fill}`}
          style={{ width: `${progress}%` }}
          transition={{ ease: "linear" }}
        />
      )}

      {/* Button Content */}
      <span
        className={`relative z-10 flex items-center justify-center transition-colors duration-150 ${
          progress > 50 && !isConfirmed ? activeVariant.textHold : ""
        }`}
      >
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.span
              key="loading"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-1.5"
            >
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Processing...</span>
            </motion.span>
          ) : isConfirmed ? (
            <motion.span
              key="confirmed"
              initial={{ opacity: 0, y: 4, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.9 }}
              className="flex items-center gap-1.5"
            >
              {confirmedIcon || <Check className="w-4 h-4 stroke-[2.5]" />}
              <span>{confirmedLabel}</span>
            </motion.span>
          ) : isHolding ? (
            <motion.span
              key="holding"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex items-center gap-1.5"
            >
              <span>{holdingLabel}</span>
              <span className="text-[10px] font-mono opacity-80">
                {Math.round(progress)}%
              </span>
            </motion.span>
          ) : (
            <motion.span
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-1.5"
            >
              {icon}
              <span>{label}</span>
            </motion.span>
          )}
        </AnimatePresence>
      </span>
    </button>
  );
}
