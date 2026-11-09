import Container from '@/components/ui/container';
import CheckoutForm from '@/components/checkout/checkout-form';

export const metadata = {
  title: 'Checkout Blindado — EFSIX Built as Armour',
  description: 'Finalize sua compra de forma segura com Pix ou Cartão de Crédito.',
};

export default function CheckoutPage() {
  return (
    <div className="pt-32 pb-24 min-h-screen">
      <Container>
        <CheckoutForm />
      </Container>
    </div>
  );
}
