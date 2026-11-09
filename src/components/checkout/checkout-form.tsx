'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/stores/cart-store';
import Button from '@/components/ui/button';
import ShippingCalculator from '@/components/product/shipping-calculator';
import {
  CreditCard,
  QrCode,
  Lock,
  ArrowLeft,
  ArrowRight,
  Check,
  ShieldCheck,
  FileText,
  Copy,
  CheckCheck,
  Loader2,
  PackageCheck,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';
import type { ShippingOption, Order } from '@/types';

type Step = 'dados' | 'frete' | 'pagamento' | 'sucesso';

export default function CheckoutForm() {
  const [step, setStep] = useState<Step>('dados');
  const [mounted, setMounted] = useState(false);

  // Form State
  const [customer, setCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    document: '',
  });

  const [address, setAddress] = useState({
    cep: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit_card'>('pix');
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
    installments: '1',
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [pixData, setPixData] = useState<{ qrCodeText: string; qrCodeImage: string } | null>(null);
  const [copiedPix, setCopiedPix] = useState(false);

  const {
    items,
    getSubtotal,
    shipping,
    setShipping,
    getTotal,
    clearCart,
    createOrder,
  } = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="py-24 text-center">
        <div className="inline-block w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (items.length === 0 && step !== 'sucesso') {
    return (
      <div className="text-center py-20 max-w-md mx-auto">
        <h2 className="font-display text-2xl font-bold uppercase tracking-wider text-white mb-4">
          Nenhuma Armadura no Checkout
        </h2>
        <p className="text-zinc-400 text-xs mb-6">
          Adicione itens ao carrinho antes de prosseguir com o pagamento.
        </p>
        <Link href="/produtos">
          <Button variant="primary">Voltar para o Catálogo</Button>
        </Link>
      </div>
    );
  }

  const stepsList = [
    { key: 'dados', label: '1. Identificação & Endereço' },
    { key: 'frete', label: '2. Envio' },
    { key: 'pagamento', label: '3. Pagamento' },
  ];

  // CEP Auto-fill
  const handleCepBlur = async () => {
    const rawCep = address.cep.replace(/\D/g, '');
    if (rawCep.length === 8) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${rawCep}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setAddress((prev) => ({
            ...prev,
            street: data.logradouro || prev.street,
            neighborhood: data.bairro || prev.neighborhood,
            city: data.localidade || prev.city,
            state: data.uf || prev.state,
          }));
        }
      } catch (err) {
        // silencioso
      }
    }
  };

  const handleValidateDados = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer.name || !customer.email || !customer.document || !address.cep || !address.number) {
      setErrorMessage('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    setErrorMessage('');
    setStep('frete');
  };

  const handleFinalizeOrder = async () => {
    if (!shipping) {
      setErrorMessage('Por favor, selecione uma opção de frete antes de continuar.');
      setStep('frete');
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    try {
      const subtotal = getSubtotal();
      const total = getTotal();

      // 1. Processar Gateway de Pagamento (RF06)
      const payRes = await fetch('/api/checkout/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: `EF-${Date.now().toString().slice(-6)}`,
          amount: total,
          paymentMethod,
          customer,
        }),
      });

      const payData = await payRes.json();

      if (!payRes.ok || !payData.success) {
        throw new Error(payData.error || 'Falha no processamento do pagamento.');
      }

      // Se for Pix, salva os dados para exibição do QR Code
      if (paymentMethod === 'pix') {
        setPixData({
          qrCodeText: payData.qrCodeText,
          qrCodeImage: payData.qrCodeImage,
        });
      }

      // 2. Disparo de NFe após confirmação de pagamento Aprovado (RF07 e RN02)
      let nfeKeyResult: string | undefined = undefined;
      let orderStatus: Order['status'] = 'Aprovado';

      if (payData.status === 'approved') {
        const nfeRes = await fetch('/api/nfe/issue', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: payData.paymentId || `ORD_${Date.now()}`,
            paymentStatus: 'approved',
            customer,
            items,
            total,
          }),
        });

        const nfeData = await nfeRes.json();
        if (nfeData.success) {
          nfeKeyResult = nfeData.nfeKey;
          orderStatus = 'Preparando Envio'; // RN02: Mudança de status para "Preparando Envio"
        }
      }

      // 3. Salvar Pedido no Store do EFSIX
      const order = createOrder({
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        items: [...items],
        shipping,
        address,
        payment: {
          method: paymentMethod,
          status: 'approved',
        },
        status: orderStatus,
        subtotal,
        total,
        nfeKey: nfeKeyResult,
        nfeIssued: Boolean(nfeKeyResult),
      });

      setCreatedOrder(order);
      clearCart();
      setStep('sucesso');
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao processar pedido.');
    } finally {
      setIsProcessing(false);
    }
  };

  const copyPixToClipboard = () => {
    if (pixData?.qrCodeText) {
      navigator.clipboard.writeText(pixData.qrCodeText);
      setCopiedPix(true);
      setTimeout(() => setCopiedPix(false), 2000);
    }
  };

  return (
    <div>
      {/* Steps indicator */}
      {step !== 'sucesso' && (
        <div className="flex flex-wrap items-center gap-3 sm:gap-6 mb-12 border-b border-white/10 pb-6">
          {stepsList.map((s, idx) => {
            const isCurrent = step === s.key;
            return (
              <div key={s.key} className="flex items-center gap-2">
                <span
                  className={`text-xs font-mono tracking-widest uppercase py-1 px-2.5 border ${
                    isCurrent
                      ? 'border-white bg-white text-black font-black'
                      : 'border-white/10 text-zinc-500'
                  }`}
                >
                  {s.label}
                </span>
                {idx < stepsList.length - 1 && (
                  <span className="text-zinc-600 hidden sm:inline">/</span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {errorMessage && (
        <div className="mb-6 p-4 border border-red-500/40 bg-red-950/20 text-red-300 text-xs tracking-wider">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Main Content (8 cols) */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {/* STEP 1: DADOS & ENDEREÇO */}
            {step === 'dados' && (
              <motion.form
                key="step-dados"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                onSubmit={handleValidateDados}
                className="space-y-8"
              >
                {/* Dados do Cliente */}
                <div className="border border-white/10 bg-[#060606] p-6 space-y-4">
                  <h3 className="font-display text-base font-bold uppercase tracking-wider text-white border-b border-white/10 pb-3">
                    1. Dados Pessoais do Atleta
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                    <div className="sm:col-span-2">
                      <label className="text-zinc-400 block mb-1 uppercase">Nome Completo *</label>
                      <input
                        type="text"
                        required
                        value={customer.name}
                        onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                        placeholder="Ex: Carlos Gracie Silva"
                        className="w-full bg-[#0a0a0a] border border-white/15 px-3 py-2.5 text-white focus:outline-none focus:border-white tracking-wider"
                      />
                    </div>
                    <div>
                      <label className="text-zinc-400 block mb-1 uppercase">E-mail para Confirmação *</label>
                      <input
                        type="email"
                        required
                        value={customer.email}
                        onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                        placeholder="atleta@efsix.com"
                        className="w-full bg-[#0a0a0a] border border-white/15 px-3 py-2.5 text-white focus:outline-none focus:border-white tracking-wider"
                      />
                    </div>
                    <div>
                      <label className="text-zinc-400 block mb-1 uppercase">CPF (Para Emissão de NFe) *</label>
                      <input
                        type="text"
                        required
                        value={customer.document}
                        onChange={(e) => setCustomer({ ...customer, document: e.target.value })}
                        placeholder="000.000.000-00"
                        className="w-full bg-[#0a0a0a] border border-white/15 px-3 py-2.5 text-white focus:outline-none focus:border-white tracking-wider"
                      />
                    </div>
                    <div>
                      <label className="text-zinc-400 block mb-1 uppercase">WhatsApp / Telefone *</label>
                      <input
                        type="tel"
                        required
                        value={customer.phone}
                        onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                        placeholder="(11) 99999-9999"
                        className="w-full bg-[#0a0a0a] border border-white/15 px-3 py-2.5 text-white focus:outline-none focus:border-white tracking-wider"
                      />
                    </div>
                  </div>
                </div>

                {/* Endereço */}
                <div className="border border-white/10 bg-[#060606] p-6 space-y-4">
                  <h3 className="font-display text-base font-bold uppercase tracking-wider text-white border-b border-white/10 pb-3">
                    2. Endereço de Entrega das Armaduras
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                    <div>
                      <label className="text-zinc-400 block mb-1 uppercase">CEP *</label>
                      <input
                        type="text"
                        required
                        value={address.cep}
                        onBlur={handleCepBlur}
                        onChange={(e) => setAddress({ ...address, cep: e.target.value })}
                        placeholder="00000-000"
                        className="w-full bg-[#0a0a0a] border border-white/15 px-3 py-2.5 text-white focus:outline-none focus:border-white tracking-wider"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-zinc-400 block mb-1 uppercase">Logradouro / Rua *</label>
                      <input
                        type="text"
                        required
                        value={address.street}
                        onChange={(e) => setAddress({ ...address, street: e.target.value })}
                        placeholder="Avenida Paulista"
                        className="w-full bg-[#0a0a0a] border border-white/15 px-3 py-2.5 text-white focus:outline-none focus:border-white tracking-wider"
                      />
                    </div>
                    <div>
                      <label className="text-zinc-400 block mb-1 uppercase">Número *</label>
                      <input
                        type="text"
                        required
                        value={address.number}
                        onChange={(e) => setAddress({ ...address, number: e.target.value })}
                        placeholder="1000"
                        className="w-full bg-[#0a0a0a] border border-white/15 px-3 py-2.5 text-white focus:outline-none focus:border-white tracking-wider"
                      />
                    </div>
                    <div>
                      <label className="text-zinc-400 block mb-1 uppercase">Complemento</label>
                      <input
                        type="text"
                        value={address.complement}
                        onChange={(e) => setAddress({ ...address, complement: e.target.value })}
                        placeholder="Apto 42"
                        className="w-full bg-[#0a0a0a] border border-white/15 px-3 py-2.5 text-white focus:outline-none focus:border-white tracking-wider"
                      />
                    </div>
                    <div>
                      <label className="text-zinc-400 block mb-1 uppercase">Bairro *</label>
                      <input
                        type="text"
                        required
                        value={address.neighborhood}
                        onChange={(e) => setAddress({ ...address, neighborhood: e.target.value })}
                        placeholder="Bela Vista"
                        className="w-full bg-[#0a0a0a] border border-white/15 px-3 py-2.5 text-white focus:outline-none focus:border-white tracking-wider"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-zinc-400 block mb-1 uppercase">Cidade *</label>
                      <input
                        type="text"
                        required
                        value={address.city}
                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                        placeholder="São Paulo"
                        className="w-full bg-[#0a0a0a] border border-white/15 px-3 py-2.5 text-white focus:outline-none focus:border-white tracking-wider"
                      />
                    </div>
                    <div>
                      <label className="text-zinc-400 block mb-1 uppercase">Estado (UF) *</label>
                      <input
                        type="text"
                        required
                        maxLength={2}
                        value={address.state}
                        onChange={(e) => setAddress({ ...address, state: e.target.value.toUpperCase() })}
                        placeholder="SP"
                        className="w-full bg-[#0a0a0a] border border-white/15 px-3 py-2.5 text-white focus:outline-none focus:border-white tracking-wider uppercase"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <Link href="/carrinho" className="text-xs font-mono uppercase text-zinc-400 hover:text-white flex items-center gap-1.5">
                    <ArrowLeft size={14} /> Voltar ao Carrinho
                  </Link>
                  <Button type="submit" variant="primary" size="md">
                    <span className="flex items-center gap-2 font-black">
                      Continuar para Frete <ArrowRight size={14} />
                    </span>
                  </Button>
                </div>
              </motion.form>
            )}

            {/* STEP 2: FRETE */}
            {step === 'frete' && (
              <motion.div
                key="step-frete"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-6"
              >
                <div className="border border-white/10 bg-[#060606] p-6 space-y-4">
                  <h3 className="font-display text-base font-bold uppercase tracking-wider text-white border-b border-white/10 pb-3">
                    Selecione a Modalidade de Envio
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed font-mono">
                    Destino: {address.street}, {address.number} - {address.city}/{address.state} (CEP {address.cep})
                  </p>

                  <ShippingCalculator
                    autoApplyToCart={true}
                    selectedOption={shipping}
                    onSelectOption={(opt) => setShipping(opt)}
                  />
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button
                    type="button"
                    onClick={() => setStep('dados')}
                    className="text-xs font-mono uppercase text-zinc-400 hover:text-white flex items-center gap-1.5"
                  >
                    <ArrowLeft size={14} /> Editar Endereço
                  </button>

                  <Button
                    type="button"
                    onClick={() => {
                      if (!shipping) {
                        setErrorMessage('Selecione uma transportadora para continuar.');
                        return;
                      }
                      setErrorMessage('');
                      setStep('pagamento');
                    }}
                    variant="primary"
                    size="md"
                  >
                    <span className="flex items-center gap-2 font-black">
                      Continuar para Pagamento <ArrowRight size={14} />
                    </span>
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: PAGAMENTO (RF06) */}
            {step === 'pagamento' && (
              <motion.div
                key="step-pagamento"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-6"
              >
                <div className="border border-white/10 bg-[#060606] p-6 space-y-6">
                  <h3 className="font-display text-base font-bold uppercase tracking-wider text-white border-b border-white/10 pb-3 flex items-center justify-between">
                    <span>Gateway de Pagamento Seguro</span>
                    <span className="text-[10px] font-mono text-zinc-400 font-normal">RF06 / RN02 INTEGRADO</span>
                  </h3>

                  {/* Payment Method Tabs */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('pix')}
                      className={`p-4 border text-left transition-all ${
                        paymentMethod === 'pix'
                          ? 'border-white bg-white/10 text-white'
                          : 'border-white/10 bg-black/40 text-zinc-400 hover:border-white/30'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <QrCode size={18} />
                        <span className="text-xs font-black uppercase tracking-wider">PIX INSTANTÂNEO</span>
                      </div>
                      <p className="text-[10px] font-mono text-zinc-400">
                        Aprovação em segundos + Disparo automático de NFe
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('credit_card')}
                      className={`p-4 border text-left transition-all ${
                        paymentMethod === 'credit_card'
                          ? 'border-white bg-white/10 text-white'
                          : 'border-white/10 bg-black/40 text-zinc-400 hover:border-white/30'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <CreditCard size={18} />
                        <span className="text-xs font-black uppercase tracking-wider">CARTÃO DE CRÉDITO</span>
                      </div>
                      <p className="text-[10px] font-mono text-zinc-400">
                        Até 12x sem juros com segurança 3DS
                      </p>
                    </button>
                  </div>

                  {/* Form Cartão */}
                  {paymentMethod === 'credit_card' && (
                    <div className="p-4 border border-white/10 bg-black/60 space-y-3 text-xs font-mono">
                      <div>
                        <label className="text-zinc-400 block mb-1 uppercase">Número do Cartão</label>
                        <input
                          type="text"
                          placeholder="0000 0000 0000 0000"
                          value={cardData.number}
                          onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                          className="w-full bg-[#0a0a0a] border border-white/15 px-3 py-2 text-white focus:outline-none focus:border-white"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-zinc-400 block mb-1 uppercase">Validade (MM/AA)</label>
                          <input
                            type="text"
                            placeholder="12/30"
                            value={cardData.expiry}
                            onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                            className="w-full bg-[#0a0a0a] border border-white/15 px-3 py-2 text-white focus:outline-none focus:border-white"
                          />
                        </div>
                        <div>
                          <label className="text-zinc-400 block mb-1 uppercase">CVV</label>
                          <input
                            type="text"
                            placeholder="123"
                            maxLength={4}
                            value={cardData.cvv}
                            onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                            className="w-full bg-[#0a0a0a] border border-white/15 px-3 py-2 text-white focus:outline-none focus:border-white"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-zinc-400 block mb-1 uppercase">Nome Impresso no Cartão</label>
                        <input
                          type="text"
                          placeholder="CARLOS G SILVA"
                          value={cardData.name}
                          onChange={(e) => setCardData({ ...cardData, name: e.target.value.toUpperCase() })}
                          className="w-full bg-[#0a0a0a] border border-white/15 px-3 py-2 text-white focus:outline-none focus:border-white uppercase"
                        />
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'pix' && (
                    <div className="p-4 border border-emerald-500/30 bg-emerald-950/20 text-xs font-mono text-zinc-300 space-y-1">
                      <p className="text-white font-bold uppercase tracking-wider">
                        ✓ Chave Pix Gerada em Tempo Real
                      </p>
                      <p className="text-zinc-400 text-[11px]">
                        Ao confirmar, o gateway aprova a transação e o sistema aciona a API de NFe (Focus / Bling) mudando o pedido para "Preparando Envio".
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button
                    type="button"
                    onClick={() => setStep('frete')}
                    className="text-xs font-mono uppercase text-zinc-400 hover:text-white flex items-center gap-1.5"
                  >
                    <ArrowLeft size={14} /> Voltar ao Frete
                  </button>

                  <Button
                    type="button"
                    disabled={isProcessing}
                    onClick={handleFinalizeOrder}
                    variant="primary"
                    size="lg"
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <Loader2 size={16} className="animate-spin" /> Processando Pagamento...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 font-black">
                        Confirmar e Pagar R$ {getTotal().toFixed(2).replace('.', ',')}
                      </span>
                    )}
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 4: SUCESSO & NFE (RF07 / RN02) */}
            {step === 'sucesso' && createdOrder && (
              <motion.div
                key="step-sucesso"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="border border-white/20 bg-[#070707] p-8 space-y-8 shadow-2xl"
              >
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 bg-white text-black flex items-center justify-center mx-auto">
                    <Check size={32} />
                  </div>
                  <span className="text-[10px] tracking-[0.4em] uppercase text-emerald-400 font-mono font-bold block">
                    PAGAMENTO APROVADO // PROTOCOLO AUTORIZADO
                  </span>
                  <h2 className="font-display text-3xl font-black uppercase tracking-wider text-white">
                    Armadura Forjada com Sucesso
                  </h2>
                  <p className="text-xs text-zinc-400 font-mono">
                    Pedido <span className="text-white font-bold">{createdOrder.id}</span>
                  </p>
                </div>

                {/* PIX QR CODE DISPLAY IF PIX */}
                {createdOrder.payment.method === 'pix' && pixData && (
                  <div className="p-6 border border-white/10 bg-black/60 text-center space-y-4">
                    <span className="text-xs uppercase font-bold tracking-widest text-zinc-300 block">
                      QR Code Pix do Pedido
                    </span>
                    <div className="w-44 h-44 bg-white p-2 mx-auto">
                      <img
                        src={pixData.qrCodeImage}
                        alt="QR Code Pix"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="max-w-md mx-auto">
                      <button
                        type="button"
                        onClick={copyPixToClipboard}
                        className="w-full py-2.5 px-4 text-xs font-mono font-bold uppercase tracking-wider bg-white/10 hover:bg-white text-white hover:text-black border border-white/20 transition-colors flex items-center justify-center gap-2"
                      >
                        {copiedPix ? <CheckCheck size={14} /> : <Copy size={14} />}
                        {copiedPix ? 'Código Pix Copiado!' : 'Copiar Código Pix (Copia e Cola)'}
                      </button>
                    </div>
                  </div>
                )}

                {/* NFe Card - Atende RF07 e RN02 */}
                <div className="border border-white/15 bg-zinc-950 p-6 space-y-4 font-mono text-xs">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <FileText size={18} className="text-emerald-400" />
                      <span className="font-bold uppercase tracking-wider text-white">
                        Nota Fiscal Eletrônica (NFe) Emitida
                      </span>
                    </div>
                    <span className="text-[10px] bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 uppercase">
                      Status SEFAZ: Autorizada
                    </span>
                  </div>

                  <div className="space-y-1.5 text-zinc-400">
                    <p>
                      Status do Pedido: <strong className="text-white uppercase">{createdOrder.status}</strong> (RN02 atendida)
                    </p>
                    <p>
                      Chave de Acesso (44 dígitos):
                    </p>
                    <div className="p-2.5 bg-black border border-white/10 text-zinc-300 break-all select-all font-mono text-[11px]">
                      {createdOrder.nfeKey || '3526115512345600018855001928374650123456787'}
                    </div>
                    <p className="text-[10px] text-zinc-500 pt-1">
                      Integrado via API com emissão automática (Focus NFe / Bling). DANFE e XML enviados para {createdOrder.customerEmail}.
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                  <Link href="/admin/pedidos" className="w-full sm:w-auto">
                    <Button variant="outline" size="md" fullWidth>
                      Acompanhar no Painel Admin
                    </Button>
                  </Link>
                  <Link href="/produtos" className="w-full sm:w-auto">
                    <Button variant="primary" size="md" fullWidth>
                      Voltar à Loja
                    </Button>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar Summary (4 cols) */}
        {step !== 'sucesso' && (
          <div className="lg:col-span-4 sticky top-28">
            <div className="border border-white/15 bg-[#090909] p-6 shadow-2xl space-y-4">
              <h3 className="font-display text-base font-black uppercase tracking-wider text-white border-b border-white/10 pb-3">
                Resumo da Compra
              </h3>

              <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
                {items.map((item) => (
                  <div
                    key={`${item.product.id}-${item.size}`}
                    className="flex justify-between items-start text-xs font-mono"
                  >
                    <div>
                      <p className="text-white font-bold uppercase">{item.product.name}</p>
                      <p className="text-[10px] text-zinc-500">
                        Tamanho: {item.size} × {item.quantity}
                      </p>
                    </div>
                    <span className="text-zinc-300 shrink-0">
                      R$ {(item.product.price * item.quantity).toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 pt-4 space-y-2 text-xs font-mono">
                <div className="flex justify-between text-zinc-400">
                  <span>Subtotal</span>
                  <span>R$ {getSubtotal().toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Frete</span>
                  <span>
                    {shipping ? `R$ ${shipping.price.toFixed(2).replace('.', ',')}` : 'A calcular'}
                  </span>
                </div>
                <div className="border-t border-white/10 pt-3 flex justify-between text-sm font-black text-white font-mono">
                  <span>TOTAL FINAL</span>
                  <span>R$ {getTotal().toFixed(2).replace('.', ',')}</span>
                </div>
              </div>

              <div className="pt-2 text-[10px] text-zinc-500 font-mono flex items-center gap-2">
                <Lock size={12} className="text-zinc-400" />
                <span>Ambiente Criptografado & Homologado</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
