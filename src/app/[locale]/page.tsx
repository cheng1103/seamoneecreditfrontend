import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import ProductsSection from '@/components/home/ProductsSection';
import CalculatorSection from '@/components/home/CalculatorSection';
import EligibilitySection from '@/components/home/EligibilitySection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import CTASection from '@/components/home/CTASection';
import { getFeaturedTestimonialsServer } from '@/lib/server/testimonials';

export default async function HomePage() {
  const testimonials = await getFeaturedTestimonialsServer();

  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <ProductsSection />
      <HowItWorksSection />
      <EligibilitySection />
      <CalculatorSection />
      <TestimonialsSection initialTestimonials={testimonials} />
      <CTASection />
    </>
  );
}
