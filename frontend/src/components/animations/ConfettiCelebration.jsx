import React, { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

const ConfettiCelebration = ({ trigger, duration = 3000, onComplete }) => {
  const canvasRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!trigger) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const defaults = {
      colors: ['#10b981', '#3b82f6', '#d946ef', '#f59e0b', '#ef4444'],
      shapes: ['square', 'circle'],
      ticks: 200,
      gravity: 1.2,
      scalar: 1.2,
      drift: 0,
      origin: { x: 0.5, y: 0.5 }
    };

    // Multiple confetti bursts
    const fireConfetti = () => {
      // Left burst
      confetti({
        ...defaults,
        particleCount: 50,
        spread: 60,
        origin: { x: 0.3, y: 0.6 }
      });

      // Right burst
      setTimeout(() => {
        confetti({
          ...defaults,
          particleCount: 50,
          spread: 60,
          origin: { x: 0.7, y: 0.6 }
        });
      }, 100);

      // Center burst
      setTimeout(() => {
        confetti({
          ...defaults,
          particleCount: 80,
          spread: 90,
          origin: { x: 0.5, y: 0.5 }
        });
      }, 200);

      // Top burst
      setTimeout(() => {
        confetti({
          ...defaults,
          particleCount: 60,
          angle: 90,
          spread: 45,
          origin: { x: 0.5, y: 0.3 }
        });
      }, 300);
    };

    // Initial burst
    fireConfetti();

    // Repeat bursts
    const interval = setInterval(() => {
      fireConfetti();
    }, 1000);

    // Cleanup
    timeoutRef.current = setTimeout(() => {
      clearInterval(interval);
      if (onComplete) onComplete();
    }, duration);

    return () => {
      clearInterval(interval);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [trigger, duration, onComplete]);

  if (!trigger) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-50"
      style={{ pointerEvents: 'none' }}
    />
  );
};

export default ConfettiCelebration;