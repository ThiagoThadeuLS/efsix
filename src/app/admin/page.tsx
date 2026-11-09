'use client';

import { useCartStore } from '@/stores/cart-store';
import { mockProducts } from '@/lib/mock-products';
import {
  TrendingUp,
  Package,
  ShoppingCart,
  AlertTriangle,
  FileText,
  Clock,
  ArrowUpRight,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function AdminDashboardPage() {
  const [mounted, setMounted] = useState(false);
  const orders = useCartStore((state) => state.orders);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Total de produtos e itens sem estoque
  const totalProducts = mockProducts.length;
  let zeroStockCount = 0;
  mockProducts.forEach((p) => {
    Object.values(p.stock).forEach((qty) => {
      if (qty === 0) zeroStockCount++;
    });
  });

  const totalRevenue = orders.reduce((acc, curr) => acc + curr.total, 0);

  if (!mounted) return null;

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Header */}
      <div className="border-b border-white/10 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] tracking-[0.4em] uppercase text-zinc-400 font-mono font-bold block">
            CENTRO DE COMANDO // EFSIX OPERACIONAL
          </span>
          <h1 className="font-display text-3xl font-black uppercase tracking-wider text-white">
            Painel Administrativo
          </h1>
        </div>

        <div className="flex gap-3">
          <Link
            href="/admin/produtos"
            className="border border-white/20 hover:border-white px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider text-white transition-colors"
          >
            Gerenciar Estoque
          </Link>
          <Link
            href="/admin/pedidos"
            className="bg-white hover:bg-zinc-200 text-black px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider transition-colors"
          >
            Ver Pedidos & NFe
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Receita Total */}
        <div className="p-5 border border-white/10 bg-[#070707] space-y-2">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-mono uppercase">
            <span>Faturamento Bruto</span>
            <TrendingUp size={16} className="text-emerald-400" />
          </div>
          <p className="font-display text-2xl font-black text-white font-mono">
            R$ {totalRevenue.toFixed(2).replace('.', ',')}
          </p>
          <p className="text-[10px] text-zinc-500 font-mono">
            {orders.length} pedido(s) processados
          </p>
        </div>

        {/* Total de Pedidos */}
        <div className="p-5 border border-white/10 bg-[#070707] space-y-2">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-mono uppercase">
            <span>Total de Pedidos</span>
            <ShoppingCart size={16} className="text-white" />
          </div>
          <p className="font-display text-2xl font-black text-white font-mono">
            {orders.length}
          </p>
          <p className="text-[10px] text-zinc-500 font-mono">
            Acompanhamento em tempo real
          </p>
        </div>

        {/* Modelos Cadastrados */}
        <div className="p-5 border border-white/10 bg-[#070707] space-y-2">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-mono uppercase">
            <span>Modelos Ativos</span>
            <Package size={16} className="text-zinc-300" />
          </div>
          <p className="font-display text-2xl font-black text-white font-mono">
            {totalProducts}
          </p>
          <p className="text-[10px] text-zinc-500 font-mono">
            Linhas Rashguards, Shorts & Compressão
          </p>
        </div>

        {/* Alerta de Estoque Zero (RN03) */}
        <div className="p-5 border border-white/10 bg-[#070707] space-y-2">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-mono uppercase">
            <span>Alertas de Estoque Zero</span>
            <AlertTriangle size={16} className="text-amber-400" />
          </div>
          <p className="font-display text-2xl font-black text-white font-mono">
            {zeroStockCount}
          </p>
          <p className="text-[10px] text-amber-400/80 font-mono">
            Tamanhos bloqueados para venda (RN03)
          </p>
        </div>
      </div>

      {/* Seção de Pedidos Recentes */}
      <div className="border border-white/10 bg-[#070707] p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h2 className="font-display text-lg font-black uppercase tracking-wider text-white">
            Últimos Pedidos Recebidos
          </h2>
          <Link
            href="/admin/pedidos"
            className="text-xs font-mono uppercase text-zinc-400 hover:text-white flex items-center gap-1"
          >
            Ver todos <ArrowUpRight size={14} />
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="py-12 text-center text-zinc-500 text-xs font-mono space-y-2">
            <Clock size={24} className="mx-auto text-zinc-600" />
            <p>Nenhum pedido registrado no store local ainda.</p>
            <p className="text-[11px] text-zinc-600">
              Faça uma simulação de compra no checkout para visualizar os pedidos e a emissão automática de NFe aqui.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-white/10 text-zinc-400 uppercase text-[10px]">
                  <th className="py-3 px-2">Pedido ID</th>
                  <th className="py-3 px-2">Cliente</th>
                  <th className="py-3 px-2">Itens</th>
                  <th className="py-3 px-2">Valor</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2">NFe</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.slice(0, 5).map((o) => (
                  <tr key={o.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-2 font-bold text-white">{o.id}</td>
                    <td className="py-3 px-2 text-zinc-300">{o.customerName}</td>
                    <td className="py-3 px-2 text-zinc-400">{o.items.length} un.</td>
                    <td className="py-3 px-2 text-white">R$ {o.total.toFixed(2).replace('.', ',')}</td>
                    <td className="py-3 px-2">
                      <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-white/10 text-white border border-white/20">
                        {o.status}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      {o.nfeIssued ? (
                        <span className="text-emerald-400 text-[10px] flex items-center gap-1">
                          <FileText size={12} /> Emitida
                        </span>
                      ) : (
                        <span className="text-zinc-600 text-[10px]">Pendente</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
