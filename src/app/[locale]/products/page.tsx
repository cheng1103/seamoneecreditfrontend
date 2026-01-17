import { Star } from 'lucide-react';
import { BreadcrumbSchema, ProductSchema } from '@/components/seo/StructuredData';
import { getProductsServer, type ProductResponse } from '@/lib/server/products';
import { ProductCardActions } from '@/components/products/ProductCardActions';

type Props = {
  params: Promise<{ locale: string }>;
};

const formatAmount = (loanAmount?: { min?: number; max?: number }) => {
  if (!loanAmount) return '—';
  const { min, max } = loanAmount;
  if (min && max && min !== max) {
    return `RM ${min.toLocaleString()} - RM ${max.toLocaleString()}`;
  }
  if (max) {
    return `RM ${max.toLocaleString()}`;
  }
  if (min) {
    return `RM ${min.toLocaleString()}`;
  }
  return '—';
};

const formatInterest = (interestRate?: { min?: number; max?: number }) => {
  if (!interestRate) return '—';
  const { min, max } = interestRate;
  if (min && max && min !== max) {
    return `${min}% - ${max}%`;
  }
  if (min) return `${min}%`;
  if (max) return `${max}%`;
  return '—';
};

const formatTenure = (locale: string, tenure?: { min?: number; max?: number }) => {
  if (!tenure) return '—';
  const { min, max } = tenure;
  const label = locale === 'ms' ? 'bulan' : 'months';
  if (min && max && min !== max) {
    return `${min}-${max} ${label}`;
  }
  if (max) return `${max} ${label}`;
  if (min) return `${min} ${label}`;
  return '—';
};

export default async function ProductsPage({ params }: Props) {
  const { locale } = await params;
  const lang = locale === 'ms' ? 'ms' : 'en';
  const products = await getProductsServer();
  const breadcrumbItems = [
    { name: lang === 'ms' ? 'Utama' : 'Home', url: `/${locale}` },
    { name: lang === 'ms' ? 'Produk' : 'Products', url: `/${locale}/products` },
  ];
  const schemaProducts = products.slice(0, 4);

  return (
    <div className="min-h-screen">
      <BreadcrumbSchema items={breadcrumbItems} />
      {schemaProducts.map((product) => (
        <ProductSchema key={product.slug} product={product} locale={locale} />
      ))}
      <section className="relative overflow-hidden hero-surface py-16 md:py-24 text-white">
        <div className="hero-circuit opacity-50" aria-hidden="true" />
        <div className="hero-wave hero-wave--top" aria-hidden="true" />
        <div className="hero-wave" aria-hidden="true" />
        <div className="container relative z-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-sky-200">
            {lang === 'ms' ? 'Produk Pinjaman' : 'Loan Products'}
          </p>
          <h1 className="mt-4 text-3xl font-semibold md:text-4xl">
            {lang === 'ms'
              ? 'Penyelesaian kewangan untuk semua keperluan'
              : 'Lending solutions for every milestone'}
          </h1>
          <p className="mt-4 text-lg text-white/85">
            {lang === 'ms'
              ? 'Pilih pinjaman yang memenuhi keperluan anda dengan kadar telus serendah 4.88% setahun.'
              : 'Pick the facility that fits your ambition with transparent rates from 4.88% p.a.'}
          </p>
        </div>
      </section>

      <div className="container -mt-16 pb-16">
        <div className="wave-grid rounded-[32px] border border-white/70 bg-white/95 p-6 shadow-[0_30px_80px_rgba(8,18,51,0.1)] md:p-10">
          {products.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground">
              {lang === 'ms' ? 'Tiada produk tersedia.' : 'No products available.'}
            </p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} locale={locale} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product, locale }: { product: ProductResponse; locale: string }) {
  const lang = locale === 'ms' ? 'ms' : 'en';
  const ratingSummary = product.ratingSummary;
  return (
    <div className="group wave-card relative flex h-full flex-col overflow-hidden border border-white/70 p-6 shadow-[0_25px_65px_rgba(8,18,51,0.08)]">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-300 via-primary to-indigo-500 opacity-70" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-10 -bottom-10 h-24 w-24 rounded-full bg-primary/10 blur-2xl opacity-0 transition group-hover:opacity-100" />
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-primary/70">
            {lang === 'ms' ? 'Pakej Pinjaman' : 'Loan Package'}
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-foreground">
            {product.name?.[lang] || product.name?.en}
          </h2>
        </div>
        <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
          {formatInterest(product.interestRate)}
        </span>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">
        {product.description?.[lang] || product.description?.en}
      </p>
      <ul className="mt-4 space-y-2 text-sm">
        {(product.features || []).map((feature, index) => (
          <li key={index} className="flex items-center gap-2 text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            {feature?.[lang] || feature?.en}
          </li>
        ))}
      </ul>
      <div className="mt-6 grid grid-cols-3 gap-4 rounded-2xl border border-dashed border-primary/20 bg-primary/5 px-4 py-3 text-center text-slate-900">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            {lang === 'ms' ? 'Jumlah' : 'Amount'}
          </p>
          <p className="mt-1 text-base font-semibold">{formatAmount(product.loanAmount)}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            {lang === 'ms' ? 'Faedah' : 'Interest'}
          </p>
          <p className="mt-1 text-base font-semibold">{formatInterest(product.interestRate)}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            {lang === 'ms' ? 'Tempoh' : 'Tenure'}
          </p>
          <p className="mt-1 text-base font-semibold">{formatTenure(locale, product.tenure)}</p>
        </div>
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <ProductCardActions
          locale={locale}
          slug={product.slug}
          learnLabel={lang === 'ms' ? 'Maklumat Lanjut' : 'Learn More'}
          applyLabel={lang === 'ms' ? 'Mohon' : 'Apply'}
        />
      </div>
      {ratingSummary?.score ? (
        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
          <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
          <span>{ratingSummary.score.toFixed(1)} / 5</span>
          <span className="text-amber-600">
            ({ratingSummary.count}+ {lang === 'ms' ? 'ulasan' : 'reviews'})
          </span>
        </div>
      ) : null}
    </div>
  );
}
