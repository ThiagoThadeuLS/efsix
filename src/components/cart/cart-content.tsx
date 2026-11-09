'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/stores/cart-store';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import Button from '@/components/ui/button';
import Link from 'next/link';
import Reveal from '@/components/ui/reveal';
import ShippingCalculator from '@/components/product/shipping-calculator';

export default function CartContent() {
  const [mounted, setMounted] = useState(false);
  const {
    items,
    removeItem,
    updateQuantity,
    getSubtotal,
    getTotal,
    shipping,
    getItemCount,
  } = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="py-24 text-center">
        <div className="inline-block w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-24 max-w-lg mx-auto">
        <Reveal>
          <div className="w-20 h-20 border border-white/10 flex items-center justify-center mx-auto mb-6 bg-zinc-950">
            <ShoppingBag size={32} className="text-zinc-500" />
          </div>
          <h1 className="font-display text-3xl font-black uppercase tracking-wider text-white mb-3">
            Sua Armadura está Vazia
          </h1>
          <p className="text-zinc-400 text-sm leading-relaxed mb-8">
            Nenhum item adicionado ao seu carrinho. Explore nossos lançamentos e escolha seu equipamento.
          </p>
          <Link href="/produtos">
            <Button variant="primary" size="lg">
              Explorar Armaduras
            </Button>
          </Link>
        </Reveal>
      </div>
    );
  }

  const subtotal = getSubtotal();
  const total = getTotal();

  return (
    <div>
      <Reveal>
        <div className="border-b border-white/10 pb-6 mb-8">
          <span className="text-[10px] tracking-[0.45em] uppercase text-zinc-400 font-semibold block mb-2 font-mono">
            EFSIX CHECKOUT SEQUENCE
          </span>
          <h1 className="font-display text-4xl font-black uppercase tracking-wider text-white">
            Carrinho de Armaduras
          </h1>
          <p className="text-xs text-zinc-400 tracking-wider mt-1 font-mono">
            {getItemCount()} {getItemCount() === 1 ? 'item selecionado' : 'itens selecionados'}
          </p>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Items List (8 colunas) */}
        <div className="lg:col-span-8 space-y-4">
          <AnimatePresence mode="popLayout">
            {items.map((item) => {
              const maxStock = item.product.stock[item.size] ?? 0;
              const isMaxStockReached = item.quantity >= maxStock;

              return (
                <motion.div
                  key={`${item.product.id}-${item.size}`}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-5 border border-white/10 bg-[#080808] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
                >
                  {/* Image & Title */}
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-24 bg-black border border-white/10 shrink-0 overflow-hidden relative">
                      {item.product.images[0] ? (
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-display text-xs font-black text-white/20">
                          EFSIX
                        </div>
                      )}
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-[0.2em] text-zinc-400 font-mono">
                        {item.product.category}
                      </span>
                      <h3 className="font-display text-base font-bold uppercase tracking-wider text-white">
                        {item.product.name}
                      </h3>
                      <p className="text-xs text-zinc-400 mt-1 font-mono">
                        Tamanho selecionado: <strong className="text-white">{item.size}</strong>
                      </p>
                      <p className="text-xs font-bold text-white mt-1 font-mono">
                        R$ {item.product.price.toFixed(2).replace('.', ',')} un.
                      </p>
                    </div>
                  </div>

                  {/* Quantity and Actions */}
                  <div className="flex items-center justify-between w-full sm:w-auto gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-white/5">
                    {/* Stepper */}
                    <div className="flex items-center border border-white/20 bg-black">
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.size, item.quantity - 1)
                        }
                        className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                        aria-label="Diminuir"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="px-3.5 py-1 text-xs font-mono font-bold text-white min-w-[36px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.size, item.quantity + 1)
                        }
                        disabled={isMaxStockReached}
                        className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label="Aumentar"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* Total item price */}
                    <div className="text-right min-w-[90px]">
                      <span className="text-sm font-mono font-black text-white">
                        R$ {(item.product.price * item.quantity).toFixed(2).replace('.', ',')}
                      </span>
                    </div>

                    {/* Delete button */}
                    <button
                      onClick={() => removeItem(item.product.id, item.size)}
                      className="p-2 text-zinc-500 hover:text-red-400 transition-colors"
                      title="Remover"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Frete no Carrinho */}
          <div className="pt-4">
            <ShippingCalculator autoApplyToCart={true} />
          </div>
        </div>

        {/* Order Summary Sidebar (4 colunas) */}
        <div className="lg:col-span-4 space-y-6 sticky top-28">
          <div className="border border-white/15 bg-[#090909] p-6 shadow-2xl">
            <h2 className="font-display text-lg font-black uppercase tracking-wider text-white border-b border-white/10 pb-4 mb-4">
              Sumário do Pedido
            </h2>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between text-zinc-400">
                <span>Subtotal das peças</span>
                <span className="text-white">R$ {subtotal.toFixed(2).replace('.', ',')}</span>
              </div>

              <div className="flex justify-between text-zinc-400">
                <span>Frete ({shipping ? shipping.name : 'A calcular'})</span>
                <span className="text-white">
                  {shipping ? `R$ ${shipping.price.toFixed(2).replace('.', ',')}` : 'R$ 0,00'}
                </span>
              </div>

              {shipping && (
                <div className="text-[10px] text-zinc-400 text-right">
                  Prazo estimado: {shipping.deadline}
                </div>
              )}

              <div className="border-t border-white/10 pt-4 flex justify-between text-base font-black text-white">
                <span className="font-display tracking-wider">TOTAL</span>
                <span>R$ {total.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <Link href="/checkout" className="block w-full">
                <Button variant="primary" size="lg" fullWidth>
                  <span className="flex items-center gap-2 font-black">
                    Avançar para Checkout <ArrowRight size={16} />
                  </span>
                </Button>
              </Link>

              <Link
                href="/produtos"
                className="block text-center text-xs tracking-widest uppercase text-zinc-400 hover:text-white transition-colors py-2"
              >
                ← Continuar Comprando
              </Link>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-2.5 text-[10px] text-zinc-400 uppercase tracking-wider font-mono">
              <ShieldCheck size={16} className="text-white" />
              <span>Checkout Blindado com Criptografia SSL</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
