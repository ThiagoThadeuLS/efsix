'use client';

import { motion } from 'framer-motion';
import Container from '@/components/ui/container';
import Reveal from '@/components/ui/reveal';
import { Shield, Zap, Target } from 'lucide-react';

const values = [
  {
    icon: Zap,
    title: 'Alta Performance',
    description:
      'Tecidos desenvolvidos com tecnologia de compressão e termorregulação para maximizar seu desempenho em qualquer modalidade.',
    number: '01',
  },
  {
    icon: Shield,
    title: 'Proteção',
    description:
      'Proteção UV50+ certificada, costuras reforçadas e materiais resistentes à abrasão. Feito para enfrentar o que vier.',
    number: '02',
  },
  {
    icon: Target,
    title: 'Propósito',
    description:
      'Cada peça carrega a identidade do atleta que não se conforma. Vestir EFSIX é declarar que performance é um estilo de vida.',
    number: '03',
  },
];

export default function ValuesSection() {
  return (
    <section id="valores" className="py-24 md:py-40 bg-[#0a0a0a] relative">
      {/* Top border glow */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <Container>
        <Reveal>
          <div className="text-center mb-16 md:mb-24">
            <p className="text-xs tracking-[0.5em] uppercase text-gray-500 mb-4">
              Nossos Pilares
            </p>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-wider">
              O que nos define
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4">
          {values.map((value, index) => (
            <Reveal key={value.title} delay={index * 0.15}>
              <motion.div
                whileHover={{ y: -8, borderColor: 'rgba(255,255,255,0.15)' }}
                transition={{ duration: 0.3 }}
                className="group p-8 md:p-10 border border-white/5 bg-[#020202] relative overflow-hidden"
              >
                {/* Number */}
                <span className="absolute top-6 right-6 font-display text-6xl font-bold text-white/[0.03] leading-none">
                  {value.number}
                </span>

                {/* Icon */}
                <div className="mb-8 relative">
                  <div className="w-12 h-12 border border-white/10 flex items-center justify-center group-hover:border-white/30 transition-colors duration-500">
                    <value.icon size={20} strokeWidth={1.5} className="text-gray-400 group-hover:text-white transition-colors duration-500" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="font-display text-xl md:text-2xl font-bold uppercase tracking-wider mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {value.description}
                </p>

                {/* Bottom line */}
                <motion.div
                  className="absolute bottom-0 left-0 h-[2px] bg-white"
                  initial={{ width: '0%' }}
                  whileHover={{ width: '100%' }}
                  transition={{ duration: 0.5 }}
                />
              </motion.div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
