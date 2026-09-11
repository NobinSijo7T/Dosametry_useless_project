import React from 'react';

export default function LogoIcon({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      className={className || "w-7 h-7 text-foreground"}
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      {...props}
    >
      <circle cx="50" cy="50" r="42" strokeDasharray="6 4" />
      <circle cx="50" cy="50" r="28" />
      <circle cx="50" cy="50" r="14" strokeDasharray="3 3" />
      <line x1="50" y1="4" x2="50" y2="96" strokeWidth="1.5" />
      <line x1="4" y1="50" x2="96" y2="50" strokeWidth="1.5" />
    </svg>
  );
}
