'use client';

import { useEffect, useRef } from 'react';

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let W: number, H: number;
    let mouse = { x: -1000, y: -1000, radius: 180 };
    let time = 0;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };

    // Kolam grid points
    interface Point {
      x: number;
      y: number;
      r: number;
      baseAlpha: number;
    }
    let points: Point[] = [];

    const initPoints = () => {
      points = [];
      const spacing = 80;
      const cols = Math.ceil(W / spacing) + 1;
      const rows = Math.ceil(H / spacing) + 1;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          // Stagger alternate rows for sacred Kolam diamond pattern
          const offsetX = (j % 2 === 1) ? spacing / 2 : 0;
          points.push({
            x: i * spacing + offsetX,
            y: j * spacing,
            r: (i % 3 === 0 && j % 3 === 0) ? 2.2 : 1.2,
            baseAlpha: (i % 3 === 0 && j % 3 === 0) ? 0.22 : 0.08,
          });
        }
      }
    };

    const drawPolarReticle = (centerX: number, centerY: number) => {
      // Concentric metrology rings
      const rings = [120, 240, 380, 540, 720];
      ctx.save();
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(253, 251, 247, 0.04)';

      rings.forEach(r => {
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Subtle degree radial spokes
      const angles = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];
      ctx.strokeStyle = 'rgba(253, 251, 247, 0.025)';
      angles.forEach(deg => {
        const rad = (deg * Math.PI) / 180;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(centerX + Math.cos(rad) * 800, centerY + Math.sin(rad) * 800);
        ctx.stroke();
      });

      ctx.restore();
    };

    const animate = () => {
      time += 0.015;
      ctx.clearRect(0, 0, W, H);

      // Background subtle cast-iron grain gradient
      const bgGrad = ctx.createRadialGradient(W / 2, H / 3, 50, W / 2, H / 2, Math.max(W, H) * 0.8);
      bgGrad.addColorStop(0, '#10131a');
      bgGrad.addColorStop(1, '#0c0e12');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      // Draw subtle metrology coordinate reticle behind hero
      drawPolarReticle(W / 2, Math.min(H * 0.45, 450));

      // Draw Kolam sacred geometry nodes with proximity glow
      points.forEach(p => {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        let alpha = p.baseAlpha;
        let radius = p.r;
        let color = '#fdfbf7';

        if (dist < mouse.radius) {
          const factor = (1 - dist / mouse.radius);
          alpha += factor * 0.45;
          radius += factor * 1.5;
          color = '#f59e0b'; // Warm golden ghee response
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = alpha;
        ctx.fill();
      });

      // Draw faint fluid Archimedean spiral curl from center
      if (!prefersReducedMotion) {
        ctx.save();
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.04)';
        ctx.lineWidth = 1.5;
        const cx = W / 2;
        const cy = Math.min(H * 0.45, 450);
        ctx.beginPath();
        for (let a = 0; a < Math.PI * 8; a += 0.1) {
          const r = 12 + a * 14;
          const theta = a + time * 0.2;
          const x = cx + Math.cos(theta) * r;
          const y = cy + Math.sin(theta) * r;
          if (a === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.restore();
      }

      ctx.globalAlpha = 1;

      if (!prefersReducedMotion) {
        animationId = requestAnimationFrame(animate);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    resize();
    initPoints();
    animate();

    window.addEventListener('resize', () => {
      resize();
      initPoints();
      if (prefersReducedMotion) animate();
    });
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}
