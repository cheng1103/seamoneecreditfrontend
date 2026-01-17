'use client';

import { useParams } from 'next/navigation';

export default function TermsPage() {
  const params = useParams();
  const locale = params.locale as string;
  const lang = locale === 'ms' ? 'ms' : 'en';

  const content = {
    en: {
      title: 'Terms and Conditions',
      subtitle: 'Please read these terms carefully before using our services',
      lastUpdated: 'Last updated: November 2024',
      sections: [
        {
          title: '1. Acceptance of Terms',
          content: `By accessing and using the SeaMoneeCredit website and services, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.`,
        },
        {
          title: '2. Eligibility',
          content: `To apply for a loan, you must:
• Be a Malaysian citizen or Permanent Resident
• Be at least 21 years of age
• Have a valid Malaysian IC
• Meet the minimum income requirements for the specific loan product
• Not be an undischarged bankrupt`,
        },
        {
          title: '3. Loan Application',
          content: `• All information provided in the loan application must be true and accurate
• Providing false information may result in rejection of application and legal action
• We reserve the right to verify all information provided
• Submission of application does not guarantee approval
• A RM30 CTOS fee is applicable for credit checks`,
        },
        {
          title: '4. Interest Rates and Fees',
          content: `• Interest rates vary based on loan type and credit assessment
• Interest rates start from 4.88% p.a. for qualified applicants
• All fees and charges will be disclosed before loan disbursement
• Late payment charges apply as per the loan agreement
• Early settlement options are available with applicable fees`,
        },
        {
          title: '5. Repayment',
          content: `• Monthly payments are due on the agreed date
• Payments must be made through approved channels
• Late payments may incur additional charges
• Repeated late payments may affect your credit score
• We may take legal action for defaulted loans`,
        },
        {
          title: '6. Credit Check',
          content: `By applying for a loan, you authorize us to:
• Conduct credit checks through CTOS, CCRIS, and other credit bureaus
• Verify your employment and income information
• Contact your references and employer
• Report your payment history to credit bureaus`,
        },
        {
          title: '7. Privacy and Data Protection',
          content: `Your personal information is handled in accordance with our Privacy Policy and the Personal Data Protection Act 2010 (PDPA). By using our services, you consent to the collection, use, and disclosure of your information as described.`,
        },
        {
          title: '8. Intellectual Property',
          content: `All content on this website, including text, graphics, logos, and software, is the property of SeaMoneeCredit and is protected by Malaysian and international copyright laws.`,
        },
        {
          title: '9. Limitation of Liability',
          content: `SeaMoneeCredit shall not be liable for:
• Any indirect, incidental, or consequential damages
• Loss of profits or business opportunities
• System downtime or technical failures
• Actions of third parties`,
        },
        {
          title: '10. Dispute Resolution',
          content: `Any disputes arising from these terms shall be:
• First attempted to be resolved through negotiation
• Subject to mediation if negotiation fails
• Governed by the laws of Malaysia
• Subject to the exclusive jurisdiction of Malaysian courts`,
        },
        {
          title: '11. Amendments',
          content: `We reserve the right to modify these Terms and Conditions at any time. Changes will be effective upon posting on our website. Continued use of our services constitutes acceptance of modified terms.`,
        },
        {
          title: '12. Contact Information',
          content: `For any questions regarding these Terms and Conditions:

Email: legal@seamoneecredit.com
Phone: +60 3-1234 5678
Address: Level 10, Menara XYZ, Jalan Sultan Ismail, 50250 Kuala Lumpur`,
        },
      ],
    },
    ms: {
      title: 'Terma dan Syarat',
      subtitle: 'Sila baca terma ini dengan teliti sebelum menggunakan perkhidmatan kami',
      lastUpdated: 'Dikemaskini: November 2024',
      sections: [
        {
          title: '1. Penerimaan Terma',
          content: `Dengan mengakses dan menggunakan laman web dan perkhidmatan SeaMoneeCredit, anda bersetuju untuk terikat dengan Terma dan Syarat ini. Jika anda tidak bersetuju dengan terma ini, sila jangan gunakan perkhidmatan kami.`,
        },
        {
          title: '2. Kelayakan',
          content: `Untuk memohon pinjaman, anda mesti:
• Warganegara Malaysia atau Pemastautin Tetap
• Berumur sekurang-kurangnya 21 tahun
• Mempunyai IC Malaysia yang sah
• Memenuhi keperluan pendapatan minimum untuk produk pinjaman tertentu
• Bukan seorang bankrap yang belum dilepaskan`,
        },
        {
          title: '3. Permohonan Pinjaman',
          content: `• Semua maklumat yang diberikan dalam permohonan pinjaman mestilah benar dan tepat
• Memberikan maklumat palsu boleh mengakibatkan penolakan permohonan dan tindakan undang-undang
• Kami berhak untuk mengesahkan semua maklumat yang diberikan
• Penghantaran permohonan tidak menjamin kelulusan
• Yuran CTOS sebanyak RM30 dikenakan untuk semakan kredit`,
        },
        {
          title: '4. Kadar Faedah dan Yuran',
          content: `• Kadar faedah berbeza berdasarkan jenis pinjaman dan penilaian kredit
• Kadar faedah bermula dari 4.88% p.a. untuk pemohon yang layak
• Semua yuran dan caj akan didedahkan sebelum pengeluaran pinjaman
• Caj pembayaran lewat dikenakan mengikut perjanjian pinjaman
• Pilihan penyelesaian awal tersedia dengan yuran yang berkenaan`,
        },
        {
          title: '5. Pembayaran Balik',
          content: `• Bayaran bulanan perlu dibuat pada tarikh yang dipersetujui
• Bayaran mesti dibuat melalui saluran yang diluluskan
• Pembayaran lewat mungkin dikenakan caj tambahan
• Pembayaran lewat berulang mungkin menjejaskan skor kredit anda
• Kami boleh mengambil tindakan undang-undang untuk pinjaman yang gagal dibayar`,
        },
        {
          title: '6. Semakan Kredit',
          content: `Dengan memohon pinjaman, anda memberi kuasa kepada kami untuk:
• Menjalankan semakan kredit melalui CTOS, CCRIS, dan biro kredit lain
• Mengesahkan maklumat pekerjaan dan pendapatan anda
• Menghubungi rujukan dan majikan anda
• Melaporkan sejarah pembayaran anda kepada biro kredit`,
        },
        {
          title: '7. Privasi dan Perlindungan Data',
          content: `Maklumat peribadi anda dikendalikan mengikut Dasar Privasi kami dan Akta Perlindungan Data Peribadi 2010 (PDPA). Dengan menggunakan perkhidmatan kami, anda bersetuju dengan pengumpulan, penggunaan, dan pendedahan maklumat anda seperti yang diterangkan.`,
        },
        {
          title: '8. Harta Intelek',
          content: `Semua kandungan di laman web ini, termasuk teks, grafik, logo, dan perisian, adalah hak milik SeaMoneeCredit dan dilindungi oleh undang-undang hak cipta Malaysia dan antarabangsa.`,
        },
        {
          title: '9. Had Liabiliti',
          content: `SeaMoneeCredit tidak akan bertanggungjawab untuk:
• Sebarang kerosakan tidak langsung, sampingan, atau berbangkit
• Kehilangan keuntungan atau peluang perniagaan
• Masa henti sistem atau kegagalan teknikal
• Tindakan pihak ketiga`,
        },
        {
          title: '10. Penyelesaian Pertikaian',
          content: `Sebarang pertikaian yang timbul daripada terma ini hendaklah:
• Pertama cuba diselesaikan melalui rundingan
• Tertakluk kepada pengantaraan jika rundingan gagal
• Ditadbir oleh undang-undang Malaysia
• Tertakluk kepada bidang kuasa eksklusif mahkamah Malaysia`,
        },
        {
          title: '11. Pindaan',
          content: `Kami berhak untuk mengubah suai Terma dan Syarat ini pada bila-bila masa. Perubahan akan berkuat kuasa sebaik sahaja disiarkan di laman web kami. Penggunaan berterusan perkhidmatan kami merupakan penerimaan terma yang diubah suai.`,
        },
        {
          title: '12. Maklumat Hubungan',
          content: `Untuk sebarang soalan mengenai Terma dan Syarat ini:

Emel: legal@seamoneecredit.com
Telefon: +60 3-1234 5678
Alamat: Tingkat 10, Menara XYZ, Jalan Sultan Ismail, 50250 Kuala Lumpur`,
        },
      ],
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
              {lang === 'ms' ? 'Undang-undang' : 'Legal'}
            </p>
            <h1 className="text-3xl md:text-4xl font-semibold mb-4">{t.title}</h1>
            <p className="text-lg text-white/85">{t.subtitle}</p>
            <p className="text-sm text-white/70 mt-4">{t.lastUpdated}</p>
          </div>
        </div>
      </section>

      <div className="container -mt-10 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="wave-card border rounded-3xl p-6 md:p-8 space-y-8">
            {t.sections.map((section, index) => (
              <div key={index}>
                <h2 className="text-xl font-semibold mb-4">{section.title}</h2>
                <div className="text-muted-foreground whitespace-pre-line">
                  {section.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
