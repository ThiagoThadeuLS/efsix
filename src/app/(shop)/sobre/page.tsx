import Container from '@/components/ui/container';
import Reveal from '@/components/ui/reveal';
import { Shield, Zap, Target, Crosshair } from 'lucide-react';

export const metadata = {
  title: 'Sobre a EFSIX — Built as Armour',
  description: 'Conheça o propósito, a origem e a tecnologia brutalista por trás da EFSIX.',
};

export default function AboutPage() {
  return (
    <div className="pt-32 pb-28 min-h-screen">
      <Container>
        {/* Hero do Manifesto */}
        <div className="max-w-4xl mb-20">
          <Reveal>
            <span className="text-[10px] tracking-[0.5em] uppercase text-zinc-400 font-mono font-bold block mb-4">
              MANIFESTO // EFSIX ORIGEM
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-wider text-white leading-tight">
              Mais que Esporte.
              <br />
              <span className="text-zinc-500">Propósito Puro.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-zinc-300 text-base sm:text-lg mt-8 leading-relaxed font-light">
              Nascemos da fusão entre a precisão técnica e a força pura do atleta brasileiro.
              Nossa história é escrita em cada fibra, unindo identidade e propósito para quem não aceita limites. 
              A EFSIX nasceu para impulsionar sua jornada com tecnologia de ponta e design brutalista, 
              focado em quem levanta o nível do desempenho.
            </p>
          </Reveal>
        </div>

        {/* Pilares com Grid Brutalista */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          <div className="border border-white/10 bg-[#070707] p-8 space-y-4 relative overflow-hidden group">
            <div className="w-12 h-12 border border-white/20 flex items-center justify-center text-white mb-6 group-hover:border-white transition-colors">
              <Zap size={22} />
            </div>
            <span className="font-display text-5xl font-black text-white/5 absolute right-4 top-4">
              01
            </span>
            <h3 className="font-display text-xl font-black uppercase tracking-wider text-white">
              Alta Performance
            </h3>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              Fibras com memória elástica, compressão neuromuscular e nanotecnologia têxtil. Cada corte foi desenhado para reduzir a vibração muscular e acelerar o retorno venoso.
            </p>
          </div>

          <div className="border border-white/10 bg-[#070707] p-8 space-y-4 relative overflow-hidden group">
            <div className="w-12 h-12 border border-white/20 flex items-center justify-center text-white mb-6 group-hover:border-white transition-colors">
              <Shield size={22} />
            </div>
            <span className="font-display text-5xl font-black text-white/5 absolute right-4 top-4">
              02
            </span>
            <h3 className="font-display text-xl font-black uppercase tracking-wider text-white">
              Proteção Absoluta
            </h3>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              Costuras planas quádruplas anti-abrasão e proteção solar UV 50+ com laudo laboratorial. Desenvolvida para resistir ao atrito do tatame e intempéries extremas.
            </p>
          </div>

          <div className="border border-white/10 bg-[#070707] p-8 space-y-4 relative overflow-hidden group">
            <div className="w-12 h-12 border border-white/20 flex items-center justify-center text-white mb-6 group-hover:border-white transition-colors">
              <Target size={22} />
            </div>
            <span className="font-display text-5xl font-black text-white/5 absolute right-4 top-4">
              03
            </span>
            <h3 className="font-display text-xl font-black uppercase tracking-wider text-white">
              Propósito Inegociável
            </h3>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              Não fazemos apenas vestuário esportivo: forjamos armaduras para a mente e para o corpo do guerreiro moderno que desafia a mediocridade diariamente.
            </p>
          </div>
        </div>

        {/* Citação Final */}
        <div className="border-t border-b border-white/10 py-16 text-center max-w-3xl mx-auto">
          <p className="font-display text-2xl sm:text-3xl font-black uppercase tracking-[0.2em] text-white">
            "BUILT AS ARMOUR. FORGED FOR GLORY."
          </p>
          <span className="text-[11px] font-mono text-zinc-500 tracking-[0.4em] uppercase mt-3 block">
            EFSIX BRAZILIAN COMBAT DIVISION // 2026
          </span>
        </div>
      </Container>
    </div>
  );
}
