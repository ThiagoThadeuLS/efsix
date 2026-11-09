import Container from '@/components/ui/container';
import CatalogHeader from '@/components/product/catalog-header';
import ProductGrid from '@/components/product/product-grid';

export const metadata = {
  title: 'Armaduras & Produtos — EFSIX Built as Armour',
  description: 'Catálogo de rashguards de compressão, bermudas e roupas esportivas com máxima proteção e design brutalista.',
};

export default function ProductsPage() {
  return (
    <div className="pt-32 pb-24 min-h-screen">
      <Container>
        <CatalogHeader />
        <ProductGrid />
      </Container>
    </div>
  );
}
