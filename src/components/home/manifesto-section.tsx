'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function ManifestoSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const textX = useTransform(scrollYProgress, [0, 1], ['5%', '-5%']);

  return (
    <section
      ref={containerRef}
      className="py-32 md:py-48 bg-[#0a0a0a] relative overflow-hidden"
    >
      {/* Top border */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <motion.div
        style={{ scale, opacity }}
        className="max-w-6xl mx-auto px-4 text-center"
      >
        <motion.p
          style={{ x: textX }}
          className="font-display text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold uppercase tracking-wider leading-tight md:leading-tight"
        >
          <span className="text-gray-600">Não é sobre</span>
          <br />
          <span className="text-white">vestir uma roupa.</span>
          <br />
          <span className="text-gray-600">É sobre</span>
          <br />
          <span className="text-white">vestir sua</span>
          <br />
          <span className="text-white">armadura.</span>
        </motion.p>
      </motion.div>

      {/* Bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}
