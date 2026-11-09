import Link from 'next/link';
import { LayoutDashboard, Package, ShoppingCart, ArrowLeft, Shield } from 'lucide-react';

export const metadata = {
  title: 'EFSIX ADMIN // Control Center',
  description: 'Painel administrativo restrito para gestão de estoque, pedidos e NFe da EFSIX.',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#020202] text-white flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-white/10 bg-[#070707] p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 group">
              <span className="font-display text-2xl font-black tracking-[0.25em] uppercase text-white">
                EFSIX
              </span>
              <span className="text-[9px] bg-white text-black px-1.5 py-0.5 font-mono font-bold">
                ADMIN
              </span>
            </Link>
            <p className="text-[9px] tracking-[0.4em] uppercase text-zinc-500 mt-1 font-mono">
              Command & Logistics
            </p>
          </div>

          {/* Navigation */}
          <nav className="space-y-1.5">
            <Link
              href="/admin"
              className="flex items-center gap-3 px-3.5 py-2.5 text-xs font-mono tracking-wider uppercase text-zinc-300 hover:text-white hover:bg-white/10 transition-colors border border-transparent hover:border-white/10"
            >
              <LayoutDashboard size={16} /> Dashboard
            </Link>
            <Link
              href="/admin/produtos"
              className="flex items-center gap-3 px-3.5 py-2.5 text-xs font-mono tracking-wider uppercase text-zinc-300 hover:text-white hover:bg-white/10 transition-colors border border-transparent hover:border-white/10"
            >
              <Package size={16} /> Estoque & Produtos
            </Link>
            <Link
              href="/admin/pedidos"
              className="flex items-center gap-3 px-3.5 py-2.5 text-xs font-mono tracking-wider uppercase text-zinc-300 hover:text-white hover:bg-white/10 transition-colors border border-transparent hover:border-white/10"
            >
              <ShoppingCart size={16} /> Pedidos & NFe
            </Link>
          </nav>
        </div>

        {/* Footer Sidebar */}
        <div className="pt-6 border-t border-white/10 space-y-3">
          <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-mono">
            <Shield size={12} className="text-emerald-400" />
            <span>Sessão Administrativa Ativa</span>
          </div>
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} /> Voltar para a Loja
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
