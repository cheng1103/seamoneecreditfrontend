'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { submitContactForm } from '@/lib/api';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { defaultLocations } from '@/data/locations';
import { LocationsListSchema, BreadcrumbSchema, FAQSchema } from '@/components/seo/StructuredData';
import { baseUrl } from '@/lib/site';
import { MapPin, Navigation, Clock, Star } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^(\+?60|0)[1-9]\d{7,9}$/, 'Invalid Malaysian phone number'),
  subject: z.string().min(1, 'Please select a subject'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type FormValues = z.infer<typeof formSchema>;
const contactFaqs = [
  {
    key: 'response-time',
    question: {
      en: 'How quickly can I expect a response after submitting the form?',
      ms: 'Berapa cepat saya akan menerima maklum balas selepas hantar borang?',
    },
    answer: {
      en: 'Our advisors reply within one business day. Loan applicants with urgent timelines can chat us on WhatsApp for same-day callbacks.',
      ms: 'Penasihat kami memberi maklum balas dalam satu hari bekerja. Pemohon dengan tarikh akhir segera boleh hubungi kami melalui WhatsApp untuk panggilan balik hari yang sama.',
    },
  },
  {
    key: 'documents',
    question: {
      en: 'What information should I prepare before contacting SeaMoneeCredit?',
      ms: 'Maklumat apa perlu saya sediakan sebelum hubungi SeaMoneeCredit?',
    },
    answer: {
      en: 'Keep your NRIC/passport, last three months payslips, and estimated loan amount ready so our team can share accurate product options and documentation checklists.',
      ms: 'Sediakan NRIC/pasport, slip gaji tiga bulan terkini dan anggaran jumlah pinjaman supaya pasukan kami boleh berkongsi pilihan produk serta senarai semak dokumen dengan tepat.',
    },
  },
];

export default function ContactPageClient() {
  const params = useParams();
  const locale = params.locale as string;
  const lang = locale === 'ms' ? 'ms' : 'en';

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { settings, isLoading: settingsLoading } = useSiteSettings();
  const locationEntries = settings.locations?.length ? settings.locations : defaultLocations;
  const [activeLocationSlug, setActiveLocationSlug] = useState<string | null>(null);

  const getLocalizedValue = (value?: { en?: string; ms?: string }) =>
    lang === 'ms' ? value?.ms : value?.en;

  useEffect(() => {
    if (!locationEntries.length) {
      setActiveLocationSlug(null);
      return;
    }
    setActiveLocationSlug((prev) => {
      if (prev && locationEntries.some((loc) => loc.slug === prev)) {
        return prev;
      }
      return locationEntries[0].slug;
    });
  }, [locationEntries]);

  const activeLocation = useMemo(
    () => locationEntries.find((loc) => loc.slug === activeLocationSlug) || locationEntries[0],
    [locationEntries, activeLocationSlug]
  );
  const breadcrumbItems = useMemo(
    () => [
      { name: lang === 'ms' ? 'Utama' : 'Home', url: `${baseUrl}/${locale}` },
      { name: lang === 'ms' ? 'Hubungi' : 'Contact', url: `${baseUrl}/${locale}/contact` },
    ],
    [lang, locale]
  );
  const localizedFaqs = contactFaqs.map((faq) => ({
    key: faq.key,
    question: lang === 'ms' ? faq.question.ms : faq.question.en,
    answer: lang === 'ms' ? faq.answer.ms : faq.answer.en,
  }));
  const faqSchemaItems = localizedFaqs
    .filter((faq) => faq.question && faq.answer)
    .map((faq) => ({
      question: faq.question,
      answer: faq.answer,
    }));

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    },
  });

  const subjects = [
    { value: 'general', en: 'General Inquiry', ms: 'Pertanyaan Umum' },
    { value: 'loan', en: 'Loan Inquiry', ms: 'Pertanyaan Pinjaman' },
    { value: 'application', en: 'Application Status', ms: 'Status Permohonan' },
    { value: 'complaint', en: 'Complaint', ms: 'Aduan' },
    { value: 'feedback', en: 'Feedback', ms: 'Maklum Balas' },
  ];

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const response = await submitContactForm(data);
      if (response.success) {
        setIsSuccess(true);
        form.reset();
      } else {
        setErrorMessage(response.message || 'Unable to send your message. Please try again later.');
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to send your message.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = {
    address: (locale === 'ms' ? settings.contact?.address?.ms : settings.contact?.address?.en)
      || 'Kuala Lumpur, Malaysia',
    phone: settings.contact?.phone || '+60 3-1234 5678',
    email: settings.contact?.email || 'info@seamoneecredit.com',
    whatsapp: settings.contact?.whatsapp || settings.contact?.phone || '+60 12-345 6789',
    businessHours: (locale === 'ms' ? settings.businessHours?.ms : settings.businessHours?.en)
      || (lang === 'ms'
        ? 'Isnin-Jumaat: 9:00 AM - 6:00 PM'
        : 'Monday-Friday: 9:00 AM - 6:00 PM'),
  };
  const defaultMapEmbed =
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3984.0233374090897!2d101.69236347609481!3d3.152481153251457!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cc36260c358221%3A0x8bb2745078e1bc6e!2sKuala%20Lumpur%20City%20Centre!5e0!3m2!1sen!2smy!4v1710000000000!5m2!1sen!2smy';
  const mapEmbedUrl = settings.contact?.googleMapsUrl || defaultMapEmbed;
  const activeMapEmbed = activeLocation?.mapEmbedUrl || mapEmbedUrl;
  const getDirectionsUrl = () => {
    if (activeLocation?.geo?.lat && activeLocation.geo?.lng) {
      return `https://www.google.com/maps/search/?api=1&query=${activeLocation.geo.lat},${activeLocation.geo.lng}`;
    }
    return activeLocation?.mapEmbedUrl || mapEmbedUrl;
  };
  const localizedActiveName =
    getLocalizedValue(activeLocation?.name) || activeLocation?.slug || 'location';
  const localizedActiveSummary = getLocalizedValue(activeLocation?.summary);
  const localizedActiveAddress = getLocalizedValue(activeLocation?.address);
  const localizedActiveHours = getLocalizedValue(activeLocation?.hours);
  const localizedServices =
    activeLocation?.services?.map((service) => getLocalizedValue(service)).filter(Boolean) || [];
  const localizedAreas =
    activeLocation?.areasServed?.map((area) => getLocalizedValue(area)).filter(Boolean) || [];

  return (
    <div className="min-h-screen bg-background">
      <BreadcrumbSchema items={breadcrumbItems} />
      <LocationsListSchema locale={locale} entries={locationEntries} />
      {faqSchemaItems.length > 0 && <FAQSchema faqs={faqSchemaItems} />}
      <section className="relative overflow-hidden hero-surface py-16 md:py-24 text-white">
        <div className="hero-circuit opacity-60" aria-hidden="true" />
        <div className="hero-wave hero-wave--top" aria-hidden="true" />
        <div className="hero-wave" aria-hidden="true" />
        <div className="absolute inset-0 opacity-60">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.2),_transparent_55%)]" />
        </div>
        <div className="container relative text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-sky-200">
            {lang === 'ms' ? 'Hubungi Kami' : 'Contact'}
          </p>
          <h1 className="mt-4 text-3xl font-semibold md:text-4xl">
            {lang === 'ms' ? 'Kami sedia membantu anda' : "We're here for every question"}
          </h1>
          <p className="mt-4 text-lg text-white/85">
            {lang === 'ms'
              ? 'Hubungi pasukan pakar SeaMoneeCredit dan dapatkan respons dalam masa 24 jam bekerja.'
              : 'Reach our lending specialists and receive a response within one business day.'}
          </p>
        </div>
      </section>

      <div className="container -mt-10 pb-16">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_minmax(0,0.85fr)]">
          <div className="wave-card relative overflow-hidden rounded-[28px] border border-border bg-white p-8 shadow-[0_25px_60px_rgba(5,15,45,0.08)]">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-300 via-primary to-indigo-500 opacity-70" aria-hidden="true" />
            <h2 className="text-2xl font-semibold">
              {lang === 'ms' ? 'Hantar mesej terus kepada kami' : 'Send us a direct message'}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {lang === 'ms'
                ? 'Isikan borang dan kami akan hubungi anda melalui emel atau WhatsApp.'
                : 'Fill out the form and we will reach you via email or WhatsApp.'}
            </p>

            <div className="mt-8 rounded-2xl border border-primary/15 bg-primary/5 p-4 text-sm text-primary">
              <p>
                {lang === 'ms'
                  ? 'Permohonan pinjaman? Gunakan borang ini untuk temujanji pantas atau status permohonan.'
                  : 'Loan enquiry? Use this form for quick clarifications or an application status check.'}
              </p>
            </div>

            <div className="mt-8">
              {isSuccess ? (
                <div className="rounded-2xl bg-green-50 p-8 text-center text-green-800">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-2xl">
                    ✓
                  </div>
                  <h3 className="mt-4 text-xl font-semibold">
                    {lang === 'ms' ? 'Mesej Dihantar!' : 'Message sent'}
                  </h3>
                  <p className="mt-2 text-sm text-green-700">
                    {lang === 'ms'
                      ? 'Terima kasih! Kami akan balas dalam 1-2 hari bekerja.'
                      : 'Thank you. Our team will respond within 1–2 business days.'}
                  </p>
                  <Button className="mt-5" onClick={() => setIsSuccess(false)}>
                    {lang === 'ms' ? 'Hantar mesej lain' : 'Send another message'}
                  </Button>
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {errorMessage && (
                      <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        {errorMessage}
                      </div>
                    )}
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{lang === 'ms' ? 'Nama penuh' : 'Full name'}</FormLabel>
                            <FormControl>
                              <Input placeholder={lang === 'ms' ? 'Masukkan nama anda' : 'Enter your name'} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{lang === 'ms' ? 'Alamat emel' : 'Email address'}</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="you@email.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{lang === 'ms' ? 'Nombor telefon' : 'Phone number'}</FormLabel>
                            <FormControl>
                              <Input placeholder="+60 12-345 6789" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{lang === 'ms' ? 'Subjek' : 'Subject'}</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={lang === 'ms' ? 'Pilih subjek' : 'Choose a subject'} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {subjects.map((subject) => (
                                  <SelectItem key={subject.value} value={subject.value}>
                                    {subject[lang]}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{lang === 'ms' ? 'Mesej' : 'Message'}</FormLabel>
                          <FormControl>
                            <Textarea
                              rows={5}
                              placeholder={lang === 'ms' ? 'Tulis mesej anda di sini...' : 'Write your message here...'}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={isSubmitting} className="w-full rounded-2xl py-6 text-base bg-primary text-primary-foreground hover:bg-primary/90">
                      {isSubmitting
                        ? lang === 'ms'
                          ? 'Menghantar...'
                          : 'Sending...'
                        : lang === 'ms'
                          ? 'Hantar mesej'
                          : 'Send message'}
                    </Button>
                  </form>
                </Form>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="neo-card-light relative overflow-hidden rounded-[28px] border border-primary/15 bg-gradient-to-br from-primary/15 to-blue-100/40 p-6 text-primary shadow-lg">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-300 via-green-400 to-emerald-500 opacity-70" aria-hidden="true" />
              <p className="text-xs uppercase tracking-[0.4em]">WhatsApp</p>
              <h3 className="mt-2 text-2xl font-semibold">{lang === 'ms' ? 'Balasan segera' : 'Instant replies'}</h3>
              <p className="mt-2 text-sm text-primary/80">
                {lang === 'ms' ? 'Chat secara langsung dengan pegawai kami' : 'Chat directly with our officer'}
              </p>
              <Button
                asChild
                className="mt-4 w-full rounded-2xl bg-green-500 py-5 text-base hover:bg-green-600"
              >
                <a
                  href={`https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {lang === 'ms' ? 'Chat sekarang' : 'Chat now'}
                </a>
              </Button>
            </div>

            <div className="wave-card relative overflow-hidden rounded-[28px] border border-border bg-white p-6 shadow">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-300 via-primary to-indigo-500 opacity-70" aria-hidden="true" />
              <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                {lang === 'ms' ? 'Maklumat Hubungan' : 'Contact Details'}
              </h3>
              <div className="mt-6 space-y-5 text-sm">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
                    {lang === 'ms' ? 'Alamat' : 'Address'}
                  </p>
                  <p className="mt-1 text-foreground">
                    {settingsLoading ? 'Loading...' : contactInfo.address}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
                    {lang === 'ms' ? 'Telefon' : 'Phone'}
                  </p>
                  <a href={`tel:${contactInfo.phone}`} className="mt-1 inline-flex items-center gap-2 font-semibold text-primary">
                    {settingsLoading ? 'Loading...' : contactInfo.phone}
                  </a>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
                    {lang === 'ms' ? 'Emel' : 'Email'}
                  </p>
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="mt-1 inline-flex items-center gap-2 font-semibold text-primary"
                  >
                    {settingsLoading ? 'Loading...' : contactInfo.email}
                  </a>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
                    {lang === 'ms' ? 'Waktu Operasi' : 'Business hours'}
                  </p>
                  <p className="mt-1 text-foreground">
                    {settingsLoading ? 'Loading...' : contactInfo.businessHours}
                  </p>
                </div>
              </div>
            </div>

            <div className="wave-card relative overflow-hidden rounded-[28px] border border-border bg-white p-6 shadow">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-300 via-primary to-indigo-500 opacity-70" aria-hidden="true" />
              <h3 className="text-base font-semibold">
                {lang === 'ms' ? 'Temu janji pejabat' : 'Visit our office'}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {lang === 'ms'
                  ? 'Hubungi kami untuk menjadualkan sesi bersemuka dengan pegawai pinjaman.'
                  : 'Schedule an in-person session with our loan officer for complex cases.'}
              </p>
              <Button asChild variant="outline" className="mt-4 w-full rounded-2xl border-primary/50 bg-white text-primary hover:bg-primary/5 hover:border-primary">
                <Link href={`/${locale}/apply`}>
                  {lang === 'ms' ? 'Tempah slot' : 'Book a slot'}
                </Link>
              </Button>
            </div>

            <div className="wave-card relative overflow-hidden rounded-[28px] border border-border bg-white p-6 shadow">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-300 via-primary to-indigo-500 opacity-70" aria-hidden="true" />
              <h3 className="text-base font-semibold mb-3">
                {lang === 'ms' ? 'Lokasi Kami' : 'Find Us'}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {lang === 'ms'
                  ? 'Jejak pejabat SeaMoneeCredit dengan panduan peta interaktif.'
                  : 'Locate the SeaMoneeCredit office with our interactive map.'}
              </p>
              <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl border">
                <iframe
                  src={mapEmbedUrl}
                  className="h-full w-full"
                  title="SeaMoneeCredit office map"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

          </div>
        </div>
      </div>
      {locationEntries.length > 0 && (
        <section className="border-t border-border/70 bg-slate-50 py-16">
          <div className="container">
            <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary">
                  {lang === 'ms' ? 'Jangkauan Tempatan' : 'Local Coverage'}
                </p>
                <h2 className="mt-2 text-3xl font-semibold text-slate-900">
                  {lang === 'ms' ? 'Cawangan SeaMoneeCredit' : 'SeaMoneeCredit branches'}
                </h2>
                <p className="mt-2 max-w-2xl text-sm text-slate-600">
                  {lang === 'ms'
                    ? 'Pilih bandar untuk melihat alamat khusus, waktu operasi, kawasan perkhidmatan dan arah Google Maps.'
                    : 'Select a city to view its dedicated address, opening hours, coverage areas, and Google Maps directions.'}
                </p>
              </div>
              <Button asChild variant="outline" className="rounded-full border-primary/40 text-primary hover:bg-primary/5">
                <Link href={`/${locale}/locations`}>
                  {lang === 'ms' ? 'Lihat halaman lokasi' : 'Browse location pages'}
                </Link>
              </Button>
            </div>
            <div className="mt-10 grid gap-8 lg:grid-cols-[0.9fr_minmax(0,1.1fr)]">
              <div className="space-y-4">
                {locationEntries.map((loc) => {
                  const localizedName = getLocalizedValue(loc.name) || loc.slug;
                  const localizedCitySummary = getLocalizedValue(loc.summary);
                  const isActive = loc.slug === activeLocation?.slug;
                  return (
                    <button
                      key={loc.slug}
                      type="button"
                      onClick={() => setActiveLocationSlug(loc.slug)}
                      className={`w-full rounded-2xl border p-4 text-left transition hover:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 ${
                        isActive ? 'border-primary bg-white shadow-md' : 'border-border bg-white/80'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{localizedName}</p>
                          {localizedCitySummary && (
                            <p className="text-xs text-slate-500">{localizedCitySummary}</p>
                          )}
                        </div>
                        {loc.ratingSummary?.score && (
                          <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                            <Star className="mr-1 h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                            {loc.ratingSummary.score.toFixed(1)}
                          </span>
                        )}
                      </div>
                      <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-600">
                        {loc.phone && (
                          <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700">
                            {loc.phone}
                          </span>
                        )}
                        {loc.hours && getLocalizedValue(loc.hours) && (
                          <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700">
                            <Clock className="mr-1.5 h-3.5 w-3.5 text-slate-500" />
                            {getLocalizedValue(loc.hours)}
                          </span>
                        )}
                        {loc.areasServed?.[0] && getLocalizedValue(loc.areasServed[0]) && (
                          <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700">
                            <MapPin className="mr-1.5 h-3.5 w-3.5 text-slate-500" />
                            {getLocalizedValue(loc.areasServed[0])}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="rounded-[28px] border border-slate-200 bg-white shadow-xl">
                <div className="h-[380px] w-full overflow-hidden rounded-t-[28px] border-b">
                  <iframe
                    src={activeMapEmbed}
                    className="h-full w-full"
                    title={`${localizedActiveName} map`}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
                <div className="space-y-5 p-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-primary/70">
                      {lang === 'ms' ? 'Lokasi aktif' : 'Active location'}
                    </p>
                    <h3 className="mt-2 text-2xl font-semibold text-slate-900">{localizedActiveName}</h3>
                    {localizedActiveSummary && (
                      <p className="mt-1 text-sm text-slate-600">{localizedActiveSummary}</p>
                    )}
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-1 text-sm text-slate-700">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                        {lang === 'ms' ? 'Alamat' : 'Address'}
                      </p>
                      <p>{localizedActiveAddress}</p>
                      {activeLocation?.geo?.lat && activeLocation?.geo?.lng && (
                        <p className="text-xs text-slate-500">
                          {lang === 'ms' ? 'Koordinat' : 'Coordinates'}:{' '}
                          {activeLocation.geo.lat.toFixed(4)}, {activeLocation.geo.lng.toFixed(4)}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1 text-sm text-slate-700">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                        {lang === 'ms' ? 'Hubungi' : 'Contact'}
                      </p>
                      {activeLocation?.phone && (
                        <a
                          href={`tel:${activeLocation.phone}`}
                          className="block font-semibold text-primary"
                        >
                          {activeLocation.phone}
                        </a>
                      )}
                      {activeLocation?.email && (
                        <a
                          href={`mailto:${activeLocation.email}`}
                          className="block font-semibold text-primary"
                        >
                          {activeLocation.email}
                        </a>
                      )}
                      {localizedActiveHours && (
                        <p className="text-xs text-slate-500">
                          <Clock className="mr-1 inline h-3.5 w-3.5" />
                          {localizedActiveHours}
                        </p>
                      )}
                    </div>
                  </div>
                  {localizedServices.length > 0 && (
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                        {lang === 'ms' ? 'Fokus Perkhidmatan' : 'Service focus'}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {localizedServices.slice(0, 4).map((service, idx) => (
                          <span
                            key={`${service}-${idx}`}
                            className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
                          >
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {localizedAreas.length > 0 && (
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                        {lang === 'ms' ? 'Kawasan liputan' : 'Areas served'}
                      </p>
                      <div className="mt-2 grid gap-2 sm:grid-cols-2">
                        {localizedAreas.slice(0, 6).map((area, idx) => (
                          <div key={`${area}-${idx}`} className="flex items-center text-sm text-slate-600">
                            <MapPin className="mr-2 h-4 w-4 text-primary" />
                            {area}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-3">
                    <Button asChild className="flex-1 rounded-full">
                      <Link href={`/${locale}/locations/${activeLocation?.slug ?? ''}`}>
                        {lang === 'ms' ? 'Lihat halaman lokasi' : 'View location page'}
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="secondary"
                      className="flex-1 rounded-full border-primary/40 text-primary hover:bg-primary/5"
                    >
                      <a href={getDirectionsUrl()} target="_blank" rel="noopener noreferrer">
                        <Navigation className="mr-2 h-4 w-4" />
                        {lang === 'ms' ? 'Arah Google Maps' : 'Open Google Maps'}
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      {faqSchemaItems.length > 0 && (
        <section className="border-t border-border/70 bg-white py-16">
          <div className="container">
            <div className="rounded-[32px] border border-border bg-white p-8 shadow-sm">
              <div className="text-center">
                <p className="text-xs uppercase tracking-[0.35em] text-primary/70">
                  {lang === 'ms' ? 'Soalan lazim' : 'Contact FAQs'}
                </p>
                <h2 className="mt-3 text-3xl font-semibold text-foreground">
                  {lang === 'ms' ? 'Jawapan pantas sebelum anda hubungi kami' : 'Need answers before reaching out?'}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {lang === 'ms'
                    ? 'Temui respons kepada soalan paling popular tentang masa tindak balas dan dokumen yang diperlukan.'
                    : 'Find answers to common questions about response times and the documents we need.'}
                </p>
              </div>
              <Accordion type="single" collapsible className="mt-8 divide-y rounded-2xl border border-border/60">
                {localizedFaqs.map((faq) => (
                  <AccordionItem key={faq.key} value={faq.key}>
                    <AccordionTrigger className="px-6 py-4 text-left text-base font-semibold">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4 text-sm text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
