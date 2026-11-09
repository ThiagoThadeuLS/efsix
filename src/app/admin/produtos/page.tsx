'use client';

import { useState } from 'react';
import { mockProducts } from '@/lib/mock-products';
import type { Product } from '@/types';
import {
  PackagePlus,
  Edit2,
  Check,
  AlertTriangle,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import Button from '@/components/ui/button';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [editingStock, setEditingStock] = useState<{
    productId: string;
    size: string;
    value: number;
  } | null>(null);

  const [newProductModal, setNewProductModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Rashguards',
    price: '',
    stockP: '10',
    stockM: '15',
    stockG: '12',
    stockGG: '5',
    description: '',
  });

  const handleUpdateStock = (productId: string, size: string, newQty: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          return {
            ...p,
            stock: {
              ...p.stock,
              [size]: Math.max(0, newQty),
            },
          };
        }
        return p;
      })
    );
    setEditingStock(null);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) return;

    const created: Product = {
      id: `ef-${Date.now().toString().slice(-4)}`,
      name: newProduct.name,
      slug: newProduct.name.toLowerCase().replace(/\s+/g, '-'),
      category: newProduct.category,
      price: parseFloat(newProduct.price.replace(',', '.')) || 199.9,
      description: newProduct.description || 'Armadura de performance forjada em tecido de alta compressão com proteção UV 50+.',
      images: [
        'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1000&auto=format&fit=crop',
      ],
      sizes: [
        { label: 'P', value: 'P' },
        { label: 'M', value: 'M' },
        { label: 'G', value: 'G' },
        { label: 'GG', value: 'GG' },
      ],
      stock: {
        P: parseInt(newProduct.stockP) || 0,
        M: parseInt(newProduct.stockM) || 0,
        G: parseInt(newProduct.stockG) || 0,
        GG: parseInt(newProduct.stockGG) || 0,
      },
      features: [
        'Proteção Solar UV 50+',
        'Costuras Flatlock Reforçadas',
        'Compressão inteligente',
      ],
      isNew: true,
    };

    setProducts([created, ...products]);
    setNewProductModal(false);
    setNewProduct({
      name: '',
      category: 'Rashguards',
      price: '',
      stockP: '10',
      stockM: '15',
      stockG: '12',
      stockGG: '5',
      description: '',
    });
  };

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Header */}
      <div className="border-b border-white/10 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] tracking-[0.4em] uppercase text-zinc-400 font-mono font-bold block">
            RF08 & RN03 // CONTROLE DE ARMAZÉM & CATÁLOGO
          </span>
          <h1 className="font-display text-3xl font-black uppercase tracking-wider text-white">
            Gestão de Estoque & Produtos
          </h1>
          <p className="text-xs text-zinc-400 mt-1 font-mono">
            Edite os saldos em tempo real. Itens com saldo zero são bloqueados na loja virtual (Regra RN03).
          </p>
        </div>

        <button
          onClick={() => setNewProductModal(true)}
          className="bg-white hover:bg-zinc-200 text-black px-4 py-2 text-xs font-mono font-black uppercase tracking-wider transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <PackagePlus size={16} /> Cadastrar Nova Armadura
        </button>
      </div>

      {/* Tabela de Produtos e Estoque */}
      <div className="border border-white/10 bg-[#070707] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-black/60 text-zinc-400 uppercase text-[10px]">
                <th className="py-3.5 px-4">Produto</th>
                <th className="py-3.5 px-4">Categoria</th>
                <th className="py-3.5 px-4">Preço (R$)</th>
                <th className="py-3.5 px-4">Estoque por Tamanho (P / M / G / GG)</th>
                <th className="py-3.5 px-4">Status Geral</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {products.map((p) => {
                const totalStock = Object.values(p.stock).reduce((a, b) => a + b, 0);

                return (
                  <tr key={p.id} className="hover:bg-white/5 transition-colors">
                    {/* Produto */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-12 bg-black border border-white/10 shrink-0 overflow-hidden">
                          {p.images[0] && (
                            <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-white uppercase">{p.name}</p>
                          <p className="text-[10px] text-zinc-500 font-mono">SKU: {p.id}</p>
                        </div>
                      </div>
                    </td>

                    {/* Categoria */}
                    <td className="py-4 px-4 text-zinc-300 uppercase">{p.category}</td>

                    {/* Preço */}
                    <td className="py-4 px-4 text-white font-bold font-mono">
                      R$ {p.price.toFixed(2).replace('.', ',')}
                    </td>

                    {/* Estoque detalhado com edição interativa */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        {p.sizes.map((s) => {
                          const currentQty = p.stock[s.value] ?? 0;
                          const isZero = currentQty === 0;
                          const isEditing =
                            editingStock?.productId === p.id && editingStock?.size === s.value;

                          if (isEditing) {
                            return (
                              <div
                                key={s.value}
                                className="flex items-center gap-1 border border-white bg-black p-1"
                              >
                                <span className="text-[10px] text-zinc-400 font-bold px-1">
                                  {s.label}:
                                </span>
                                <input
                                  type="number"
                                  min={0}
                                  value={editingStock.value}
                                  onChange={(e) =>
                                    setEditingStock({
                                      ...editingStock,
                                      value: parseInt(e.target.value) || 0,
                                    })
                                  }
                                  className="w-12 bg-zinc-900 border border-white/30 text-white text-xs px-1 py-0.5"
                                />
                                <button
                                  onClick={() =>
                                    handleUpdateStock(p.id, s.value, editingStock.value)
                                  }
                                  className="p-1 text-emerald-400 hover:text-white"
                                  title="Confirmar"
                                >
                                  <Check size={14} />
                                </button>
                              </div>
                            );
                          }

                          return (
                            <button
                              key={s.value}
                              onClick={() =>
                                setEditingStock({
                                  productId: p.id,
                                  size: s.value,
                                  value: currentQty,
                                })
                              }
                              className={`px-2.5 py-1 text-[11px] border flex items-center gap-1.5 transition-colors ${
                                isZero
                                  ? 'border-red-500/40 bg-red-950/20 text-red-300 hover:border-red-500'
                                  : 'border-white/10 bg-[#0c0c0c] text-zinc-300 hover:border-white/40'
                              }`}
                              title="Clique para editar o saldo deste tamanho"
                            >
                              <span className="font-bold">{s.label}:</span>
                              <span className={isZero ? 'font-black' : ''}>{currentQty}</span>
                              <Edit2 size={10} className="text-zinc-500 opacity-60" />
                            </button>
                          );
                        })}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">
                      {totalStock === 0 ? (
                        <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-red-950/50 text-red-300 border border-red-500/30">
                          Esgotado Total
                        </span>
                      ) : totalStock < 10 ? (
                        <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-amber-950/50 text-amber-300 border border-amber-500/30">
                          Baixo Estoque ({totalStock})
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-emerald-950/50 text-emerald-300 border border-emerald-500/30">
                          Disponível ({totalStock})
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Cadastro de Produto (RF08) */}
      {newProductModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="border border-white/20 bg-[#080808] w-full max-w-lg p-6 space-y-6 shadow-2xl">
            <div className="border-b border-white/10 pb-3 flex items-center justify-between">
              <h3 className="font-display text-lg font-black uppercase tracking-wider text-white">
                Cadastrar Nova Armadura
              </h3>
              <button
                onClick={() => setNewProductModal(false)}
                className="text-zinc-500 hover:text-white font-mono text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs font-mono">
              <div>
                <label className="text-zinc-400 block mb-1 uppercase">Nome da Peça *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Rashguard Carbon Matrix"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full bg-[#0d0d0d] border border-white/15 px-3 py-2 text-white focus:outline-none focus:border-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 block mb-1 uppercase">Categoria</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full bg-[#0d0d0d] border border-white/15 px-3 py-2 text-white focus:outline-none focus:border-white"
                  >
                    <option value="Rashguards">Rashguards</option>
                    <option value="Shorts">Shorts</option>
                    <option value="Leggings">Leggings</option>
                    <option value="Casual">Casual</option>
                  </select>
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1 uppercase">Preço de Venda (R$) *</label>
                  <input
                    type="text"
                    required
                    placeholder="219,90"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    className="w-full bg-[#0d0d0d] border border-white/15 px-3 py-2 text-white focus:outline-none focus:border-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1 uppercase">
                  Estoque Inicial por Tamanho (P / M / G / GG)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  <input
                    type="number"
                    min={0}
                    placeholder="P"
                    value={newProduct.stockP}
                    onChange={(e) => setNewProduct({ ...newProduct, stockP: e.target.value })}
                    className="bg-[#0d0d0d] border border-white/15 px-2 py-1.5 text-center text-white"
                  />
                  <input
                    type="number"
                    min={0}
                    placeholder="M"
                    value={newProduct.stockM}
                    onChange={(e) => setNewProduct({ ...newProduct, stockM: e.target.value })}
                    className="bg-[#0d0d0d] border border-white/15 px-2 py-1.5 text-center text-white"
                  />
                  <input
                    type="number"
                    min={0}
                    placeholder="G"
                    value={newProduct.stockG}
                    onChange={(e) => setNewProduct({ ...newProduct, stockG: e.target.value })}
                    className="bg-[#0d0d0d] border border-white/15 px-2 py-1.5 text-center text-white"
                  />
                  <input
                    type="number"
                    min={0}
                    placeholder="GG"
                    value={newProduct.stockGG}
                    onChange={(e) => setNewProduct({ ...newProduct, stockGG: e.target.value })}
                    className="bg-[#0d0d0d] border border-white/15 px-2 py-1.5 text-center text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1 uppercase">Descrição Técnica</label>
                <textarea
                  rows={3}
                  placeholder="Especificações do tecido, proteção solar, modelagem..."
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full bg-[#0d0d0d] border border-white/15 px-3 py-2 text-white focus:outline-none focus:border-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setNewProductModal(false)}
                  className="px-4 py-2 border border-white/20 text-zinc-400 hover:text-white uppercase"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-white text-black font-black uppercase hover:bg-zinc-200"
                >
                  Salvar Armadura
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
