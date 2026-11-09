'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Container from '@/components/ui/container';
import Reveal from '@/components/ui/reveal';

export default function OriginSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [80, -80]);

  return (
    <section id="origem" ref={sectionRef} className="py-24 md:py-40 relative overflow-hidden">
      {/* Accent line */}
      <div className="absolute left-8 md:left-16 top-0 bottom-0 w-[1px] bg-white/5" />

      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          {/* Text Content */}
          <div className="space-y-8">
            <Reveal>
              <p className="text-xs tracking-[0.5em] uppercase text-gray-500 mb-4">
                Nossa Origem
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-wider leading-tight">
                Nascemos da
                <br />
                <span className="text-gray-400">Precisão Técnica</span>
              </h2>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="text-gray-400 text-base md:text-lg leading-relaxed max-w-lg">
                Nossa história é escrita em cada fibra, unindo identidade e propósito
                para quem não aceita limites. EFSIX nasceu para impulsionar sua
                jornada com tecnologia de ponta e design brutalista.
              </p>
            </Reveal>

            <Reveal delay={0.3}>
              <p className="text-gray-500 text-sm leading-relaxed max-w-lg">
                Focado em quem levanta o nível do desempenho, cada peça carrega a
                fusão entre a força pura do atleta brasileiro e engenharia de
                materiais de última geração.
              </p>
            </Reveal>

            <Reveal delay={0.4}>
              <div className="flex items-center gap-6 pt-4">
                <div className="text-center">
                  <p className="font-display text-3xl font-bold">50+</p>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-gray-500 mt-1">
                    FPS Proteção
                  </p>
                </div>
                <div className="w-[1px] h-12 bg-white/10" />
                <div className="text-center">
                  <p className="font-display text-3xl font-bold">4x</p>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-gray-500 mt-1">
                    Mais Durável
                  </p>
                </div>
                <div className="w-[1px] h-12 bg-white/10" />
                <div className="text-center">
                  <p className="font-display text-3xl font-bold">100%</p>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-gray-500 mt-1">
                    Nacional
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Visual Element - Placeholder with parallax */}
          <motion.div style={{ y: imageY }} className="relative">
            <div className="aspect-[3/4] bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-white/5 relative overflow-hidden">
              {/* Abstract geometric design placeholder */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    className="w-48 h-48 md:w-64 md:h-64 border border-white/10"
                  />
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-4 border border-white/5 rotate-45"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-display text-5xl md:text-6xl font-bold tracking-[0.3em] text-white/10">
                      EF
                    </span>
                  </div>
                </div>
              </div>

              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-white/20" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-white/20" />
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
