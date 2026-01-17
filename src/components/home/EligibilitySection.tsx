"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type EmploymentKey = "employed" | "self-employed" | "government" | "unemployed" | "retired";
type PurposeKey =
  | "home-renovation"
  | "debt-consolidation"
  | "business-expansion"
  | "education"
  | "medical"
  | "vehicle"
  | "other";

const employmentOrder: EmploymentKey[] = [
  "employed",
  "self-employed",
  "government",
  "unemployed",
  "retired",
];

const purposeOrder: PurposeKey[] = [
  "home-renovation",
  "debt-consolidation",
  "business-expansion",
  "education",
  "medical",
  "vehicle",
  "other",
];

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export default function EligibilitySection() {
  const t = useTranslations("eligibility");
  const locale = useLocale();
  const lang = locale === "ms" ? "ms" : "en";

  const [employment, setEmployment] = useState<EmploymentKey>("employed");
  const [purpose, setPurpose] = useState<PurposeKey>("debt-consolidation");
  const [income, setIncome] = useState(5000);
  const [commitments, setCommitments] = useState(800);

  const score = useMemo(() => {
    let base = 40;
    if (income >= 8000) base += 25;
    else if (income >= 5000) base += 15;
    else if (income >= 3000) base += 8;

    const employmentBoost: Record<EmploymentKey, number> = {
      government: 15,
      employed: 10,
      "self-employed": 8,
      retired: -10,
      unemployed: -20,
    };
    base += employmentBoost[employment];

    const ratio = commitments / Math.max(income, 1);
    if (ratio < 0.2) base += 10;
    else if (ratio < 0.35) base += 5;
    else if (ratio >= 0.5) base -= 10;

    const purposeBoost: Record<PurposeKey, number> = {
      "business-expansion": 5,
      education: 3,
      medical: 2,
      "home-renovation": 2,
      vehicle: 1,
      "debt-consolidation": -5,
      other: 0,
    };
    base += purposeBoost[purpose];

    return clamp(base, 5, 95);
  }, [income, commitments, employment, purpose]);

  const band = score >= 75 ? "strong" : score >= 55 ? "fair" : "review";
  const bandText =
    band === "strong" ? t("bands.strong") : band === "fair" ? t("bands.fair") : t("bands.review");

  return (
    <section className="relative py-16 md:py-20">
      <div className="container">
        <div className="wave-grid rounded-[32px] border border-white/70 bg-white/95 p-6 shadow-[0_30px_80px_rgba(8,18,51,0.08)] md:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_minmax(0,0.9fr)]">
            <div className="space-y-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary/80">
                  {t("eyebrow")}
                </p>
                <h2 className="mt-3 text-3xl font-semibold text-foreground">
                  {t("title")}
                </h2>
                <p className="mt-3 text-sm text-muted-foreground">{t("subtitle")}</p>
              </div>

              <div className="grid gap-4 rounded-3xl border border-white/70 bg-white p-5 shadow-[0_10px_35px_rgba(6,18,45,0.06)]">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                      {t("employmentLabel")}
                    </Label>
                    <Select value={employment} onValueChange={(value) => setEmployment(value as EmploymentKey)}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder={t("employmentPlaceholder")} />
                      </SelectTrigger>
                      <SelectContent>
                        {employmentOrder.map((item) => (
                          <SelectItem key={item} value={item}>
                            {t(`employmentOptions.${item}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                      {t("purposeLabel")}
                    </Label>
                    <Select value={purpose} onValueChange={(value) => setPurpose(value as PurposeKey)}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder={t("purposePlaceholder")} />
                      </SelectTrigger>
                      <SelectContent>
                        {purposeOrder.map((item) => (
                          <SelectItem key={item} value={item}>
                            {t(`purposeOptions.${item}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 rounded-2xl border border-dashed border-primary/20 bg-primary/5 p-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                      {t("incomeLabel")}
                    </span>
                    <span className="text-sm font-semibold text-primary">RM {income.toLocaleString()}</span>
                  </div>
                  <Slider
                    className="mt-2"
                    value={[income]}
                    min={1000}
                    max={20000}
                    step={500}
                    onValueChange={(value) => setIncome(value[0])}
                  />
                  <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                    <span>RM 1,000</span>
                    <span>RM 20,000+</span>
                  </div>
                </div>

                <div className="grid gap-4 rounded-2xl border border-dashed border-primary/20 bg-primary/5 p-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                      {t("commitmentLabel")}
                    </span>
                    <span className="text-sm font-semibold text-primary">RM {commitments.toLocaleString()}</span>
                  </div>
                  <Slider
                    className="mt-2"
                    value={[commitments]}
                    min={0}
                    max={8000}
                    step={250}
                    onValueChange={(value) => setCommitments(value[0])}
                  />
                  <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                    <span>RM 0</span>
                    <span>RM 8,000+</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div className="rounded-3xl border border-primary/15 bg-primary/5 p-6">
                <p className="text-xs uppercase tracking-[0.35em] text-primary/70">{t("resultLabel")}</p>
                <div className="mt-4 space-y-4">
                  <div className="rounded-2xl border border-white/70 bg-white/70 px-4 py-4">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{t("scoreLabel")}</span>
                      <span className="font-semibold text-foreground">{score}/100</span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-white">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-sky-400 via-primary to-indigo-500 transition-all"
                        style={{ width: `${score}%` }}
                      />
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground">{bandText}</span>
                      <span>{t(`bands.${band}Hint`)}</span>
                    </div>
                  </div>

                  <ul className="grid gap-3 text-sm text-muted-foreground">
                    <li>{t("tips.t1")}</li>
                    <li>{t("tips.t2")}</li>
                    <li>{t("tips.t3")}</li>
                  </ul>

                  <p className="text-xs text-muted-foreground">{t("disclaimer")}</p>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild className="flex-1">
                  <Link href={`/${locale}/apply`}>{t("ctaPrimary")}</Link>
                </Button>
                <Button asChild variant="outline" className="flex-1 bg-white">
                  <Link href={`/${locale}/contact`}>{t("ctaSecondary")}</Link>
                </Button>
              </div>

              <div className="rounded-3xl border border-white/70 bg-white px-5 py-4 text-sm text-muted-foreground">
                <p className="font-semibold text-foreground">{t("readyTitle")}</p>
                <p className="mt-2">{t("readyNote")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
