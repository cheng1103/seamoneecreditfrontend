'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Controller, FieldPath, useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Loader2, ShieldCheck, Sparkles, CircleDollarSign, PhoneCall, ArrowRight, CheckCircle2 } from 'lucide-react';
import { BreadcrumbSchema, HowToSchema } from '@/components/seo/StructuredData';
import { submitApplication } from '@/lib/api';
import { baseUrl } from '@/lib/site';

const loanTypes = [
  { value: 'personal-loan', min: 5000, max: 200000 },
  { value: 'business-loan', min: 10000, max: 500000 },
  { value: 'car-loan', min: 20000, max: 300000 },
  { value: 'home-loan', min: 50000, max: 800000 },
  { value: 'education-loan', min: 5000, max: 150000 },
];

const loanAmountRanges = [
  { max: 10000, label: 'RM 5,000 - RM 10,000', value: '5000-10000' },
  { max: 30000, label: 'RM 10,000 - RM 30,000', value: '10000-30000' },
  { max: 50000, label: 'RM 30,000 - RM 50,000', value: '30000-50000' },
  { max: 100000, label: 'RM 50,000 - RM 100,000', value: '50000-100000' },
  { max: Infinity, label: 'RM 100,000+', value: '100000+' },
];

const employmentOptions = [
  'employed',
  'self-employed',
  'government',
  'unemployed',
  'retired',
];

const malaysiaStates = [
  'Johor',
  'Kedah',
  'Kelantan',
  'Melaka',
  'Negeri Sembilan',
  'Pahang',
  'Penang',
  'Perak',
  'Perlis',
  'Sabah',
  'Sarawak',
  'Selangor',
  'Terengganu',
  'Kuala Lumpur',
  'Labuan',
  'Putrajaya',
];

const loanPurposes = [
  'home-renovation',
  'debt-consolidation',
  'business-expansion',
  'education',
  'medical',
  'vehicle',
  'other',
];

const stepOrder = ['loan', 'personal', 'contact', 'employment', 'review'] as const;
type StepId = typeof stepOrder[number];

type FormData = {
  loanType: string;
  loanAmount: number;
  loanTerm: number;
  loanPurpose: string;
  loanAmountRange: string;
  fullName: string;
  icNumber: string;
  dateOfBirth: string;
  gender: string;
  maritalStatus: string;
  nationality: string;
  phone: string;
  email: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postcode: string;
  };
  employmentStatus: string;
  companyName?: string;
  position?: string;
  monthlyIncome: number;
  yearsEmployed: number;
  employerPhone?: string;
  termsAccepted: boolean;
  privacyAccepted: boolean;
  ctosConsent: boolean;
  marketingConsent: boolean;
};

const addressSchema = z.object({
  line1: z.string().min(3, 'Please provide your address'),
  line2: z.string().optional(),
  city: z.string().min(2, 'Enter a valid city'),
  state: z.string().min(2, 'Select your state'),
  postcode: z.string().min(4, 'Enter a valid postcode'),
});

const formSchema: z.ZodType<FormData> = z.object({
  loanType: z.string().min(1, 'Select a loan type'),
  loanAmount: z.coerce.number().min(1000, 'Minimum RM 1,000'),
  loanTerm: z.coerce.number().min(6).max(120),
  loanPurpose: z.string().min(2, 'Tell us how you plan to use the funds'),
  loanAmountRange: z.string(),
  fullName: z.string().min(3, 'Enter your full name'),
  icNumber: z
    .string()
    .regex(/^\d{6}-?\d{2}-?\d{4}$/, 'Invalid IC number format'),
  dateOfBirth: z.string().min(1, 'Select your birth date'),
  gender: z.string().min(1, 'Select gender'),
  maritalStatus: z.string().min(1, 'Select marital status'),
  nationality: z.string().min(2, 'Enter nationality'),
  phone: z.string().regex(/^(\+?60|0)[1-9]\d{7,9}$/, 'Enter a valid Malaysian number'),
  email: z.string().email('Invalid email address'),
  address: addressSchema,
  employmentStatus: z.string().min(1, 'Select employment status'),
  companyName: z.string().optional(),
  position: z.string().optional(),
  monthlyIncome: z.coerce.number().min(0, 'Monthly income required'),
  yearsEmployed: z.coerce.number().min(0, 'Enter years employed'),
  employerPhone: z.string().optional(),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: 'Please accept the terms & conditions',
  }),
  privacyAccepted: z.boolean().refine((val) => val === true, {
    message: 'Please accept the privacy policy',
  }),
  ctosConsent: z.boolean().default(false),
  marketingConsent: z.boolean().default(false),
});
const defaultValues: FormData = {
  loanType: '',
  loanAmount: 50000,
  loanTerm: 60,
  loanPurpose: '',
  loanAmountRange: loanAmountRanges[2].value,
  fullName: '',
  icNumber: '',
  dateOfBirth: '',
  gender: '',
  maritalStatus: '',
  nationality: 'Malaysian',
  phone: '',
  email: '',
  address: {
    line1: '',
    line2: '',
    city: '',
    state: '',
    postcode: '',
  },
  employmentStatus: '',
  companyName: '',
  position: '',
  monthlyIncome: 0,
  yearsEmployed: 0,
  employerPhone: '',
  termsAccepted: false,
  privacyAccepted: false,
  ctosConsent: true,
  marketingConsent: false,
};

const FORM_STORAGE_KEY = 'smc_application_draft_v1';

const getDraftStorage = () => {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
};

const getSessionStorage = () => {
  if (typeof window === 'undefined') return null;
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
};

const readDraft = () => {
  const storage = getDraftStorage();
  const session = getSessionStorage();
  const localValue = storage?.getItem(FORM_STORAGE_KEY);
  if (localValue) return localValue;
  const sessionValue = session?.getItem(FORM_STORAGE_KEY);
  if (sessionValue && storage) {
    storage.setItem(FORM_STORAGE_KEY, sessionValue);
    session?.removeItem(FORM_STORAGE_KEY);
  }
  return sessionValue ?? null;
};

const writeDraft = (snapshot: string) => {
  const storage = getDraftStorage() ?? getSessionStorage();
  if (!storage) {
    return false;
  }
  storage.setItem(FORM_STORAGE_KEY, snapshot);
  return true;
};

const removeDraft = () => {
  const storage = getDraftStorage();
  const session = getSessionStorage();
  storage?.removeItem(FORM_STORAGE_KEY);
  session?.removeItem(FORM_STORAGE_KEY);
};

type ApiValidationError = Error & {
  data?: {
    errors?: { field?: string; message?: string }[];
  };
};

const isApiValidationError = (error: unknown): error is ApiValidationError => {
  if (!(error instanceof Error)) {
    return false;
  }
  const data = (error as { data?: unknown }).data;
  if (!data || typeof data !== 'object') {
    return false;
  }
  const errors = (data as { errors?: unknown }).errors;
  return Array.isArray(errors);
};

const stepFieldMap: Record<StepId, FieldPath<FormData>[]> = {
  loan: ['loanType', 'loanAmount', 'loanTerm', 'loanPurpose'],
  personal: ['fullName', 'icNumber', 'dateOfBirth', 'gender', 'maritalStatus', 'nationality'],
  contact: ['phone', 'email', 'address.line1', 'address.city', 'address.state', 'address.postcode'],
  employment: ['employmentStatus', 'monthlyIncome', 'yearsEmployed'],
  review: [],
};

export default function ApplyPage() {
  const locale = useLocale();
  const lang = locale === 'ms' ? 'ms' : 'en';
  const t = useTranslations('apply');
  const breadcrumbItems = [
    { name: lang === 'ms' ? 'Utama' : 'Home', url: `${baseUrl}/${locale}` },
    { name: lang === 'ms' ? 'Mohon' : 'Apply', url: `${baseUrl}/${locale}/apply` },
  ];
  const howToSteps = [
    {
      name: lang === 'ms' ? 'Isi maklumat pinjaman' : 'Provide loan info',
      text:
        lang === 'ms'
          ? 'Pilih jenis pinjaman, jumlah dan tempoh supaya kami boleh menyesuaikan kadar.'
          : 'Choose your loan type, amount, and tenure so we can tailor indicative rates.',
    },
    {
      name: lang === 'ms' ? 'Lengkapkan butiran peribadi' : 'Complete personal details',
      text:
        lang === 'ms'
          ? 'Isikan nama penuh, IC, maklumat hubungan serta alamat untuk semakan kelayakan.'
          : 'Enter your full name, IC, contact info, and address for eligibility checks.',
    },
    {
      name: lang === 'ms' ? 'Maklumat pekerjaan & pendapatan' : 'Share employment info',
      text:
        lang === 'ms'
          ? 'Nyatakan status pekerjaan, pendapatan bulanan dan majikan bagi membantu proses underwriting.'
          : 'Tell us your employment status, monthly income, and employer details to assist underwriting.',
    },
    {
      name: lang === 'ms' ? 'Semak & hantar' : 'Review & submit',
      text:
        lang === 'ms'
          ? 'Sahkan persetujuan terma, privasi dan pilih jika mahu kemas kini CTOS sebelum menghantar.'
          : 'Confirm terms/privacy consent, opt into CTOS checks, then submit your application.',
    },
  ];
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeStep, setActiveStep] = useState<StepId>('loan');
  const [submitResult, setSubmitResult] = useState<{ success: boolean; applicationId?: string; message?: string } | null>(null);
  const [draftStatus, setDraftStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [persistDraft, setPersistDraft] = useState(true);
  type DraftTimer = ReturnType<typeof setTimeout> | ReturnType<typeof window.setTimeout>;
  const draftSaveTimerRef = useRef<DraftTimer | null>(null);
  const lastSavedSnapshotRef = useRef<string>('');

  const {
    register,
    control,
    watch,
    setValue,
    reset,
    setError,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema as any) as unknown as Resolver<FormData>,
    defaultValues,
  });

  const loanAmountWatch = watch('loanAmount');
  useEffect(() => {
    const range = loanAmountRanges.find((range) => loanAmountWatch <= range.max) || loanAmountRanges[loanAmountRanges.length - 1];
    setValue('loanAmountRange', range.value);
  }, [loanAmountWatch, setValue]);

  useEffect(() => {
    if (!persistDraft) return;
    try {
      const saved = readDraft();
      if (saved) {
        const parsed = JSON.parse(saved);
        reset({ ...defaultValues, ...parsed });
        lastSavedSnapshotRef.current = saved;
        setDraftStatus('saved');
      }
    } catch (error) {
      console.warn('Failed to restore draft', error);
    }
  }, [persistDraft, reset]);

  useEffect(() => {
    if (!persistDraft) {
      removeDraft();
      lastSavedSnapshotRef.current = '';
      setDraftStatus('idle');
      return;
    }

    const subscription = watch((value) => {
      try {
        const snapshot = JSON.stringify(value);
        if (snapshot === lastSavedSnapshotRef.current) {
          return;
        }
        setDraftStatus('saving');
        if (draftSaveTimerRef.current) {
          window.clearTimeout(draftSaveTimerRef.current);
        }
        draftSaveTimerRef.current = window.setTimeout(() => {
          try {
            if (!writeDraft(snapshot)) {
              setDraftStatus('idle');
              return;
            }
            lastSavedSnapshotRef.current = snapshot;
            setDraftStatus('saved');
          } catch (error) {
            console.warn('Failed to save draft', error);
          }
        }, 500) as unknown as DraftTimer;
      } catch (error) {
        console.warn('Failed to serialize draft', error);
      }
    });
    return () => {
      subscription.unsubscribe();
      if (draftSaveTimerRef.current) {
        window.clearTimeout(draftSaveTimerRef.current);
      }
    };
  }, [watch, persistDraft]);

  const removeDraftFromStorage = () => {
    removeDraft();
    if (draftSaveTimerRef.current) {
      window.clearTimeout(draftSaveTimerRef.current);
      draftSaveTimerRef.current = null;
    }
    lastSavedSnapshotRef.current = '';
  };

  const clearDraft = () => {
    removeDraftFromStorage();
    reset(defaultValues);
    setDraftStatus('idle');
  };

  const selectedLoanType = watch('loanType');
  const currentLoanConfig = loanTypes.find((item) => item.value === selectedLoanType) || loanTypes[0];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeStep]);

  const handleNext = async () => {
    const fields = stepFieldMap[activeStep];
    if (fields.length) {
      const valid = await trigger(fields);
      if (!valid) return;
    }
    const currentIndex = stepOrder.indexOf(activeStep);
    if (currentIndex < stepOrder.length - 1) {
      setActiveStep(stepOrder[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const currentIndex = stepOrder.indexOf(activeStep);
    if (currentIndex > 0) {
      setActiveStep(stepOrder[currentIndex - 1]);
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const payload = {
        loanType: data.loanType,
        loanAmount: data.loanAmount,
        loanTerm: data.loanTerm,
        loanPurpose: data.loanPurpose,
        loanAmountRange: data.loanAmountRange,
        fullName: data.fullName,
        icNumber: data.icNumber,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        maritalStatus: data.maritalStatus,
        nationality: data.nationality,
        phone: data.phone,
        email: data.email,
        address: data.address,
        employmentStatus: data.employmentStatus,
        companyName: data.companyName,
        position: data.position,
        monthlyIncome: data.monthlyIncome,
        yearsEmployed: data.yearsEmployed,
        employerPhone: data.employerPhone,
        termsAccepted: data.termsAccepted,
        privacyAccepted: data.privacyAccepted,
        ctosConsent: data.ctosConsent,
        marketingConsent: data.marketingConsent,
      };

      const response = await submitApplication(payload);

      if (response.success) {
        removeDraftFromStorage();
        setSubmitResult({
          success: true,
          applicationId: response.data?.applicationId,
        });
      } else {
        setSubmitResult({
          success: false,
          message: response.message || 'Submission failed. Please try again.',
        });
      }
    } catch (error) {
      if (isApiValidationError(error)) {
        error.data?.errors?.forEach((item) => {
          if (item.field) {
            setError(item.field as FieldPath<FormData>, { type: 'server', message: item.message });
          }
        });
      }
      setSubmitResult({
        success: false,
        message: error instanceof Error ? error.message : 'Submission failed. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepIndex = stepOrder.indexOf(activeStep);

  if (submitResult?.success) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-9 h-9 text-green-600" />
          </div>
          <h1 className="text-2xl font-semibold mb-2">{t('form.success')}</h1>
          <p className="text-muted-foreground mb-1">
            {t('form.applicationId')}
          </p>
          <p className="font-mono text-lg font-semibold text-primary mb-6">
            {submitResult.applicationId}
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            {t('form.postSubmit')}
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" asChild className="border-primary/50 bg-white text-primary hover:bg-primary/5 hover:border-primary">
              <Link href={`/${locale}/apply`} onClick={() => setSubmitResult(null)}>
                {t('form.newApplication')}
              </Link>
            </Button>
            <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href={`/${locale}`}>{t('form.backHome')}</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <BreadcrumbSchema items={breadcrumbItems} />
      <HowToSchema
        name={lang === 'ms' ? 'Cara memohon pinjaman SeaMoneeCredit' : 'How to apply with SeaMoneeCredit'}
        description={
          lang === 'ms'
            ? 'Ikuti empat langkah mudah untuk menghantar permohonan pinjaman anda secara dalam talian.'
            : 'Follow four simple steps to submit your loan application online.'
        }
        steps={howToSteps}
      />
      <section className="hero-surface relative overflow-hidden py-16 md:py-24 text-white">
        <div className="hero-circuit opacity-60" aria-hidden="true" />
        <div className="hero-wave hero-wave--top" aria-hidden="true" />
        <div className="hero-wave" aria-hidden="true" />
        <div className="container relative z-10 grid items-center gap-10 lg:grid-cols-[1.1fr_minmax(0,0.85fr)]">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.4em] text-sky-200">{t('title')}</p>
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl font-semibold leading-tight">
                {t('subtitle')}
              </h1>
              <p className="text-white/85 text-base">
                {t('form.description')}
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { icon: ShieldCheck, label: t('highlights.licensed') },
                { icon: Sparkles, label: t('highlights.fastApproval') },
                { icon: CircleDollarSign, label: t('highlights.lowRate') },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/25 bg-white/10 px-4 py-3 text-center backdrop-blur">
                  <item.icon className="mx-auto mb-2 h-5 w-5 text-white" />
                  <p className="text-xs font-medium text-white/80">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="glass-card rounded-[32px] p-6 text-sm text-white shadow-2xl shadow-blue-900/30">
            <h3 className="text-lg font-semibold">{t('form.prepareTitle')}</h3>
            <ul className="mt-4 space-y-3 text-white/85">
              {t.raw('form.prepareList').map((item: string) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-5 rounded-2xl border border-white/30 bg-white/5 p-4 text-white/80">
              <p className="text-xs uppercase tracking-[0.3em] text-white/60">{t('form.needHelp')}</p>
              <p className="mt-2 flex items-center gap-2">
                <PhoneCall className="h-4 w-4" /> {t('form.helpText')}
              </p>
            </div>
            <div className="mt-5 flex flex-col gap-2 rounded-2xl border border-white/30 bg-white/5 p-4 text-xs text-white/80">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember-draft"
                  checked={persistDraft}
                  onCheckedChange={(checked) => setPersistDraft(Boolean(checked))}
                />
                <label htmlFor="remember-draft" className="cursor-pointer select-none">
                  {t('form.rememberDraftLabel')}
                </label>
              </div>
              <p className="text-[11px] text-white/70">
                {t('form.rememberDraftNote')}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="container -mt-20 pb-20">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_minmax(0,0.85fr)]">
          <div className="wave-card relative overflow-hidden border border-white/70 bg-white p-6 md:p-8 shadow-[0_25px_70px_rgba(7,17,52,0.08)]">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-300 via-primary to-indigo-500 opacity-70" aria-hidden="true" />
            <div className="mb-6 space-y-2">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-semibold text-primary">{t('form.progress', { current: stepIndex + 1, total: stepOrder.length })}</p>
                <div className="flex items-center gap-3">
                  <div className="text-xs text-muted-foreground" aria-live="polite">
                    {draftStatus === 'saving' && t('form.draftStatus.saving')}
                    {draftStatus === 'saved' && t('form.draftStatus.saved')}
                    {draftStatus === 'idle' && t('form.draftStatus.idle')}
                  </div>
                  <Button type="button" variant="ghost" className="h-auto px-2 py-1 text-xs" onClick={clearDraft}>
                    {t('form.clearDraft')}
                  </Button>
                </div>
              </div>
              <h2 className="text-2xl font-semibold text-foreground">{t(`steps.${activeStep}`)}</h2>
              <nav className="flex flex-wrap gap-2" aria-label="Application steps">
                {stepOrder.map((step, index) => {
                  const isActive = step === activeStep;
                  const isCompleted = index < stepIndex;
                  return (
                    <button
                      key={step}
                      type="button"
                      className={`rounded-full px-3 py-1 text-xs font-medium transition border ${
                        isActive
                          ? 'bg-primary text-primary-foreground border-primary'
                          : isCompleted
                          ? 'bg-primary/10 text-primary border-transparent'
                          : 'bg-muted text-muted-foreground border-transparent'
                      }`}
                      aria-current={isActive ? 'step' : undefined}
                      onClick={() => {
                        if (isCompleted || isActive) {
                          setActiveStep(step);
                        }
                      }}
                    >
                      {index + 1}. {t(`steps.${step}`)}
                    </button>
                  );
                })}
              </nav>
              <div className="flex items-center gap-2">
                {stepOrder.map((step, index) => (
                  <div key={step} className={`h-1 flex-1 rounded-full ${index <= stepIndex ? 'bg-primary' : 'bg-muted'}`} />
                ))}
              </div>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {submitResult?.success === false && (
                <div className="rounded-2xl border border-red-100 bg-red-50/80 p-3 text-sm text-red-700" role="alert">
                  {submitResult.message}
                </div>
              )}

              {activeStep === 'loan' && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label>{t('form.loanType')}</Label>
                    <Controller
                      name="loanType"
                      control={control}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder={t('form.placeholders.loanType')} />
                          </SelectTrigger>
                          <SelectContent>
                            {loanTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {t(`form.loanTypes.${type.value}`, { default: type.value })}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.loanType && <p className="text-sm text-red-500">{errors.loanType.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>{t('form.loanAmount')}</Label>
                      <span className="font-semibold text-primary">RM {loanAmountWatch.toLocaleString()}</span>
                    </div>
                    <Controller
                      name="loanAmount"
                      control={control}
                      render={({ field }) => (
                        <Slider
                          value={[field.value || currentLoanConfig.min]}
                          onValueChange={(value) => field.onChange(value[0])}
                          min={currentLoanConfig.min}
                          max={currentLoanConfig.max}
                          step={1000}
                          className="py-4"
                        />
                      )}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>RM {currentLoanConfig.min.toLocaleString()}</span>
                      <span>RM {currentLoanConfig.max.toLocaleString()}</span>
                    </div>
                    {errors.loanAmount && <p className="text-sm text-red-500">{errors.loanAmount.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>{t('form.loanTerm')}</Label>
                      <Controller
                        name="loanTerm"
                        control={control}
                        render={({ field }) => (
                          <div className="flex items-center gap-2">
                            <Input type="number" className="w-20 text-right" value={field.value} min={6} max={120} onChange={(e) => field.onChange(Number(e.target.value))} />
                            <span className="text-sm text-muted-foreground">{t('form.months')}</span>
                          </div>
                        )}
                      />
                    </div>
                    {errors.loanTerm && <p className="text-sm text-red-500">{errors.loanTerm.message}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <Label>{t('form.loanPurpose')}</Label>
                    <Controller
                      name="loanPurpose"
                      control={control}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder={t('form.placeholders.loanPurpose')} />
                          </SelectTrigger>
                          <SelectContent>
                            {loanPurposes.map((purpose) => (
                              <SelectItem key={purpose} value={purpose}>
                                {t(`form.loanPurposes.${purpose}`, { default: purpose })}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.loanPurpose && <p className="text-sm text-red-500">{errors.loanPurpose.message}</p>}
                  </div>
                </div>
              )}

              {activeStep === 'personal' && (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label>{t('form.fullName')}</Label>
                    <Input {...register('fullName')} placeholder={t('form.placeholders.fullName')} />
                    {errors.fullName && <p className="text-sm text-red-500">{errors.fullName.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label>{t('form.icNumber')}</Label>
                    <Input {...register('icNumber')} placeholder="850101-14-5678" />
                    {errors.icNumber && <p className="text-sm text-red-500">{errors.icNumber.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label>{t('form.dateOfBirth')}</Label>
                    <Input type="date" {...register('dateOfBirth')} />
                    {errors.dateOfBirth && <p className="text-sm text-red-500">{errors.dateOfBirth.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label>{t('form.gender')}</Label>
                    <Controller
                      name="gender"
                      control={control}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder={t('form.placeholders.gender')} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">{t('form.male')}</SelectItem>
                            <SelectItem value="female">{t('form.female')}</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.gender && <p className="text-sm text-red-500">{errors.gender.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label>{t('form.maritalStatus')}</Label>
                    <Controller
                      name="maritalStatus"
                      control={control}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder={t('form.placeholders.maritalStatus')} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="single">{t('form.single')}</SelectItem>
                            <SelectItem value="married">{t('form.married')}</SelectItem>
                            <SelectItem value="divorced">{t('form.divorced')}</SelectItem>
                            <SelectItem value="widowed">{t('form.widowed')}</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.maritalStatus && <p className="text-sm text-red-500">{errors.maritalStatus.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label>{t('form.nationality')}</Label>
                    <Input {...register('nationality')} />
                    {errors.nationality && <p className="text-sm text-red-500">{errors.nationality.message}</p>}
                  </div>
                </div>
              )}

              {activeStep === 'contact' && (
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label>{t('form.phone')}</Label>
                      <Input {...register('phone')} placeholder="+60" />
                      {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <Label>{t('form.email')}</Label>
                      <Input type="email" {...register('email')} placeholder="you@email.com" />
                      {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label>{t('form.address')}</Label>
                    <Input {...register('address.line1')} placeholder={t('form.placeholders.addressLine1')} />
                    {errors.address?.line1 && <p className="text-sm text-red-500">{errors.address.line1.message}</p>}
                  </div>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-1.5">
                      <Label>{t('form.city')}</Label>
                      <Input {...register('address.city')} />
                      {errors.address?.city && <p className="text-sm text-red-500">{errors.address.city.message}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <Label>{t('form.state')}</Label>
                      <Controller
                        name="address.state"
                        control={control}
                        render={({ field }) => (
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger className="h-11">
                              <SelectValue placeholder={t('form.placeholders.state')} />
                            </SelectTrigger>
                            <SelectContent>
                              {malaysiaStates.map((state) => (
                                <SelectItem key={state} value={state}>
                                  {state}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.address?.state && <p className="text-sm text-red-500">{errors.address.state.message}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <Label>{t('form.postcode')}</Label>
                      <Input {...register('address.postcode')} placeholder="50000" />
                      {errors.address?.postcode && <p className="text-sm text-red-500">{errors.address.postcode.message}</p>}
                    </div>
                  </div>
                </div>
              )}

              {activeStep === 'employment' && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label>{t('form.employmentStatus')}</Label>
                    <Controller
                      name="employmentStatus"
                      control={control}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder={t('form.placeholders.employmentStatus')} />
                          </SelectTrigger>
                          <SelectContent>
                            {employmentOptions.map((option) => (
                              <SelectItem key={option} value={option}>
                                {t(`form.${option}`, { default: option })}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.employmentStatus && <p className="text-sm text-red-500">{errors.employmentStatus.message}</p>}
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label>{t('form.companyName')}</Label>
                      <Input {...register('companyName')} placeholder={t('form.placeholders.company')} />
                    </div>
                    <div className="space-y-1.5">
                      <Label>{t('form.position')}</Label>
                      <Input {...register('position')} placeholder={t('form.placeholders.position')} />
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-1.5">
                      <Label>{t('form.monthlyIncome')}</Label>
                      <Input type="number" {...register('monthlyIncome', { valueAsNumber: true })} prefix="RM" />
                      {errors.monthlyIncome && <p className="text-sm text-red-500">{errors.monthlyIncome.message}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <Label>{t('form.yearsEmployed')}</Label>
                      <Input type="number" step="0.5" {...register('yearsEmployed', { valueAsNumber: true })} />
                      {errors.yearsEmployed && <p className="text-sm text-red-500">{errors.yearsEmployed.message}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <Label>{t('form.employerPhone')}</Label>
                      <Input {...register('employerPhone')} placeholder="+60" />
                    </div>
                  </div>
                </div>
              )}

              {activeStep === 'review' && (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">{t('form.reviewDescription')}</p>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl border border-dashed border-primary/20 p-4">
                      <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{t('form.loanDetails')}</p>
                      <div className="mt-3 space-y-1 text-sm">
                        <p>{t('form.loanType')}: <span className="font-semibold">{t(`form.loanTypes.${selectedLoanType || 'personal-loan'}`, { default: selectedLoanType })}</span></p>
                        <p>{t('form.loanAmount')}: <span className="font-semibold">RM {loanAmountWatch.toLocaleString()}</span></p>
                      </div>
                    </div>
                    <div className="rounded-2xl border border-dashed border-primary/20 p-4">
                      <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{t('form.contactInfo')}</p>
                      <div className="mt-3 space-y-1 text-sm">
                        <p>{watch('fullName')}</p>
                        <p>{watch('phone')}</p>
                        <p>{watch('email')}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <label className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Controller
                        name="termsAccepted"
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(checked) => field.onChange(Boolean(checked))}
                          />
                        )}
                      />
                      <span>
                        {t('form.termsAccepted')}{' '}
                        <Link href={`/${locale}/terms`} className="text-primary underline">
                          {t('form.termsLink')}
                        </Link>
                      </span>
                    </label>
                    {errors.termsAccepted && (
                      <p className="text-sm text-red-500">{errors.termsAccepted.message}</p>
                    )}

                    <label className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Controller
                        name="privacyAccepted"
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(checked) => field.onChange(Boolean(checked))}
                          />
                        )}
                      />
                      <span>
                        {t('form.privacyAccepted')}{' '}
                        <Link href={`/${locale}/privacy-policy`} className="text-primary underline">
                          {t('form.privacyLink')}
                        </Link>
                      </span>
                    </label>
                    {errors.privacyAccepted && (
                      <p className="text-sm text-red-500">{errors.privacyAccepted.message}</p>
                    )}

                    <label className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Controller
                        name="ctosConsent"
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(checked) => field.onChange(Boolean(checked))}
                          />
                        )}
                      />
                      <span>{t('form.ctosConsent')}</span>
                    </label>

                    <label className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Controller
                        name="marketingConsent"
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(checked) => field.onChange(Boolean(checked))}
                          />
                        )}
                      />
                      <span>{t('form.marketingConsent')}</span>
                    </label>
                  </div>
                </div>
              )}

              <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-between">
                <Button variant="outline" type="button" onClick={handleBack} disabled={activeStep === 'loan'}>
                  {t('form.back')}
                </Button>
                {activeStep === 'review' ? (
                  <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t('form.submitting')}
                      </>
                    ) : (
                      t('form.submit')
                    )}
                  </Button>
                ) : (
                  <Button type="button" onClick={handleNext} className="bg-primary text-primary-foreground hover:bg-primary/90">
                    {t('form.next')}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </form>
          </div>

          <aside className="space-y-5">
            <div className="wave-card relative overflow-hidden border border-white/70 bg-white p-6 shadow-[0_20px_60px_rgba(9,20,60,0.08)]">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-300 via-primary to-indigo-500 opacity-70" aria-hidden="true" />
              <p className="text-xs uppercase tracking-[0.4em] text-primary/70">{t('form.whyUsTitle')}</p>
              <h3 className="mt-3 text-xl font-semibold text-foreground">{t('form.whyUsSubtitle')}</h3>
              <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                {t.raw('form.whyUsList').map((item: string) => (
                  <li key={item} className="flex items-start gap-3">
                    <ShieldCheck className="mt-1 h-4 w-4 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="neo-card-light border border-primary/20 bg-gradient-to-br from-primary/5 to-sky-100/60 p-6">
              <h3 className="text-lg font-semibold text-primary">{t('form.nextStepsTitle')}</h3>
              <ol className="mt-4 space-y-3 text-sm text-primary-foreground/80">
                {t.raw('form.nextSteps').map((step: string, index: number) => (
                  <li key={step} className="flex items-start gap-3">
                    <span className="text-primary font-semibold">{index + 1}</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
              <div className="mt-5 rounded-2xl border border-primary/30 bg-white/70 p-4 text-sm text-primary">
                {t('form.statusHint')}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
