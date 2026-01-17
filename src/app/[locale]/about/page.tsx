'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AboutPage() {
  const params = useParams();
  const locale = params.locale as string;
  const lang = locale === 'ms' ? 'ms' : 'en';

  const values = [
    {
      title: { en: 'Trust & Transparency', ms: 'Kepercayaan & Ketelusan' },
      description: {
        en: 'We believe in honest, transparent dealings with all our customers.',
        ms: 'Kami percaya pada urusan yang jujur dan telus dengan semua pelanggan kami.',
      },
    },
    {
      title: { en: 'Customer First', ms: 'Pelanggan Diutamakan' },
      description: {
        en: 'Your financial success is our priority. We tailor solutions to your needs.',
        ms: 'Kejayaan kewangan anda adalah keutamaan kami.',
      },
    },
    {
      title: { en: 'Innovation', ms: 'Inovasi' },
      description: {
        en: 'We continuously improve our services to serve you better.',
        ms: 'Kami sentiasa menambah baik perkhidmatan untuk melayani anda.',
      },
    },
    {
      title: { en: 'Excellence', ms: 'Kecemerlangan' },
      description: {
        en: 'We strive for excellence in everything we do.',
        ms: 'Kami berusaha untuk kecemerlangan dalam semua yang kami lakukan.',
      },
    },
  ];

  const stats = [
    { value: '10+', label: { en: 'Years Experience', ms: 'Tahun Pengalaman' } },
    { value: '50,000+', label: { en: 'Happy Customers', ms: 'Pelanggan Berpuas Hati' } },
    { value: 'RM500M+', label: { en: 'Loans Disbursed', ms: 'Pinjaman Dikeluarkan' } },
    { value: '24hrs', label: { en: 'Fast Approval', ms: 'Kelulusan Pantas' } },
  ];

  const milestones = [
    {
      year: '2014',
      title: { en: 'Company Founded', ms: 'Syarikat Ditubuhkan' },
      description: {
        en: 'SeaMoneeCredit was established with a vision to provide accessible financial solutions.',
        ms: 'SeaMoneeCredit ditubuhkan dengan visi untuk menyediakan penyelesaian kewangan yang mudah diakses.',
      },
    },
    {
      year: '2016',
      title: { en: 'First Branch Expansion', ms: 'Pengembangan Cawangan Pertama' },
      description: {
        en: 'Opened our first branch in Penang to serve more Malaysians.',
        ms: 'Membuka cawangan pertama di Pulau Pinang.',
      },
    },
    {
      year: '2019',
      title: { en: 'Digital Transformation', ms: 'Transformasi Digital' },
      description: {
        en: 'Launched our online platform for easier loan applications.',
        ms: 'Melancarkan platform dalam talian untuk permohonan pinjaman yang lebih mudah.',
      },
    },
    {
      year: '2022',
      title: { en: '50,000 Customers', ms: '50,000 Pelanggan' },
      description: {
        en: 'Reached 50,000 satisfied customers across Malaysia.',
        ms: 'Mencapai 50,000 pelanggan yang berpuas hati di seluruh Malaysia.',
      },
    },
    {
      year: '2024',
      title: { en: 'New Products Launch', ms: 'Pelancaran Produk Baru' },
      description: {
        en: 'Introduced new loan products to meet diverse financial needs.',
        ms: 'Memperkenalkan produk pinjaman baru untuk memenuhi keperluan kewangan yang pelbagai.',
      },
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden hero-surface py-16 md:py-24">
        <div className="hero-circuit opacity-60" aria-hidden="true" />
        <div className="hero-wave hero-wave--top" aria-hidden="true" />
        <div className="hero-wave" aria-hidden="true" />
        <div className="absolute inset-0">
          <div className="absolute -left-10 top-10 h-32 w-32 rounded-full bg-sky-400/30 blur-3xl" />
          <div className="absolute bottom-10 right-0 h-32 w-32 rounded-full bg-white/20 blur-3xl" />
        </div>
        <div className="container relative grid gap-8 text-white lg:grid-cols-[1.1fr_minmax(0,0.9fr)] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-sky-300">
              {lang === 'ms' ? 'Tentang Kami' : 'About Us'}
            </p>
            <h1 className="mt-4 text-3xl font-semibold md:text-4xl">
              {lang === 'ms'
                ? 'Rakan kewangan moden dengan sentuhan manusia'
                : 'Modern lending with a human heartbeat'}
            </h1>
            <p className="mt-4 text-base text-slate-100/90">
              {lang === 'ms'
                ? 'Selama lebih sedekad kami membantu rakyat Malaysia mencapai matlamat kewangan dengan pelan pembayaran telus dan kelulusan pantas.'
                : 'For over a decade we have helped Malaysians unlock financial goals through transparent repayment plans and lightning-fast approvals.'}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild className="h-11 rounded-2xl px-8 text-base bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-blue-900/40">
                <Link href={`/${locale}/apply`}>
                  {lang === 'ms' ? 'Mohon Sekarang' : 'Apply Now'}
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-11 rounded-2xl border-white/50 px-8 text-base bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white"
              >
                <Link href={`/${locale}/contact`}>
                  {lang === 'ms' ? 'Berbual dengan Kami' : 'Talk to Us'}
                </Link>
              </Button>
            </div>
          </div>
          <div className="glass-card border-glow rounded-[30px] p-8 text-foreground">
            <p className="text-sm font-semibold text-muted-foreground">
              {lang === 'ms' ? 'Mengapa pelanggan mempercayai kami' : 'Why borrowers trust us'}
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {stats.map((stat) => (
                <div
                  key={stat.value}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur"
                >
                  <p className="text-2xl font-semibold text-white">{stat.value}</p>
                  <p className="text-xs uppercase tracking-[0.3em] text-white/60">{stat.label[lang]}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 rounded-2xl bg-muted/60 p-4 text-sm text-muted-foreground">
              {lang === 'ms'
                ? 'Pasukan kami terdiri daripada pakar pinjaman berlesen dengan pengalaman mengurus portfolio peribadi dan perniagaan sejak 2014.'
                : 'Our licensed credit specialists have guided personal and business borrowers since 2014, keeping compliance and compassion in balance.'}
            </p>
          </div>
        </div>
      </section>

      <section className="-mt-10 pb-4">
        <div className="container">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.value}
                className="wave-card rounded-2xl p-5 text-center shadow-[0_10px_40px_rgba(15,41,91,0.06)]"
              >
                <p className="text-2xl font-semibold text-primary">{stat.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label[lang]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container grid gap-8 md:grid-cols-2">
          <div className="wave-card rounded-[28px] p-8 shadow-lg">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/70">
              {lang === 'ms' ? 'Misi' : 'Mission'}
            </p>
            <h2 className="mt-3 text-2xl font-semibold">
              {lang === 'ms' ? 'Pinjaman pintar untuk semua rakyat Malaysia' : 'Smart financing for every Malaysian'}
            </h2>
            <p className="mt-4 text-muted-foreground">
              {lang === 'ms'
                ? 'Menyediakan penyelesaian kewangan yang cepat, telus dan diperibadikan tanpa kos tersembunyi supaya anda boleh fokus pada perniagaan, keluarga dan impian anda.'
                : 'Deliver easy, transparent and personalised financing without hidden costs, so you can stay focused on your business, family and future goals.'}
            </p>
          </div>
          <div className="wave-card rounded-[28px] p-8 shadow-lg">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/70">
              {lang === 'ms' ? 'Visi' : 'Vision'}
            </p>
            <h2 className="mt-3 text-2xl font-semibold">
              {lang === 'ms' ? 'Menjadi pilihan utama' : 'Become the lender of choice'}
            </h2>
            <p className="mt-4 text-muted-foreground">
              {lang === 'ms'
                ? 'Kami mahu dikenali sebagai pemberi pinjaman yang paling dipercayai di Malaysia melalui perkhidmatan yang teliti dan teknologi moden.'
                : 'Known as the most trusted money lender in Malaysia through meticulous service, human specialists and modern technology.'}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-muted/50 py-16">
        <div className="container">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary">
              {lang === 'ms' ? 'Nilai Teras' : 'Core Values'}
            </p>
            <h2 className="mt-3 text-3xl font-semibold">
              {lang === 'ms' ? 'Cara kami beroperasi setiap hari' : 'How we show up every day'}
            </h2>
            <p className="mt-3 text-muted-foreground">
              {lang === 'ms'
                ? 'Nilai-nilai ini memastikan pengalaman pinjaman yang selamat dan telus.'
                : 'These values ensure every engagement stays transparent, compliant and human.'}
            </p>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-4">
            {values.map((value) => (
              <div
                key={value.title.en}
                className="neo-card-light rounded-3xl border border-border p-6 shadow-[0_15px_35px_rgba(15,41,91,0.08)]"
              >
                <h3 className="text-lg font-semibold text-foreground">{value.title[lang]}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{value.description[lang]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary">
              {lang === 'ms' ? 'Perjalanan Kami' : 'Our Journey'}
            </p>
            <h2 className="mt-3 text-3xl font-semibold">
              {lang === 'ms' ? 'Langkah yang membentuk kami' : 'Key milestones that shaped us'}
            </h2>
          </div>
          <div className="relative mx-auto mt-12 max-w-3xl">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-primary/10 via-primary to-primary/10" />
            <div className="space-y-10">
              {milestones.map((milestone) => (
                <div key={milestone.year} className="relative grid gap-3 rounded-2xl border border-border bg-white p-6 pl-10 shadow-md">
                  <span className="absolute left-2.5 top-6 h-4 w-4 rounded-full border-2 border-white bg-primary shadow" />
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/70">{milestone.year}</p>
                  <h3 className="text-lg font-semibold">{milestone.title[lang]}</h3>
                  <p className="text-sm text-muted-foreground">{milestone.description[lang]}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-16">
        <div className="absolute inset-0" style={{ backgroundImage: 'var(--gradient-cta)' }} aria-hidden="true" />
        <div className="hero-circuit opacity-30" aria-hidden="true" />
        <div className="hero-wave hero-wave--top" aria-hidden="true" />
        <div className="hero-wave" aria-hidden="true" />
        <div className="container relative text-center text-white">
          <h2 className="text-3xl font-semibold">
            {lang === 'ms' ? 'Sedia untuk bergerak?' : 'Ready to move forward?'}
          </h2>
          <p className="mt-4 text-lg text-white/90">
            {lang === 'ms'
              ? 'Mohon pinjaman anda hari ini dan dapatkan tawaran diperibadikan dalam 24 jam.'
              : 'Apply today and receive a personalised proposal within 24 hours.'}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="px-8 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-blue-900/40">
              <Link href={`/${locale}/apply`}>
                {lang === 'ms' ? 'Mohon Sekarang' : 'Apply Now'}
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/40 px-8 text-white hover:bg-white/10"
            >
              <Link href={`/${locale}/calculator`}>
                {lang === 'ms' ? 'Kira Pinjaman' : 'Calculate Loan'}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
