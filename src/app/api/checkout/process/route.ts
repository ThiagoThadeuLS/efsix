import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId, amount, paymentMethod, customer } = body;

    if (!orderId || !amount || !paymentMethod) {
      return NextResponse.json(
        { error: 'Parâmetros incompletos para processar pagamento.' },
        { status: 400 }
      );
    }

    if (paymentMethod === 'pix') {
      // Simulação de gateway Pix (como Mercado Pago, Pagar.me, Asaas, Stripe ou Efi)
      const fakeQrCodeText = `00020126580014br.gov.bcb.pix0136efsix-${orderId}-armour520400005303986540${amount.toFixed(2)}5802BR5915EFSIX ARMOUR BR6009SAO PAULO62070503***6304ABCD`;

      return NextResponse.json({
        success: true,
        status: 'approved', // Pix simula aprovação rápida para demonstrar RN02 e RF07
        paymentId: `PIX_${Date.now()}`,
        qrCodeText: fakeQrCodeText,
        qrCodeImage: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
          fakeQrCodeText
        )}`,
        message: 'Código Pix gerado e aprovado com sucesso!',
      });
    }

    if (paymentMethod === 'credit_card') {
      // Simulação de autorização de cartão
      return NextResponse.json({
        success: true,
        status: 'approved', // Gateway retorna status 'Aprovado'
        transactionId: `TX_${Date.now()}_CC`,
        authorizationCode: `AUTH_${Math.floor(100000 + Math.random() * 900000)}`,
        message: 'Transação autorizada pela operadora.',
      });
    }

    return NextResponse.json(
      { error: 'Método de pagamento não suportado.' },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Falha no processamento do pagamento.' },
      { status: 500 }
    );
  }
}
