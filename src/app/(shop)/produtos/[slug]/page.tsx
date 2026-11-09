import { notFound } from 'next/navigation';
import Container from '@/components/ui/container';
import ProductDetail from '@/components/product/product-detail';
import { mockProducts } from '@/lib/mock-products';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export async function generateStaticParams() {
  return mockProducts.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = mockProducts.find((p) => p.slug === slug);

  if (!product) {
    return {
      title: 'Produto não encontrado — EFSIX',
    };
  }

  return {
    title: `${product.name} — EFSIX Built as Armour`,
    description: product.description,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = mockProducts.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <Container>
        {/* Breadcrumb / Back Link */}
        <div className="mb-8">
          <Link
            href="/produtos"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} /> Voltar ao catálogo de armaduras
          </Link>
        </div>

        <ProductDetail product={product} />
      </Container>
    </div>
  );
}
