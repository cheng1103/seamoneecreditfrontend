'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface FAQ {
  _id: string;
  question: { en: string; ms: string };
  answer: { en: string; ms: string };
  category: string;
  order: number;
}

interface Props {
  initialFaqs: FAQ[];
  locale: string;
}

const categories = [
  { en: 'All', ms: 'Semua', value: null },
  { en: 'General', ms: 'Umum', value: 'general' },
  { en: 'Application', ms: 'Permohonan', value: 'application' },
  { en: 'Repayment', ms: 'Pembayaran', value: 'repayment' },
  { en: 'Eligibility', ms: 'Kelayakan', value: 'eligibility' },
];

export default function FAQClient({ initialFaqs, locale }: Props) {
  const lang = locale === 'ms' ? 'ms' : 'en';
  const [faqs] = useState<FAQ[]>(initialFaqs);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredFAQs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchesSearch =
        faq.question[lang].toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer[lang].toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || faq.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [faqs, searchQuery, selectedCategory, lang]);

  const groupedFAQs = useMemo(() => {
    return filteredFAQs.reduce((acc, faq) => {
      if (!acc[faq.category]) {
        acc[faq.category] = [];
      }
      acc[faq.category].push(faq);
      return acc;
    }, {} as Record<string, FAQ[]>);
  }, [filteredFAQs]);

  const getCategoryLabel = (category: string) => {
    const found = categories.find((c) => c.value === category);
    return found ? found[lang as 'en' | 'ms'] : category;
  };

  return (
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden hero-surface py-16 md:py-24 text-white">
        <div className="hero-circuit opacity-60" aria-hidden="true" />
        <div className="hero-wave hero-wave--top" aria-hidden="true" />
        <div className="hero-wave" aria-hidden="true" />
        <div className="container relative text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-sky-200">
            {lang === 'ms' ? 'Pusat Bantuan' : 'Help Center'}
          </p>
          <h1 className="mt-4 text-3xl font-semibold md:text-4xl">
            {lang === 'ms' ? 'Soalan lazim SeaMoneeCredit' : 'SeaMoneeCredit FAQ'}
          </h1>
          <p className="mt-4 text-lg text-white/85">
            {lang === 'ms'
              ? 'Jawapan pantas untuk proses pinjaman yang telus.'
              : 'Straight answers for a transparent lending journey.'}
          </p>
          <div className="mx-auto mt-8 max-w-2xl rounded-full border border-white/30 bg-white/10 p-1 backdrop-blur">
            <Input
              type="text"
              placeholder={lang === 'ms' ? 'Cari soalan...' : 'Search a question...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 border-none bg-transparent text-center text-white placeholder:text-white/70 focus-visible:ring-0"
            />
          </div>
        </div>
      </section>

      <div className="container -mt-10 pb-16">
        <div className="flex flex-wrap justify-center gap-2 rounded-2xl border border-border bg-white p-4 shadow-lg">
          {categories.map((category) => (
            <button
              key={category.value || 'all'}
              type="button"
              onClick={() => setSelectedCategory(category.value)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                selectedCategory === category.value
                  ? 'bg-primary text-primary-foreground shadow'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {category[lang as 'en' | 'ms']}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.15fr_minmax(0,0.85fr)]">
          <div className="wave-card rounded-[28px] border border-border bg-white p-6 shadow-[0_25px_80px_rgba(7,17,52,0.08)]">
            {filteredFAQs.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                {lang === 'ms' ? 'Tiada soalan ditemui.' : 'No questions found.'}
              </div>
            ) : selectedCategory ? (
              <Accordion type="single" collapsible className="space-y-4">
                {filteredFAQs.map((faq) => (
                  <AccordionItem
                    key={faq._id}
                    value={faq._id}
                    className="rounded-2xl border border-border px-4"
                  >
                    <AccordionTrigger className="text-left text-base font-semibold hover:no-underline">
                      {faq.question[lang]}
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 text-sm text-muted-foreground">
                      {faq.answer[lang]}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="space-y-8">
                {Object.entries(groupedFAQs).map(([category, categoryFAQs]) => (
                  <div key={category} className="rounded-3xl border border-border bg-muted/30 p-4">
                    <h2 className="px-2 text-lg font-semibold">{getCategoryLabel(category)}</h2>
                    <Accordion type="single" collapsible className="space-y-2 mt-3">
                      {categoryFAQs.map((faq) => (
                        <AccordionItem
                          key={faq._id}
                          value={faq._id}
                          className="rounded-2xl border border-border px-4"
                        >
                          <AccordionTrigger className="text-left text-base font-semibold hover:no-underline">
                            {faq.question[lang]}
                          </AccordionTrigger>
                          <AccordionContent className="pb-4 text-sm text-muted-foreground">
                            {faq.answer[lang]}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="neo-card-light rounded-[28px] border border-border bg-white p-6 shadow-[0_25px_80px_rgba(7,17,52,0.08)]">
            <h2 className="text-xl font-semibold mb-4">
              {lang === 'ms' ? 'Masih Ada Soalan?' : 'Still Have Questions?'}
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              {lang === 'ms'
                ? 'Pasukan kami bersedia membantu anda melalui WhatsApp atau borang hubungan.'
                : 'Our team is ready to help via WhatsApp or the contact form.'}
            </p>
            <div className="flex flex-col gap-3">
              <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="https://wa.me/60123456789" target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-primary/50 bg-white text-primary hover:bg-primary/5 hover:border-primary">
                <Link href={`/${locale}/contact`}>
                  {lang === 'ms' ? 'Hubungi Kami' : 'Contact Us'}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
