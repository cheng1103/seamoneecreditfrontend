'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BreadcrumbSchema } from '@/components/seo/StructuredData';

export default function CalculatorPage() {
  const params = useParams();
  const locale = params.locale as string;
  const lang = locale === 'ms' ? 'ms' : 'en';

  const [loanType, setLoanType] = useState('personal');
  const [loanAmount, setLoanAmount] = useState(50000);
  const [interestRate, setInterestRate] = useState(4.88);
  const [tenure, setTenure] = useState(60);

  const loanTypes = [
    { value: 'personal', en: 'Personal Loan', ms: 'Pinjaman Peribadi', maxAmount: 200000, minRate: 4.88 },
    { value: 'business', en: 'Business Loan', ms: 'Pinjaman Perniagaan', maxAmount: 500000, minRate: 6 },
    { value: 'car', en: 'Car Loan', ms: 'Pinjaman Kereta', maxAmount: 300000, minRate: 3.5 },
    { value: 'education', en: 'Education Loan', ms: 'Pinjaman Pendidikan', maxAmount: 150000, minRate: 5 },
  ];

  const selectedLoan = loanTypes.find((l) => l.value === loanType) || loanTypes[0];

  const calculateMonthlyPayment = () => {
    const principal = loanAmount;
    const monthlyRate = interestRate / 100 / 12;
    const months = tenure;

    if (monthlyRate === 0) {
      return principal / months;
    }

    const payment =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);

    return payment;
  };

  const monthlyPayment = calculateMonthlyPayment();
  const totalPayment = monthlyPayment * tenure;
  const totalInterest = totalPayment - loanAmount;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ms-MY', {
      style: 'currency',
      currency: 'MYR',
      minimumFractionDigits: 2,
    }).format(value);
  };
  const breadcrumbItems = [
    { name: lang === 'ms' ? 'Utama' : 'Home', url: `/${locale}` },
    { name: lang === 'ms' ? 'Kalkulator' : 'Calculator', url: `/${locale}/calculator` },
  ];

  return (
    <div className="min-h-screen">
      <BreadcrumbSchema items={breadcrumbItems} />
      {/* Hero Section */}
      <section className="relative overflow-hidden hero-surface py-16 md:py-20 text-white">
        <div className="hero-circuit opacity-60" aria-hidden="true" />
        <div className="hero-wave hero-wave--top" aria-hidden="true" />
        <div className="hero-wave" aria-hidden="true" />
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-sky-200 mb-2">
              {lang === 'ms' ? 'Alat Perancangan' : 'Planning Tool'}
            </p>
            <h1 className="text-3xl md:text-4xl font-semibold mb-4">
              {lang === 'ms' ? 'Kalkulator Pinjaman' : 'Loan Calculator'}
            </h1>
            <p className="text-lg text-white/85">
              {lang === 'ms'
                ? 'Rancang pinjaman anda dengan kalkulator interaktif kami. Ketahui anggaran bayaran bulanan anda.'
                : 'Plan your loan with our interactive calculator. Know your estimated monthly payment.'}
            </p>
          </div>
        </div>
      </section>

      <div className="container -mt-10 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Calculator */}
          <div className="lg:col-span-2">
            <div className="wave-card border rounded-3xl p-6">
              <h2 className="text-xl font-bold mb-6">
                {lang === 'ms' ? 'Kira Pinjaman Anda' : 'Calculate Your Loan'}
              </h2>

              <div className="space-y-8">
                {/* Loan Type */}
                <div className="space-y-3">
                  <Label>{lang === 'ms' ? 'Jenis Pinjaman' : 'Loan Type'}</Label>
                  <Select value={loanType} onValueChange={setLoanType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {loanTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type[lang]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Loan Amount */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label>{lang === 'ms' ? 'Jumlah Pinjaman' : 'Loan Amount'}</Label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">RM</span>
                      <Input
                        type="number"
                        value={loanAmount}
                        onChange={(e) => setLoanAmount(Number(e.target.value))}
                        className="w-32 text-right"
                        min={5000}
                        max={selectedLoan.maxAmount}
                      />
                    </div>
                  </div>
                  <Slider
                    value={[loanAmount]}
                    onValueChange={(value) => setLoanAmount(value[0])}
                    min={5000}
                    max={selectedLoan.maxAmount}
                    step={1000}
                    className="py-4"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>RM 5,000</span>
                    <span>RM {selectedLoan.maxAmount.toLocaleString()}</span>
                  </div>
                </div>

                {/* Interest Rate */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label>{lang === 'ms' ? 'Kadar Faedah (p.a.)' : 'Interest Rate (p.a.)'}</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={interestRate}
                        onChange={(e) => setInterestRate(Number(e.target.value))}
                        className="w-24 text-right"
                        min={selectedLoan.minRate}
                        max={18}
                        step={0.01}
                      />
                      <span className="text-sm text-muted-foreground">%</span>
                    </div>
                  </div>
                  <Slider
                    value={[interestRate]}
                    onValueChange={(value) => setInterestRate(value[0])}
                    min={selectedLoan.minRate}
                    max={18}
                    step={0.01}
                    className="py-4"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{selectedLoan.minRate}%</span>
                    <span>18%</span>
                  </div>
                </div>

                {/* Tenure */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label>{lang === 'ms' ? 'Tempoh Pinjaman' : 'Loan Tenure'}</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={tenure}
                        onChange={(e) => setTenure(Number(e.target.value))}
                        className="w-24 text-right"
                        min={12}
                        max={120}
                      />
                      <span className="text-sm text-muted-foreground">
                        {lang === 'ms' ? 'bulan' : 'months'}
                      </span>
                    </div>
                  </div>
                  <Slider
                    value={[tenure]}
                    onValueChange={(value) => setTenure(value[0])}
                    min={12}
                    max={120}
                    step={6}
                    className="py-4"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>12 {lang === 'ms' ? 'bulan' : 'months'}</span>
                    <span>120 {lang === 'ms' ? 'bulan' : 'months'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="wave-card border rounded-3xl p-6 mt-6">
              <h3 className="font-semibold mb-4">
                {lang === 'ms' ? 'Ringkasan Bayaran' : 'Payment Summary'}
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-muted/50 rounded-2xl text-center border">
                  <p className="text-sm text-muted-foreground mb-1">
                    {lang === 'ms' ? 'Jumlah Pinjaman' : 'Principal Amount'}
                  </p>
                  <p className="text-xl font-bold">{formatCurrency(loanAmount)}</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-2xl text-center border">
                  <p className="text-sm text-muted-foreground mb-1">
                    {lang === 'ms' ? 'Jumlah Faedah' : 'Total Interest'}
                  </p>
                  <p className="text-xl font-bold">{formatCurrency(totalInterest)}</p>
                </div>
                <div className="p-4 bg-primary/5 rounded-2xl text-center border border-primary/10">
                  <p className="text-sm text-muted-foreground mb-1">
                    {lang === 'ms' ? 'Jumlah Bayaran' : 'Total Payment'}
                  </p>
                  <p className="text-xl font-bold text-primary">{formatCurrency(totalPayment)}</p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-muted/50 rounded-2xl border">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">
                    {lang === 'ms' ? 'Nota Penting: ' : 'Important Note: '}
                  </span>
                  {lang === 'ms'
                    ? 'Ini adalah anggaran sahaja. Kadar faedah sebenar bergantung kepada profil kredit dan kelayakan anda.'
                    : 'This is an estimate only. Actual interest rates depend on your credit profile and eligibility.'}
                </p>
              </div>
            </div>
          </div>

          {/* Result Card */}
          <div>
            <div className="wave-card border rounded-3xl overflow-hidden sticky top-24">
              <div className="bg-primary text-primary-foreground p-6 text-center">
                <h3 className="font-semibold">
                  {lang === 'ms' ? 'Anggaran Bayaran Bulanan' : 'Estimated Monthly Payment'}
                </h3>
              </div>
              <div className="p-6">
                <div className="text-center mb-6">
                  <p className="text-4xl font-bold text-primary">{formatCurrency(monthlyPayment)}</p>
                  <p className="text-sm text-muted-foreground">/ {lang === 'ms' ? 'bulan' : 'month'}</p>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {lang === 'ms' ? 'Jenis Pinjaman' : 'Loan Type'}
                    </span>
                    <span className="font-medium">{selectedLoan[lang]}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {lang === 'ms' ? 'Jumlah Pinjaman' : 'Loan Amount'}
                    </span>
                    <span className="font-medium">{formatCurrency(loanAmount)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {lang === 'ms' ? 'Kadar Faedah' : 'Interest Rate'}
                    </span>
                    <span className="font-medium">{interestRate}% p.a.</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {lang === 'ms' ? 'Tempoh' : 'Tenure'}
                    </span>
                    <span className="font-medium">
                      {tenure} {lang === 'ms' ? 'bulan' : 'months'}
                    </span>
                  </div>
                </div>

                <Button asChild className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
                  <Link href={`/${locale}/apply`}>
                    {lang === 'ms' ? 'Mohon Sekarang' : 'Apply Now'}
                  </Link>
                </Button>

                <p className="text-xs text-center text-muted-foreground mt-4">
                  {lang === 'ms' ? 'Kelulusan dalam 24 jam*' : 'Approval within 24 hours*'}
                </p>
              </div>
            </div>

            {/* Features */}
            <div className="wave-card border rounded-3xl p-6 mt-6">
              <h3 className="font-semibold mb-4">
                {lang === 'ms' ? 'Kelebihan Kami' : 'Our Advantages'}
              </h3>
              <ul className="space-y-3">
                {[
                  { en: 'Low interest rates from 4.88%', ms: 'Kadar faedah rendah dari 4.88%' },
                  { en: 'Fast approval within 24 hours', ms: 'Kelulusan pantas dalam 24 jam' },
                  { en: 'No hidden charges', ms: 'Tiada caj tersembunyi' },
                  { en: 'Flexible tenure options', ms: 'Pilihan tempoh fleksibel' },
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                    {item[lang]}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
