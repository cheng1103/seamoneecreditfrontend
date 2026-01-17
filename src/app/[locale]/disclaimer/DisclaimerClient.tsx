'use client';

import { useParams } from 'next/navigation';

export default function DisclaimerClient() {
  const params = useParams();
  const locale = params.locale as string;
  const lang = locale === 'ms' ? 'ms' : 'en';

  const content = {
    en: {
      title: 'Developer Disclaimer',
      subtitle: 'Important information about this website',
      sections: [
        {
          title: 'Website Development',
          content: `This website was developed by a third-party developer/development team. The developer(s) provide technical services only and are not responsible for:

• The business operations of SeaMoneeCredit
• Any loan applications or financial decisions
• Customer service or loan-related inquiries
• Accuracy of business information displayed on this website
• Any financial losses or disputes arising from transactions`,
        },
        {
          title: 'Limitation of Developer Liability',
          content: `The developer(s) shall not be held liable for:

• Any errors, bugs, or technical issues that may occur
• Data breaches resulting from factors beyond reasonable technical control
• Business decisions made based on information displayed on this website
• Any direct, indirect, incidental, or consequential damages
• Content accuracy or completeness
• Third-party integrations and services

The website is provided "as is" without warranties of any kind.`,
        },
        {
          title: 'Business Responsibility',
          content: `All business-related matters including but not limited to:

• Loan processing and approval
• Interest rates and fees
• Customer support
• Legal compliance
• Financial advice
• Data handling and privacy practices

Are the sole responsibility of SeaMoneeCredit and its management.`,
        },
        {
          title: 'Contact Information',
          content: `For technical issues related to the website, please contact the development team through the official channels provided by SeaMoneeCredit.

For all business, loan, and financial inquiries, please contact SeaMoneeCredit directly:

Email: info@seamoneecredit.com
Phone: +60 3-1234 5678`,
        },
      ],
      footer: 'This disclaimer page is not indexed by search engines.',
    },
    ms: {
      title: 'Penafian Pembangun',
      subtitle: 'Maklumat penting tentang laman web ini',
      sections: [
        {
          title: 'Pembangunan Laman Web',
          content: `Laman web ini dibangunkan oleh pembangun/pasukan pembangunan pihak ketiga. Pembangun menyediakan perkhidmatan teknikal sahaja dan tidak bertanggungjawab untuk:

• Operasi perniagaan SeaMoneeCredit
• Sebarang permohonan pinjaman atau keputusan kewangan
• Perkhidmatan pelanggan atau pertanyaan berkaitan pinjaman
• Ketepatan maklumat perniagaan yang dipaparkan di laman web ini
• Sebarang kerugian kewangan atau pertikaian yang timbul daripada transaksi`,
        },
        {
          title: 'Had Liabiliti Pembangun',
          content: `Pembangun tidak akan bertanggungjawab untuk:

• Sebarang ralat, pepijat, atau isu teknikal yang mungkin berlaku
• Pelanggaran data yang disebabkan oleh faktor di luar kawalan teknikal yang munasabah
• Keputusan perniagaan yang dibuat berdasarkan maklumat yang dipaparkan di laman web ini
• Sebarang kerosakan langsung, tidak langsung, sampingan, atau berbangkit
• Ketepatan atau kesempurnaan kandungan
• Integrasi dan perkhidmatan pihak ketiga

Laman web ini disediakan "seadanya" tanpa sebarang jaminan.`,
        },
        {
          title: 'Tanggungjawab Perniagaan',
          content: `Semua perkara berkaitan perniagaan termasuk tetapi tidak terhad kepada:

• Pemprosesan dan kelulusan pinjaman
• Kadar faedah dan yuran
• Sokongan pelanggan
• Pematuhan undang-undang
• Nasihat kewangan
• Pengendalian data dan amalan privasi

Adalah tanggungjawab tunggal SeaMoneeCredit dan pengurusannya.`,
        },
        {
          title: 'Maklumat Hubungan',
          content: `Untuk isu teknikal berkaitan laman web, sila hubungi pasukan pembangunan melalui saluran rasmi yang disediakan oleh SeaMoneeCredit.

Untuk semua pertanyaan perniagaan, pinjaman, dan kewangan, sila hubungi SeaMoneeCredit secara langsung:

Emel: info@seamoneecredit.com
Telefon: +60 3-1234 5678`,
        },
      ],
      footer: 'Halaman penafian ini tidak diindeks oleh enjin carian.',
    },
  };

  const t = content[lang];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden hero-surface py-16 md:py-20 text-white">
        <div className="hero-circuit opacity-60" aria-hidden="true" />
        <div className="hero-wave hero-wave--top" aria-hidden="true" />
        <div className="hero-wave" aria-hidden="true" />
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-sky-200 mb-2">
              {lang === 'ms' ? 'Notis' : 'Notice'}
            </p>
            <h1 className="text-3xl md:text-4xl font-semibold mb-4">{t.title}</h1>
            <p className="text-lg text-white/85">{t.subtitle}</p>
          </div>
        </div>
      </section>

      <div className="container -mt-10 py-12">
        <div className="max-w-4xl mx-auto space-y-6">
          {t.sections.map((section, index) => (
            <div key={index} className="wave-card border rounded-3xl p-6">
              <h2 className="text-xl font-semibold mb-4">{section.title}</h2>
              <div className="text-muted-foreground whitespace-pre-line">
                {section.content}
              </div>
            </div>
          ))}

          <div className="text-center text-sm text-muted-foreground py-4">
            <p>{t.footer}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
