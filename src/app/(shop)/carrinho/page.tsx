import Container from '@/components/ui/container';
import CartContent from '@/components/cart/cart-content';

export const metadata = {
  title: 'Carrinho de Armaduras — EFSIX Built as Armour',
  description: 'Revise os itens selecionados antes de prosseguir para o checkout blindado.',
};

export default function CartPage() {
  return (
    <div className="pt-32 pb-24 min-h-screen">
      <Container>
        <CartContent />
      </Container>
    </div>
  );
}
