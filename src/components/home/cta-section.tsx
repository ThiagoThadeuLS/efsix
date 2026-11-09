'use client';

import { motion } from 'framer-motion';
import Container from '@/components/ui/container';
import Button from '@/components/ui/button';
import MagneticButton from '@/components/ui/magnetic-button';
import Reveal from '@/components/ui/reveal';
import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="py-24 md:py-40 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.03) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 50%, rgba(255,255,255,0.03) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.03) 0%, transparent 50%)',
            ],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0"
        />
      </div>

      <Container className="relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <Reveal>
            <p className="text-xs tracking-[0.5em] uppercase text-gray-500 mb-6">
              Junte-se à revolução
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold uppercase tracking-wider mb-6 leading-tight">
              Vista sua
              <br />
              Armadura
            </h2>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="text-gray-400 text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
              Alta performance, proteção e propósito em cada fibra.
              Descubra a coleção que vai elevar seu treino a outro nível.
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <MagneticButton>
                <Link href="/produtos">
                  <Button variant="primary" size="lg">
                    Comprar Agora
                  </Button>
                </Link>
              </MagneticButton>
              <MagneticButton>
                <Link href="/sobre">
                  <Button variant="outline" size="lg">
                    Conheça a EFSIX
                  </Button>
                </Link>
              </MagneticButton>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
