'use client';

import { motion } from 'framer-motion';
import Container from '@/components/ui/container';
import Reveal from '@/components/ui/reveal';
import Button from '@/components/ui/button';
import Link from 'next/link';
import { mockProducts } from '@/lib/mock-products';
import { ArrowUpRight } from 'lucide-react';

export default function FeaturedProducts() {
  const featured = mockProducts.filter((p) => p.isFeatured).slice(0, 4);

  return (
    <section className="py-24 md:py-40 relative">
      <Container>
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 md:mb-16 gap-4 border-b border-white/10 pb-6">
          <Reveal>
            <div>
              <p className="text-[10px] tracking-[0.45em] uppercase text-zinc-400 font-mono font-bold mb-3">
                COLEÇÃO EM COMBATE // 2026
              </p>
              <h2 className="font-display text-4xl md:text-5xl font-black uppercase tracking-wider text-white">
                Armaduras em Destaque
              </h2>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <Link href="/produtos">
              <Button variant="outline" size="sm">
                Ver Coleção Completa →
              </Button>
            </Link>
          </Reveal>
        </div>
      </Container>

      {/* Product Grid */}
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((product, index) => (
            <Reveal key={product.id} delay={index * 0.1}>
              <Link href={`/produtos/${product.slug}`} className="block group">
                {/* Image Placeholder or Real Image */}
                <div className="aspect-[3/4] bg-[#0c0c0c] border border-white/10 relative overflow-hidden mb-4 transition-all duration-500 group-hover:border-white/40">
                  {product.images[0] ? (
                    <div className="w-full h-full relative overflow-hidden">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover grayscale contrast-125 transition-transform duration-700 group-hover:scale-105 group-hover:grayscale-0"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-zinc-950">
                      <span className="font-display text-4xl font-black text-white/5 tracking-[0.3em]">
                        EFSIX
                      </span>
                    </div>
                  )}

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
                    {product.isNew && (
                      <span className="text-[9px] font-black tracking-[0.25em] uppercase bg-white text-black px-2 py-0.5">
                        NOVO
                      </span>
                    )}
                  </div>

                  <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-7 h-7 bg-white text-black flex items-center justify-center">
                      <ArrowUpRight size={14} />
                    </div>
                  </div>

                  {/* Category tag */}
                  <div className="absolute bottom-3 left-3 z-10">
                    <span className="text-[9px] tracking-[0.25em] uppercase text-zinc-400 font-mono">
                      {product.category}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <h3 className="font-display text-sm font-bold tracking-wider uppercase text-white group-hover:text-zinc-300 transition-colors line-clamp-1">
                  {product.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-sm font-bold text-white font-mono">
                    R$ {product.price.toFixed(2).replace('.', ',')}
                  </p>
                  {product.comparePrice && (
                    <p className="text-xs text-zinc-500 line-through font-mono">
                      R$ {product.comparePrice.toFixed(2).replace('.', ',')}
                    </p>
                  )}
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
