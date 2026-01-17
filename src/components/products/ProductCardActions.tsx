'use client';

import Link from 'next/link';
import { trackEvent } from '@/lib/analytics';
import { Button } from '@/components/ui/button';

type Props = {
  locale: string;
  slug: string;
  learnLabel: string;
  applyLabel: string;
};

export function ProductCardActions({ locale, slug, learnLabel, applyLabel }: Props) {
  const handleLearnClick = () => {
    trackEvent(`product_learn_click_${slug}`);
  };

  const handleApplyClick = () => {
    trackEvent(`product_apply_click_${slug}`);
  };

  return (
    <>
      <Button asChild variant="outline" className="flex-1 rounded-2xl border-primary/50 bg-white text-primary hover:bg-primary/5 hover:border-primary">
        <Link href={`/${locale}/products/${slug}`} onClick={handleLearnClick}>
          {learnLabel}
        </Link>
      </Button>
      <Button asChild className="flex-1 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90">
        <Link href={`/${locale}/apply`} onClick={handleApplyClick}>
          {applyLabel}
        </Link>
      </Button>
    </>
  );
}
