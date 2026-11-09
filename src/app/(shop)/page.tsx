import HeroSection from '@/components/home/hero-section';
import OriginSection from '@/components/home/origin-section';
import ValuesSection from '@/components/home/values-section';
import FeaturedProducts from '@/components/home/featured-products';
import ManifestoSection from '@/components/home/manifesto-section';
import CTASection from '@/components/home/cta-section';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <OriginSection />
      <ValuesSection />
      <FeaturedProducts />
      <ManifestoSection />
      <CTASection />
    </>
  );
}
