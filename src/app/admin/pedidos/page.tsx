'use client';

import { useState, useEffect } from 'react';
import { useCartStore } from '@/stores/cart-store';
import type { Order, OrderStatus } from '@/types';
import {
  FileText,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Copy,
  ExternalLink,
  ShieldCheck,
  Send,
  Loader2,
} from 'lucide-react';

export default function AdminOrdersPage() {
  const [mounted, setMounted] = useState(false);
  const [issuingNfeId, setIssuingNfeId] = useState<string | null>(null);
  const [nfeAlert, setNfeAlert] = useState<{ message: string; error?: boolean } | null>(null);

  const orders = useCartStore((state) => state.orders);
  const updateOrderStatus = useCartStore((state) => state.updateOrderStatus);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleManualNFeIssue = async (order: Order) => {
    // RN02: A requisição de emissão de NFe e a mudança do status do pedido para "Preparando Envio" só ocorrerão se o gateway retornar o status de pagamento como "Aprovado"
    if (order.payment.status !== 'approved') {
      setNfeAlert({
        message: 'Bloqueio RN02: Não é possível emitir NFe para pedidos sem confirmação de pagamento Aprovado.',
        error: true,
      });
      return;
    }

    setIssuingNfeId(order.id);
    setNfeAlert(null);

    try {
      const res = await fetch('/api/nfe/issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          paymentStatus: order.payment.status,
          customer: {
            name: order.customerName,
            email: order.customerEmail,
          },
          items: order.items,
          total: order.total,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Erro ao emitir NFe');
      }

      // Atualiza status do pedido para "Preparando Envio" conforme RN02
      updateOrderStatus(order.id, 'Preparando Envio', data.nfeKey);
      setNfeAlert({
        message: `NFe autorizada pela SEFAZ com sucesso para o pedido ${order.id}! Status alterado para Preparando Envio (RN02).`,
      });
    } catch (err: any) {
      setNfeAlert({ message: err.message, error: true });
    } finally {
      setIssuingNfeId(null);
    }
  };

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
  };

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Header */}
      <div className="border-b border-white/10 pb-6">
        <span className="text-[10px] tracking-[0.4em] uppercase text-zinc-400 font-mono font-bold block">
          RF08, RF07 & RN02 // LOGÍSTICA & SEFAZ HUB
        </span>
        <h1 className="font-display text-3xl font-black uppercase tracking-wider text-white">
          Acompanhamento de Pedidos & NFe
        </h1>
        <p className="text-xs text-zinc-400 mt-1 font-mono">
          Gerencie o fluxo de expedição, autorização de notas fiscais eletrônicas e despachos das armaduras EFSIX.
        </p>
      </div>

      {nfeAlert && (
        <div
          className={`p-4 border text-xs font-mono tracking-wider flex items-center justify-between ${
            nfeAlert.error
              ? 'border-red-500/40 bg-red-950/20 text-red-300'
              : 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {nfeAlert.error ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
            <span>{nfeAlert.message}</span>
          </div>
          <button
            onClick={() => setNfeAlert(null)}
            className="text-zinc-500 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* Orders List */}
      <div className="space-y-6">
        {orders.length === 0 ? (
          <div className="p-12 border border-white/10 bg-[#070707] text-center space-y-3">
            <Clock size={32} className="mx-auto text-zinc-600" />
            <h3 className="font-display text-lg font-black uppercase tracking-wider text-white">
              Nenhum Pedido Registrado
            </h3>
            <p className="text-xs text-zinc-400 font-mono max-w-md mx-auto">
              Simule um pedido no checkout da loja para ver o ciclo completo de pagamento Pix/Cartão, integração de NFe e gestão de status de envio aqui.
            </p>
          </div>
        ) : (
          orders.map((order) => {
            return (
              <div
                key={order.id}
                className="border border-white/15 bg-[#070707] p-6 space-y-6 shadow-2xl"
              >
                {/* Top Info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-display text-xl font-black text-white">
                        {order.id}
                      </span>
                      <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase bg-white/10 text-white border border-white/20">
                        {order.status}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-400">
                        {new Date(order.createdAt).toLocaleString('pt-BR')}
                      </span>
                    </div>
                    <p className="text-xs font-mono text-zinc-400 mt-1">
                      Cliente: <strong className="text-white">{order.customerName}</strong> ({order.customerEmail})
                    </p>
                  </div>

                  {/* Actions / Status Selector */}
                  <div className="flex items-center gap-3">
                    <label className="text-[10px] font-mono uppercase text-zinc-400">
                      Alterar Status:
                    </label>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                      className="bg-black border border-white/20 text-xs font-mono uppercase py-1.5 px-3 text-white focus:outline-none focus:border-white"
                    >
                      <option value="Pendente">Pendente</option>
                      <option value="Aprovado">Aprovado</option>
                      <option value="Preparando Envio">Preparando Envio</option>
                      <option value="Enviado">Enviado</option>
                      <option value="Entregue">Entregue</option>
                      <option value="Cancelado">Cancelado</option>
                    </select>
                  </div>
                </div>

                {/* Items and Address Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
                  {/* Items */}
                  <div className="space-y-2">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">
                      Itens do Pedido ({order.items.length})
                    </span>
                    <div className="space-y-1.5">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-zinc-300">
                          <span>
                            {item.quantity}x {item.product.name} ({item.size})
                          </span>
                          <span className="text-white font-bold">
                            R$ {(item.product.price * item.quantity).toFixed(2).replace('.', ',')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping & Delivery */}
                  <div className="space-y-1 text-zinc-400">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider block mb-1">
                      Frete & Destino ({order.shipping?.name})
                    </span>
                    <p className="text-white">
                      {order.address.street}, {order.address.number}
                    </p>
                    <p>
                      {order.address.neighborhood} - {order.address.city}/{order.address.state}
                    </p>
                    <p>CEP: {order.address.cep}</p>
                    <p className="text-zinc-500 text-[10px] pt-1">
                      Prazo acordado: {order.shipping?.deadline}
                    </p>
                  </div>

                  {/* Financials */}
                  <div className="space-y-1.5 text-zinc-400 md:border-l md:border-white/10 md:pl-6">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider block mb-1">
                      Financeiro & Gateway
                    </span>
                    <div className="flex justify-between">
                      <span>Método:</span>
                      <span className="text-white font-bold uppercase">{order.payment.method}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status Pagamento:</span>
                      <span className="text-emerald-400 font-bold uppercase">{order.payment.status}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-white/10">
                      <span>Total:</span>
                      <span>R$ {order.total.toFixed(2).replace('.', ',')}</span>
                    </div>
                  </div>
                </div>

                {/* NFe Status & Trigger (RF07 & RN02) */}
                <div className="border border-white/10 bg-black/60 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <FileText size={16} className={order.nfeIssued ? 'text-emerald-400' : 'text-zinc-500'} />
                      <span className="font-bold text-white uppercase tracking-wider">
                        Nota Fiscal Eletrônica (Focus NFe / Bling Hub)
                      </span>
                    </div>
                    {order.nfeIssued && order.nfeKey ? (
                      <p className="text-[11px] text-zinc-400 break-all select-all">
                        Chave SEFAZ: <span className="text-white font-mono">{order.nfeKey}</span>
                      </p>
                    ) : (
                      <p className="text-[11px] text-zinc-500">
                        NFe ainda não emitida para este pedido.
                      </p>
                    )}
                  </div>

                  <div>
                    {order.nfeIssued ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 text-[11px] uppercase font-bold">
                        <CheckCircle2 size={14} /> NFe Emitida & Autorizada
                      </span>
                    ) : (
                      <button
                        onClick={() => handleManualNFeIssue(order)}
                        disabled={issuingNfeId === order.id}
                        className="px-4 py-2 bg-white text-black font-black uppercase text-xs hover:bg-zinc-200 transition-colors flex items-center gap-2 disabled:opacity-50"
                      >
                        {issuingNfeId === order.id ? (
                          <>
                            <Loader2 size={14} className="animate-spin" /> Emitindo...
                          </>
                        ) : (
                          <>
                            <Send size={14} /> Emitir NFe Agora (RN02)
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
