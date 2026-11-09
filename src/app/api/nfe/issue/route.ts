import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId, paymentStatus, customer, items, total } = body;

    // RN02: A requisição de emissão de NFe e a mudança do status do pedido para "Preparando Envio" só ocorrerão se o gateway retornar o status de pagamento como "Aprovado"
    if (paymentStatus !== 'approved' && paymentStatus !== 'Aprovado') {
      return NextResponse.json(
        {
          success: false,
          error: 'Bloqueio RN02: A emissão de NFe só é permitida quando o status de pagamento for Aprovado.',
        },
        { status: 403 }
      );
    }

    // Geração simulada da chave de acesso da NFe de 44 dígitos
    const ufCode = '35'; // SP
    const yearMonth = '2611';
    const cnpj = '55123456000188';
    const model = '55';
    const series = '001';
    const nfeNumber = String(Math.floor(100000000 + Math.random() * 900000000)).slice(0, 9);
    const code = String(Math.floor(10000000 + Math.random() * 90000000)).slice(0, 8);
    const dv = '7';
    const nfeKey = `${ufCode}${yearMonth}${cnpj}${model}${series}${nfeNumber}${code}${dv}`;

    // Payload pronto para integração com Focus NFe ou Bling
    const nfePayload = {
      natureza_operacao: 'Venda de mercadorias no e-commerce',
      data_emissao: new Date().toISOString(),
      cliente: {
        nome_completo: customer?.name || 'Atleta EFSIX',
        cpf_cnpj: customer?.document || '000.000.000-00',
        email: customer?.email,
      },
      itens: items?.map((item: any, idx: number) => ({
        numero_item: idx + 1,
        codigo_produto: item.product?.id,
        descricao: `${item.product?.name} (Tam: ${item.size})`,
        cfop: '5102',
        ncm: '61099000', // Vestuário esportivo
        quantidade: item.quantity,
        valor_unitario: item.product?.price,
      })),
      valor_total: total,
    };

    return NextResponse.json({
      success: true,
      nfeKey,
      status: 'Preparando Envio', // Mudança de status para Preparando Envio conforme RN02
      protocol: `PROT_${Date.now()}`,
      issuedAt: new Date().toISOString(),
      provider: 'Focus NFe / Bling Enterprise Hub',
      message: 'Nota Fiscal emitida e autorizada pela SEFAZ com sucesso.',
      payloadSent: nfePayload,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Erro ao comunicar com a API de NFe.' },
      { status: 500 }
    );
  }
}
