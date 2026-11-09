'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/types';
import { ArrowUpRight } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const hasDiscount = product.comparePrice && product.comparePrice > product.price;
  
  // Total stock calculation
  const totalStock = Object.values(product.stock).reduce((acc, qty) => acc + qty, 0);
  const isSoldOut = totalStock <= 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group"
    >
      <Link href={`/produtos/${product.slug}`} className="block relative">
        {/* Image Box */}
        <div className="relative aspect-[3/4] bg-[#0c0c0c] border border-white/10 overflow-hidden mb-4 transition-all duration-500 group-hover:border-white/40">
          {product.images[0] ? (
            <div className="relative w-full h-full overflow-hidden">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover grayscale contrast-125 transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-900 to-black">
              <span className="font-display text-4xl font-black text-white/10 tracking-[0.3em]">
                EFSIX
              </span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {product.isNew && (
              <span className="text-[9px] font-black tracking-[0.25em] uppercase bg-white text-[#020202] px-2.5 py-1">
                NOVO
              </span>
            )}
            {hasDiscount && (
              <span className="text-[9px] font-bold tracking-[0.2em] uppercase bg-red-600 text-white px-2 py-0.5">
                OFERTA
              </span>
            )}
            {isSoldOut && (
              <span className="text-[9px] font-bold tracking-[0.2em] uppercase bg-zinc-800 text-zinc-400 px-2 py-0.5">
                ESGOTADO
              </span>
            )}
          </div>

          <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-8 h-8 bg-white text-black flex items-center justify-center">
              <ArrowUpRight size={18} />
            </div>
          </div>

          {/* Category Tag */}
          <div className="absolute bottom-3 left-3 z-10">
            <span className="text-[10px] tracking-[0.25em] uppercase text-zinc-400 font-mono">
              {product.category}
            </span>
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-1">
          <h3 className="font-display text-base font-bold uppercase tracking-wider text-white group-hover:text-zinc-300 transition-colors line-clamp-1">
            {product.name}
          </h3>
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-white tracking-wide">
              R$ {product.price.toFixed(2).replace('.', ',')}
            </span>
            {hasDiscount && (
              <span className="text-xs text-zinc-500 line-through">
                R$ {product.comparePrice?.toFixed(2).replace('.', ',')}
              </span>
            )}
          </div>
          <p className="text-[11px] text-zinc-400 tracking-wider">
            em até 12x no cartão ou Pix com aprovação imediata
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
