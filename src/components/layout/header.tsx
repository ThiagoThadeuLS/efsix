'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Menu, X, ShoppingBag, ShieldCheck } from 'lucide-react';
import Container from '@/components/ui/container';
import { useCartStore } from '@/stores/cart-store';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/produtos', label: 'Armaduras' },
  { href: '/#origem', label: 'Origem' },
  { href: '/#valores', label: 'Propósito' },
  { href: '/admin', label: 'Admin', icon: true },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const itemCount = useCartStore((state) => state.getItemCount());

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-[#020202]/90 backdrop-blur-md border-b border-white/10 shadow-2xl shadow-black'
            : 'bg-transparent border-b border-white/5'
        }`}
      >
        <Container>
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="relative z-10 flex flex-col group">
              <span className="font-display text-2xl md:text-3xl font-black tracking-[0.25em] uppercase text-white transition-transform duration-300 group-hover:scale-105">
                EFSIX
              </span>
              <span className="text-[9px] tracking-[0.45em] uppercase text-zinc-400 -mt-1 font-semibold">
                Built as Armour
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xs tracking-[0.25em] uppercase transition-colors duration-300 relative group py-1 ${
                    link.icon ? 'text-zinc-400 hover:text-white flex items-center gap-1.5' : 'text-zinc-300 hover:text-white'
                  }`}
                >
                  {link.icon && <ShieldCheck size={14} className="text-zinc-500 group-hover:text-white" />}
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-white group-hover:w-full transition-all duration-300" />
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <Link
                href="/carrinho"
                className="relative p-2.5 hover:bg-white/10 transition-colors border border-white/10 rounded-none group"
                aria-label="Carrinho de Compras"
              >
                <ShoppingBag size={20} strokeWidth={1.8} className="text-white group-hover:scale-110 transition-transform" />
                {mounted && itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-white text-[#020202] text-[11px] font-black flex items-center justify-center animate-in zoom-in-50">
                    {itemCount}
                  </span>
                )}
              </Link>

              {/* Mobile Toggle */}
              <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="md:hidden p-2.5 border border-white/10 text-white hover:bg-white/10 transition-colors"
                aria-label="Menu"
              >
                {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </Container>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, clipPath: 'inset(0% 0% 100% 0%)' }}
            animate={{ opacity: 1, clipPath: 'inset(0% 0% 0% 0%)' }}
            exit={{ opacity: 0, clipPath: 'inset(0% 0% 100% 0%)' }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 bg-[#020202] flex flex-col items-center justify-center gap-8 px-6"
          >
            <div className="text-center mb-4">
              <h2 className="font-display text-4xl font-black tracking-[0.3em] uppercase">EFSIX</h2>
              <p className="text-[10px] tracking-[0.5em] uppercase text-zinc-500 mt-1">Built as Armour</p>
            </div>

            {navLinks.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.3 }}
              >
                <Link
                  href={link.href}
                  onClick={() => setIsMobileOpen(false)}
                  className="font-display text-2xl tracking-[0.25em] uppercase hover:text-zinc-400 transition-colors flex items-center gap-2"
                >
                  {link.icon && <ShieldCheck size={20} />}
                  {link.label}
                </Link>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6"
            >
              <Link
                href="/carrinho"
                onClick={() => setIsMobileOpen(false)}
                className="border border-white px-8 py-3.5 text-xs font-bold tracking-[0.3em] uppercase bg-white text-[#020202] flex items-center gap-3"
              >
                <ShoppingBag size={16} /> Ver Carrinho ({mounted ? itemCount : 0})
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
