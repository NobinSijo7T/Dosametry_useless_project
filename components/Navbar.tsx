"use client"
import { useState } from "react"
import Link from "next/link"
import { Home, Crosshair, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import LogoIcon from '@/assets/logo/logo-icon'
import { motion, AnimatePresence } from "framer-motion"

// Helper component for navigation links
const NavLink = ({ href, icon: Icon, label }: { href: string; icon: React.ComponentType<{ className?: string }>; label: string }) => (
  <Link 
    href={href} 
    className="group flex items-center gap-1.5 text-xs lg:text-sm font-medium text-foreground/75 hover:text-[#f59e0b] transition-colors whitespace-nowrap"
  >
    <Icon className="w-4 h-4 text-[#f59e0b]/80 group-hover:text-[#f59e0b] transition-colors" />
    <span>{label}</span>
  </Link>
)

export function NotchNavbar({ className, ...props }: React.HTMLAttributes<HTMLElement> & { logo?: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Minimal Site Navigation Items
  const items = {
    left: [
      { label: "Home", href: "#home", icon: Home }
    ],
    right: [
      { label: "Calibration Bay", href: "#analyzer", icon: Crosshair }
    ]
  }

  return (
    <>
      <header className={cn("fixed top-0 inset-x-0 z-50 h-16 flex px-0", className)} {...props}>
        
        {/* Left Side Bar - Flexible width */}
        <div className="flex-1 h-10 bg-zinc-50 dark:bg-[#0c0e12] z-20 relative min-w-0">
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            <line x1="0" y1="39.5" x2="100%" y2="39.5" stroke="currentColor" strokeOpacity={0.08} strokeWidth={0.5} className="text-foreground" />
            <line x1="0" y1="36.5" x2="100%" y2="36.5" stroke="currentColor" strokeOpacity={0.08} strokeWidth={0.5} className="text-foreground" />
          </svg>
        </div>

        {/* Responsive Notch Container - 3 Slices */}
        <div className="flex h-16 relative z-10 shrink-0 -ml-px">
          
          {/* Left Slice (Corner) */}
          <div className="w-[50px] h-full relative shrink-0">
            {/* Glass Background */}
            <div className="absolute inset-0 bg-zinc-50 dark:bg-[#0c0e12]" style={{ clipPath: "path('M0 0 H50 V64 C25 64 25 40 0 40 Z')" }} />
            {/* Outlines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 50 64">
              <path d="M0 39.5 C25 39.5 25 63.5 50 63.5" fill="none" stroke="currentColor" strokeOpacity={0.12} strokeWidth={0.5} className="text-[#f59e0b]" />
              <path d="M0 36.5 C25 36.5 25 60.5 50 60.5" fill="none" stroke="currentColor" strokeOpacity={0.08} strokeWidth={0.5} className="text-foreground" />
            </svg>
          </div>

          {/* Center Slice (Flexible Content Area) */}
          <div className="flex-1 h-full relative min-w-0 -ml-px">
             {/* Background & Lines Layer */}
             <div className="absolute inset-0 bg-zinc-50 dark:bg-[#0c0e12]">
                 <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
                   <line x1="0" y1="63.5" x2="100%" y2="63.5" stroke="currentColor" strokeOpacity={0.12} strokeWidth={0.5} className="text-[#f59e0b]" />
                   <line x1="0" y1="60.5" x2="100%" y2="60.5" stroke="currentColor" strokeOpacity={0.08} strokeWidth={0.5} className="text-foreground" />
                 </svg>
             </div>

             {/* Content Layer - Perfectly Balanced across Logo */}
             <div className="relative w-full h-full flex items-end justify-between md:justify-center pb-2 px-4 md:px-8 gap-6 md:gap-8">
               
               {/* Desktop Left Nav */}
               <nav className="hidden md:flex gap-6 mb-1 shrink-0 items-center">
                {items.left.map(item => (
                  <NavLink key={item.label} {...item} />
                ))}
              </nav>

              {/* Mobile Menu Button (Left) */}
              <button 
                className="md:hidden mb-1 p-1 text-foreground/70 hover:text-[#f59e0b] transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5 text-[#f59e0b]" /> : <Menu className="w-5 h-5" />}
              </button>

              {/* Directorate Reticle Logo (Center) */}
              <div className="flex justify-center shrink-0 mx-2 md:mx-4 mt-1">
                {props.logo || (
                  <Link href="#home" className="flex items-center justify-center relative group" title="National Metrology Directorate for Dosa Circularity">
                    <LogoIcon className="w-7 h-7 text-[#f59e0b] animate-spin-slow group-hover:scale-110 transition-transform relative z-10 drop-shadow-[0_0_8px_rgba(245,158,11,0.3)]" />
                  </Link>
                )}
              </div>

              {/* Desktop Right Nav */}
              <nav className="hidden md:flex gap-6 items-center shrink-0 mb-1">
                {items.right.map(item => (
                  <NavLink key={item.label} {...item} />
                ))}
              </nav>

              {/* Mobile Spacer (Right) to keep center aligned */}
              <div className="md:hidden w-5 mb-1" />

             </div>
          </div>

          {/* Right Slice (Corner) */}
          <div className="w-[50px] h-full relative shrink-0 -ml-px">
            {/* Glass Background */}
            <div className="absolute inset-0 bg-zinc-50 dark:bg-[#0c0e12]" style={{ clipPath: "path('M0 0 H50 V40 C25 40 25 64 0 64 Z')" }} />
            {/* Outlines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 50 64">
              <path d="M0 63.5 C25 63.5 25 39.5 50 39.5" fill="none" stroke="currentColor" strokeOpacity={0.12} strokeWidth={0.5} className="text-[#f59e0b]" />
              <path d="M0 60.5 C25 60.5 25 36.5 50 36.5" fill="none" stroke="currentColor" strokeOpacity={0.08} strokeWidth={0.5} className="text-foreground" />
            </svg>
          </div>

        </div>

        {/* Right Side Bar - Flexible width */}
        <div className="flex-1 h-10 bg-zinc-50 dark:bg-[#0c0e12] z-20 relative min-w-0 -ml-px">
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            <line x1="0" y1="39.5" x2="100%" y2="39.5" stroke="currentColor" strokeOpacity={0.08} strokeWidth={0.5} className="text-foreground" />
            <line x1="0" y1="36.5" x2="100%" y2="36.5" stroke="currentColor" strokeOpacity={0.08} strokeWidth={0.5} className="text-foreground" />
          </svg>
        </div>

      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-16 z-40 bg-[#0c0e12] border-b border-[rgba(253,251,247,0.1)] p-4 md:hidden shadow-2xl"
          >
             <nav className="flex flex-col gap-2">
               {[...items.left, ...items.right].map(item => (
                 <Link 
                   key={item.label} 
                   href={item.href}
                   className="flex items-center gap-3 p-3 rounded-lg hover:bg-foreground/5 transition-colors"
                   onClick={() => setIsMobileMenuOpen(false)}
                 >
                   <item.icon className="w-5 h-5 text-[#f59e0b] opacity-80" />
                   <span className="font-medium text-foreground/90">{item.label}</span>
                 </Link>
               ))}
             </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default NotchNavbar;
