'use client';

import { useParams } from 'next/navigation';

export default function PrivacyPolicyPage() {
  const params = useParams();
  const locale = params.locale as string;
  const lang = locale === 'ms' ? 'ms' : 'en';

  const content = {
    en: {
      title: 'Privacy Policy',
      subtitle: 'Your privacy is important to us',
      lastUpdated: 'Last updated: November 2024',
      sections: [
        {
          title: '1. Information We Collect',
          content: `We collect information you provide directly to us, such as when you:
• Submit a loan application
• Create an account
• Contact us for support
• Subscribe to our newsletter

This information may include your name, email address, phone number, IC number, address, employment details, and financial information necessary for loan processing.`,
        },
        {
          title: '2. How We Use Your Information',
          content: `We use the information we collect to:
• Process and evaluate your loan applications
• Communicate with you about your account and applications
• Comply with legal and regulatory requirements
• Conduct credit checks through CTOS and other credit bureaus
• Improve our services and customer experience
• Send you marketing communications (with your consent)`,
        },
        {
          title: '3. Information Sharing',
          content: `We may share your information with:
• Credit bureaus (CTOS, CCRIS) for credit assessment
• Bank Negara Malaysia as required by law
• Our authorized partners and service providers
• Law enforcement agencies when required by law

We do not sell your personal information to third parties.`,
        },
        {
          title: '4. Data Security',
          content: `We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes:
• Encryption of sensitive data
• Secure server infrastructure
• Regular security audits
• Employee training on data protection`,
        },
        {
          title: '5. Your Rights',
          content: `Under the Personal Data Protection Act 2010 (PDPA), you have the right to:
• Access your personal data
• Correct inaccurate information
• Withdraw consent for marketing communications
• Request deletion of your data (subject to legal requirements)

To exercise these rights, please contact our Data Protection Officer.`,
        },
        {
          title: '6. Cookies and Tracking',
          content: `Our website uses cookies to:
• Improve website functionality
• Analyze website traffic
• Personalize your experience

You can control cookie settings through your browser preferences.`,
        },
        {
          title: '7. Data Retention',
          content: `We retain your personal information for as long as necessary to:
• Fulfill the purposes outlined in this policy
• Comply with legal obligations
• Resolve disputes and enforce agreements

Financial records are typically retained for 7 years as required by Malaysian law.`,
        },
        {
          title: '8. Changes to This Policy',
          content: `We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on our website and updating the "Last Updated" date.`,
        },
        {
          title: '9. Contact Us',
          content: `If you have any questions about this Privacy Policy, please contact us at:

Email: privacy@seamoneecredit.com
Phone: +60 3-1234 5678
Address: Level 10, Menara XYZ, Jalan Sultan Ismail, 50250 Kuala Lumpur`,
        },
      ],
    },
    ms: {
      title: 'Dasar Privasi',
      subtitle: 'Privasi anda penting bagi kami',
      lastUpdated: 'Dikemaskini: November 2024',
      sections: [
        {
          title: '1. Maklumat yang Kami Kumpul',
          content: `Kami mengumpul maklumat yang anda berikan secara langsung kepada kami, seperti apabila anda:
• Menghantar permohonan pinjaman
• Membuat akaun
• Menghubungi kami untuk sokongan
• Melanggan surat berita kami

Maklumat ini mungkin termasuk nama, alamat emel, nombor telefon, nombor IC, alamat, butiran pekerjaan, dan maklumat kewangan yang diperlukan untuk pemprosesan pinjaman.`,
        },
        {
          title: '2. Cara Kami Menggunakan Maklumat Anda',
          content: `Kami menggunakan maklumat yang dikumpul untuk:
• Memproses dan menilai permohonan pinjaman anda
• Berkomunikasi dengan anda tentang akaun dan permohonan anda
• Mematuhi keperluan undang-undang dan peraturan
• Menjalankan semakan kredit melalui CTOS dan biro kredit lain
• Meningkatkan perkhidmatan dan pengalaman pelanggan kami
• Menghantar komunikasi pemasaran kepada anda (dengan persetujuan anda)`,
        },
        {
          title: '3. Perkongsian Maklumat',
          content: `Kami mungkin berkongsi maklumat anda dengan:
• Biro kredit (CTOS, CCRIS) untuk penilaian kredit
• Bank Negara Malaysia seperti yang dikehendaki oleh undang-undang
• Rakan kongsi dan penyedia perkhidmatan yang diberi kuasa
• Agensi penguatkuasaan undang-undang apabila dikehendaki oleh undang-undang

Kami tidak menjual maklumat peribadi anda kepada pihak ketiga.`,
        },
        {
          title: '4. Keselamatan Data',
          content: `Kami melaksanakan langkah teknikal dan organisasi yang sesuai untuk melindungi maklumat peribadi anda daripada akses, pengubahan, pendedahan, atau pemusnahan yang tidak dibenarkan. Ini termasuk:
• Penyulitan data sensitif
• Infrastruktur pelayan yang selamat
• Audit keselamatan berkala
• Latihan pekerja mengenai perlindungan data`,
        },
        {
          title: '5. Hak Anda',
          content: `Di bawah Akta Perlindungan Data Peribadi 2010 (PDPA), anda berhak untuk:
• Mengakses data peribadi anda
• Membetulkan maklumat yang tidak tepat
• Menarik balik persetujuan untuk komunikasi pemasaran
• Meminta pemadaman data anda (tertakluk kepada keperluan undang-undang)

Untuk melaksanakan hak ini, sila hubungi Pegawai Perlindungan Data kami.`,
        },
        {
          title: '6. Kuki dan Penjejakan',
          content: `Laman web kami menggunakan kuki untuk:
• Meningkatkan fungsi laman web
• Menganalisis trafik laman web
• Memperibadikan pengalaman anda

Anda boleh mengawal tetapan kuki melalui keutamaan pelayar anda.`,
        },
        {
          title: '7. Pengekalan Data',
          content: `Kami menyimpan maklumat peribadi anda selama yang diperlukan untuk:
• Memenuhi tujuan yang digariskan dalam dasar ini
• Mematuhi obligasi undang-undang
• Menyelesaikan pertikaian dan menguatkuasakan perjanjian

Rekod kewangan biasanya disimpan selama 7 tahun seperti yang dikehendaki oleh undang-undang Malaysia.`,
        },
        {
          title: '8. Perubahan kepada Dasar Ini',
          content: `Kami mungkin mengemaskini Dasar Privasi ini dari semasa ke semasa. Kami akan memberitahu anda tentang sebarang perubahan ketara dengan menyiarkan dasar baru di laman web kami dan mengemaskini tarikh "Dikemaskini Terakhir".`,
        },
        {
          title: '9. Hubungi Kami',
          content: `Jika anda mempunyai sebarang soalan tentang Dasar Privasi ini, sila hubungi kami di:

Emel: privacy@seamoneecredit.com
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
