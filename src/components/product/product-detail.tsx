'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Product } from '@/types';
import { useCartStore } from '@/stores/cart-store';
import ShippingCalculator from '@/components/product/shipping-calculator';
import {
  ShieldCheck,
  Zap,
  Check,
  ShoppingBag,
  Sparkles,
  RotateCcw,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  // Tamanho selecionado inicialmente
  const availableSizes = product.sizes.map((s) => s.value);
  const firstAvailable = availableSizes.find((s) => (product.stock[s] ?? 0) > 0) || availableSizes[0];

  const [selectedSize, setSelectedSize] = useState<string>(firstAvailable || 'M');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; error?: boolean } | null>(null);

  const addItem = useCartStore((state) => state.addItem);

  const currentStock = product.stock[selectedSize] ?? 0;
  const isOutOfStock = currentStock <= 0;
  const hasDiscount = product.comparePrice && product.comparePrice > product.price;

  const handleAddToCart = () => {
    // RN03: Produtos com saldo de estoque igual a zero não podem ser adicionados ao carrinho
    if (isOutOfStock) {
      setFeedbackMessage({
        text: `O tamanho ${selectedSize} está temporariamente esgotado.`,
        error: true,
      });
      return;
    }

    const result = addItem(product, selectedSize);
    if (result.success) {
      setFeedbackMessage({ text: 'Armadura adicionada ao carrinho com sucesso!' });
      setTimeout(() => setFeedbackMessage(null), 3500);
    } else {
      setFeedbackMessage({ text: result.message || 'Erro ao adicionar item.', error: true });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
      {/* Visual / Gallery (7 colunas) */}
      <div className="lg:col-span-7 space-y-4">
        {/* Main Image */}
        <div className="relative aspect-[4/5] bg-[#0c0c0c] border border-white/10 overflow-hidden group">
          {product.images[activeImageIndex] ? (
            <img
              src={product.images[activeImageIndex]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-950">
              <span className="font-display text-7xl font-black text-white/5 tracking-[0.4em]">
                EFSIX
              </span>
              <span className="text-zinc-600 text-xs tracking-[0.5em] uppercase mt-2">
                Built as Armour
              </span>
            </div>
          )}

          {/* Corner Decors Brutalistas */}
          <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-white/40 pointer-events-none" />
          <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-white/40 pointer-events-none" />

          {/* Badge */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            {product.isNew && (
              <span className="bg-white text-black text-[10px] font-black tracking-[0.3em] uppercase px-3 py-1">
                LANÇAMENTO
              </span>
            )}
            {hasDiscount && (
              <span className="bg-red-600 text-white text-[10px] font-black tracking-[0.2em] uppercase px-3 py-1">
                SPECIAL PRICE
              </span>
            )}
          </div>
        </div>

        {/* Thumbnail selector if multiple images */}
        {product.images.length > 1 && (
          <div className="flex gap-3">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative w-20 h-24 border overflow-hidden transition-all ${
                  activeImageIndex === idx ? 'border-white ring-1 ring-white' : 'border-white/10 opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Information (5 colunas) */}
      <div className="lg:col-span-5 space-y-8">
        <div>
          <span className="text-[10px] tracking-[0.45em] uppercase text-zinc-400 font-semibold block mb-2 font-mono">
            EFSIX SPECIFICATION // {product.category}
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-black uppercase tracking-wider text-white leading-tight">
            {product.name}
          </h1>

          {/* Pricing */}
          <div className="flex items-baseline gap-4 mt-4">
            <span className="text-3xl font-black text-white font-mono">
              R$ {product.price.toFixed(2).replace('.', ',')}
            </span>
            {hasDiscount && (
              <span className="text-sm text-zinc-500 line-through font-mono">
                R$ {product.comparePrice?.toFixed(2).replace('.', ',')}
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            À vista no Pix com 5% OFF ou em até 12x no cartão de crédito
          </p>
        </div>

        {/* Description */}
        <div className="border-t border-b border-white/10 py-6">
          <p className="text-zinc-300 text-sm leading-relaxed font-light">
            {product.description}
          </p>
        </div>

        {/* Size Selection (RF03 & RN03) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-bold tracking-[0.25em] uppercase text-white flex items-center gap-2">
              Tamanho da Armadura
              <span className="text-zinc-400 font-normal">({selectedSize})</span>
            </label>
            <span className="text-[11px] text-zinc-400 tracking-wider">
              {currentStock > 0 ? (
                <span className="text-emerald-400 font-mono">● {currentStock} un. em estoque</span>
              ) : (
                <span className="text-red-400 font-mono">✕ Tamanho esgotado</span>
              )}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {product.sizes.map((s) => {
              const stockForSize = product.stock[s.value] ?? 0;
              const isSelected = selectedSize === s.value;
              const disabled = stockForSize <= 0;

              return (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setSelectedSize(s.value)}
                  className={`py-3.5 text-center text-xs font-bold tracking-widest uppercase border transition-all relative ${
                    isSelected
                      ? 'border-white bg-white text-black font-black'
                      : disabled
                      ? 'border-white/5 bg-zinc-950/50 text-zinc-600 cursor-not-allowed'
                      : 'border-white/15 bg-[#080808] text-white hover:border-white/40'
                  }`}
                >
                  {s.label}
                  {disabled && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <div className="w-full h-[1px] bg-red-500/60 rotate-12" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {isOutOfStock && (
            <div className="flex items-center gap-2 mt-3 text-red-400 text-xs">
              <AlertTriangle size={14} />
              <span>Aviso RN03: Este tamanho está zerado em estoque e não pode ser comprado.</span>
            </div>
          )}
        </div>

        {/* Add to Cart CTA */}
        <div className="space-y-3">
          <button
            type="button"
            disabled={isOutOfStock}
            onClick={handleAddToCart}
            className={`w-full py-4 px-6 text-xs font-black tracking-[0.3em] uppercase flex items-center justify-center gap-3 transition-all duration-300 ${
              isOutOfStock
                ? 'bg-zinc-800 text-zinc-500 border border-zinc-700 cursor-not-allowed'
                : 'bg-white text-black border border-white hover:bg-zinc-200 active:scale-[0.99] shadow-xl shadow-white/5'
            }`}
          >
            <ShoppingBag size={18} />
            {isOutOfStock ? 'ESTOQUE ZERADO' : 'ADICIONAR À ARMADURA'}
          </button>

          <AnimatePresence>
            {feedbackMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`p-3 text-xs flex items-center justify-between border ${
                  feedbackMessage.error
                    ? 'border-red-500/40 bg-red-950/30 text-red-300'
                    : 'border-emerald-500/40 bg-emerald-950/30 text-emerald-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  {feedbackMessage.error ? <AlertTriangle size={16} /> : <Check size={16} />}
                  <span>{feedbackMessage.text}</span>
                </div>
                {!feedbackMessage.error && (
                  <Link
                    href="/carrinho"
                    className="font-bold underline uppercase tracking-wider text-[11px] hover:text-white"
                  >
                    Ver Carrinho
                  </Link>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Shipping Calculator (RF04) */}
        <div>
          <ShippingCalculator autoApplyToCart={true} />
        </div>

        {/* Technical Highlights */}
        <div className="space-y-3 pt-4 border-t border-white/10">
          <h4 className="text-xs font-bold tracking-[0.25em] uppercase text-zinc-400">
            Destaques de Engenharia & Performance
          </h4>
          <ul className="space-y-2">
            {product.features.map((feat, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs text-zinc-300 font-light">
                <Sparkles size={14} className="text-white shrink-0 mt-0.5" />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/10">
          <div className="flex items-center gap-3">
            <ShieldCheck size={20} className="text-zinc-400 shrink-0" />
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-white">Garantia EFSIX</p>
              <p className="text-[10px] text-zinc-400">Troca grátis em até 30 dias</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <RotateCcw size={20} className="text-zinc-400 shrink-0" />
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-white">Envio Rastreado</p>
              <p className="text-[10px] text-zinc-400">Com emissão automática de NFe</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
