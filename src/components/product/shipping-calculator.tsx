'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Loader2, CheckCircle2, AlertCircle, Truck } from 'lucide-react';
import type { ShippingOption } from '@/types';
import { useCartStore } from '@/stores/cart-store';

interface ShippingCalculatorProps {
  onSelectOption?: (option: ShippingOption) => void;
  selectedOption?: ShippingOption | null;
  autoApplyToCart?: boolean;
}

export default function ShippingCalculator({
  onSelectOption,
  selectedOption,
  autoApplyToCart = false,
}: ShippingCalculatorProps) {
  const [cep, setCep] = useState('');
  const [options, setOptions] = useState<ShippingOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [addressPreview, setAddressPreview] = useState<string | null>(null);

  const cartShipping = useCartStore((state) => state.shipping);
  const setCartShipping = useCartStore((state) => state.setShipping);

  const activeSelected = selectedOption || cartShipping;

  const formatCep = (value: string) => {
    const raw = value.replace(/\D/g, '');
    if (raw.length <= 5) return raw;
    return `${raw.slice(0, 5)}-${raw.slice(5, 8)}`;
  };

  const handleCalculate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const rawCep = cep.replace(/\D/g, '');

    if (rawCep.length !== 8) {
      setError('Informe um CEP válido com 8 dígitos.');
      setOptions([]);
      setAddressPreview(null);
      return;
    }

    setError('');
    setLoading(true);
    setOptions([]);
    setAddressPreview(null);

    try {
      // Simulação / Consulta de CEP via ViaCEP (real e confiável no Brasil)
      const res = await fetch(`https://viacep.com.br/ws/${rawCep}/json/`);
      const data = await res.json();

      if (data.erro) {
        // RN01: O frete só será calculado e disponibilizado para territórios com cobertura da transportadora integrada.
        setError('CEP não localizado ou fora da área de cobertura das transportadoras.');
        setLoading(false);
        return;
      }

      setAddressPreview(`${data.logradouro ? data.logradouro + ' - ' : ''}${data.bairro ? data.bairro + ', ' : ''}${data.localidade}/${data.uf}`);

      // Cálculo de tarifas dinâmicas baseadas na UF
      const isSP = data.uf === 'SP';
      const isSudeste = ['SP', 'RJ', 'MG', 'ES'].includes(data.uf);

      const calculatedOptions: ShippingOption[] = [
        {
          name: 'PAC Correios Express',
          service: 'pac',
          price: isSP ? 18.50 : isSudeste ? 24.90 : 38.00,
          deadline: isSP ? '4 a 6 dias úteis' : isSudeste ? '6 a 9 dias úteis' : '10 a 14 dias úteis',
        },
        {
          name: 'SEDEX Armour Priority',
          service: 'sedex',
          price: isSP ? 28.00 : isSudeste ? 39.50 : 58.00,
          deadline: isSP ? '1 a 2 dias úteis' : isSudeste ? '2 a 3 dias úteis' : '3 a 5 dias úteis',
        },
      ];

      setOptions(calculatedOptions);

      // Auto-select lowest option if configured
      if (autoApplyToCart && calculatedOptions.length > 0) {
        setCartShipping(calculatedOptions[0]);
        if (onSelectOption) onSelectOption(calculatedOptions[0]);
      }
    } catch (err) {
      setError('Erro ao calcular frete para este CEP. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (opt: ShippingOption) => {
    if (autoApplyToCart) {
      setCartShipping(opt);
    }
    if (onSelectOption) {
      onSelectOption(opt);
    }
  };

  return (
    <div className="border border-white/10 bg-[#060606] p-5">
      <div className="flex items-center gap-2 mb-3">
        <Truck size={16} className="text-zinc-400" />
        <span className="text-xs font-bold tracking-[0.25em] uppercase text-zinc-300">
          Cálculo de Frete & Prazos
        </span>
      </div>

      <form onSubmit={handleCalculate} className="flex gap-2">
        <div className="relative flex-1">
          <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={cep}
            onChange={(e) => setCep(formatCep(e.target.value))}
            placeholder="00000-000"
            maxLength={9}
            className="w-full bg-[#0a0a0a] border border-white/15 pl-9 pr-3 py-2.5 text-xs tracking-widest text-white placeholder:text-zinc-600 focus:outline-none focus:border-white uppercase"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="border border-white bg-white text-black px-5 py-2.5 text-xs font-black tracking-[0.2em] uppercase hover:bg-zinc-200 transition-colors disabled:opacity-50"
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : 'Calcular'}
        </button>
      </form>

      {error && (
        <div className="flex items-center gap-2 mt-3 text-red-400 text-xs">
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}

      {addressPreview && (
        <p className="text-[11px] text-zinc-400 mt-2 font-mono">
          Destino: <span className="text-white">{addressPreview}</span>
        </p>
      )}

      <AnimatePresence>
        {options.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 space-y-2.5 overflow-hidden"
          >
            {options.map((opt) => {
              const isSelected = activeSelected?.service === opt.service;
              return (
                <div
                  key={opt.service}
                  onClick={() => handleSelect(opt)}
                  className={`flex items-center justify-between p-3 border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-white bg-white/10'
                      : 'border-white/5 bg-[#0a0a0a] hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-white bg-white' : 'border-zinc-600'
                      }`}
                    >
                      {isSelected && <div className="w-1.5 h-1.5 bg-black rounded-full" />}
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-white">
                        {opt.name}
                      </p>
                      <p className="text-[10px] text-zinc-400">{opt.deadline}</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-white">
                    R$ {opt.price.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
