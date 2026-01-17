'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import LanguageSwitcher from './LanguageSwitcher';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { cn } from '@/lib/utils';

export default function Header() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { settings } = useSiteSettings();
  const siteName = settings.siteName || 'SeaMoneeCredit';
  const logoInitials = siteName.split(' ').map((word) => word.charAt(0)).join('').slice(0, 2).toUpperCase() || 'SM';
  const fallbackLogo = '/brand/logo.png';
  const customLogo = settings.logo?.light || settings.logo?.dark;
  const logoSrc = customLogo || fallbackLogo;
  const shouldShowInitials = !customLogo;

  const products = [
    { href: `/${locale}/products/personal-loan`, label: t('personalLoan') },
    { href: `/${locale}/products/business-loan`, label: t('businessLoan') },
    { href: `/${locale}/products/car-loan`, label: t('carLoan') },
    { href: `/${locale}/products/education-loan`, label: t('educationLoan') },
  ];

  const navItems = [
    { href: `/${locale}`, label: t('home') },
    { href: `/${locale}/products`, label: t('products') },
    { href: `/${locale}/about`, label: t('about') },
    { href: `/${locale}/calculator`, label: t('calculator') },
    { href: `/${locale}/payment-table`, label: t('paymentTable') },
    { href: `/${locale}/faq`, label: t('faq') },
    { href: `/${locale}/locations`, label: t('locations') },
    { href: `/${locale}/testimonials`, label: t('testimonials') },
    { href: `/${locale}/blog`, label: t('blog') },
    { href: `/${locale}/contact`, label: t('contact') },
  ];

  const isActiveLink = (href: string) => {
    if (href === `/${locale}`) {
      return pathname === href;
    }
    return pathname?.startsWith(`${href}`);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/80 shadow-[0_10px_40px_rgba(3,15,40,0.08)] backdrop-blur-xl supports-[backdrop-filter]:bg-white/70 dark:border-white/10 dark:bg-slate-950/70">
      <div className="container flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <Link href={`/${locale}`} className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white text-sm font-semibold text-primary shadow-lg shadow-blue-200/50 dark:border-slate-800 dark:bg-slate-900">
            {shouldShowInitials ? (
              logoInitials
            ) : (
              <Image
                src={logoSrc}
                alt={`${siteName} logo`}
                width={40}
                height={40}
                className="h-full w-full object-contain"
                priority
                sizes="40px"
              />
            )}
          </div>
          <div className="hidden sm:block">
            <span className="text-base font-semibold text-foreground">{siteName}</span>
            <p className="text-xs text-muted-foreground">Licensed lender • Malaysia</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 rounded-full border border-white/30 bg-white/70 px-1 py-1 shadow-[0_10px_35px_rgba(11,31,80,0.08)] backdrop-blur-xl lg:flex dark:border-white/10 dark:bg-slate-900/50">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
                isActiveLink(item.href)
                  ? 'bg-white text-primary shadow-sm shadow-blue-200/60'
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/60'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Button asChild className="hidden h-10 px-5 shadow-md shadow-blue-200/70 sm:inline-flex">
            <Link href={`/${locale}/apply`}>{t('apply')}</Link>
          </Button>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-2xl border border-slate-200 shadow-sm dark:border-slate-700">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[320px] border-l border-slate-200 bg-white/95 p-0 backdrop-blur-lg dark:border-slate-800 dark:bg-slate-950/95">
              <div className="flex items-center justify-between border-b border-slate-200 p-4 dark:border-slate-800">
                <SheetTitle className="text-left text-base font-semibold">{t('menuTitle')}</SheetTitle>
              </div>
              <nav className="flex flex-col p-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'rounded-xl px-3 py-3 text-sm font-medium transition-colors',
                      isActiveLink(item.href)
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">
                    {t('productsTitle')}
                  </p>
                  {products.map((product) => (
                    <Link
                      key={product.href}
                      href={product.href}
                      className="block rounded-lg px-2 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
                      onClick={() => setIsOpen(false)}
                    >
                      {product.label}
                    </Link>
                  ))}
                </div>
                <Button asChild className="mt-6 h-11 w-full">
                  <Link href={`/${locale}/apply`} onClick={() => setIsOpen(false)}>
                    {t('apply')}
                  </Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
