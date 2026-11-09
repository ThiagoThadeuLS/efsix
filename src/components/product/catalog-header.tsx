'use client';

import Reveal from '@/components/ui/reveal';

export default function CatalogHeader() {
  return (
    <div className="mb-12 border-b border-white/10 pb-10">
      <Reveal>
        <span className="text-[10px] tracking-[0.45em] uppercase text-zinc-400 font-semibold mb-3 block">
          Catálogo Oficial // EFSIX Armour
        </span>
      </Reveal>
      <Reveal delay={0.1}>
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-wider text-white">
          Armaduras de Performance
        </h1>
      </Reveal>
      <Reveal delay={0.2}>
        <p className="text-zinc-400 text-sm md:text-base mt-4 max-w-2xl font-light leading-relaxed">
          Projetadas para a fusão da força brasileira com engenharia biomecânica. 
          Rashguards, compressão graduada e equipamentos esportivos forjados sem concessões.
        </p>
      </Reveal>
    </div>
  );
}
