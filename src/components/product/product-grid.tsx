'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockProducts } from '@/lib/mock-products';
import ProductCard from '@/components/product/product-card';
import { SlidersHorizontal } from 'lucide-react';

const categories = ['Todos', 'Rashguards', 'Shorts', 'Leggings', 'Casual'];

export default function ProductGrid() {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc'>('default');

  const filtered = mockProducts
    .filter((product) => {
      if (activeCategory === 'Todos') return true;
      return product.category === activeCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return 0;
    });

  return (
    <div>
      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-white/5">
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`text-xs tracking-[0.2em] uppercase px-4 py-2 border transition-all duration-300 font-medium ${
                activeCategory === category
                  ? 'bg-white text-black border-white shadow-lg shadow-white/10'
                  : 'bg-transparent text-zinc-400 border-white/10 hover:border-white/30 hover:text-white'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={14} className="text-zinc-500" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-[#0c0c0c] border border-white/10 text-xs uppercase tracking-wider text-zinc-300 py-2 px-3 focus:outline-none focus:border-white/40"
          >
            <option value="default">Destaques</option>
            <option value="price-asc">Menor Preço</option>
            <option value="price-desc">Maior Preço</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <div className="text-center py-24 border border-dashed border-white/10">
          <p className="font-display text-xl uppercase tracking-wider text-zinc-400">
            Nenhuma armadura encontrada nesta categoria
          </p>
        </div>
      )}
    </div>
  );
}
