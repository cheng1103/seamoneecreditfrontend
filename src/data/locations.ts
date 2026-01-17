import type { LocationEntry } from '@/types/site';

export const defaultLocations: LocationEntry[] = [
  {
    slug: 'kuala-lumpur',
    name: {
      en: 'Kuala Lumpur HQ',
      ms: 'HQ Kuala Lumpur',
    },
    address: {
      en: 'Level 35, Menara City, Jalan Ampang, 50450 Kuala Lumpur',
      ms: 'Tingkat 35, Menara City, Jalan Ampang, 50450 Kuala Lumpur',
    },
    phone: '+60 3-2710 8888',
    whatsapp: '+60 11-1234 8888',
    hours: {
      en: 'Monday-Friday: 9:00 AM – 6:00 PM',
      ms: 'Isnin-Jumaat: 9:00 AM – 6:00 PM',
    },
    summary: {
      en: 'Central office for Klang Valley customers, offering walk-in consultations and same-day approvals.',
      ms: 'Pejabat utama untuk pelanggan Lembah Klang, menyediakan konsultasi walk-in dan kelulusan hari yang sama.',
    },
    mapEmbedUrl:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3984.0233374090897!2d101.69236347609481!3d3.152481153251457!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cc36260c358221%3A0x8bb2745078e1bc6e!2sKuala%20Lumpur%20City%20Centre!5e0!3m2!1sen!2smy!4v1710000000000!5m2!1sen!2smy',
    geo: { lat: 3.15248, lng: 101.7033 },
    services: [
      {
        en: 'Same-day loan approvals for salaried & business owners',
        ms: 'Kelulusan pinjaman hari sama untuk pekerja & usahawan',
      },
      {
        en: 'CTOS / CCRIS health check with mitigation tips',
        ms: 'Semakan CTOS / CCRIS bersama panduan pemulihan',
      },
      {
        en: 'SME working capital bridging and refinancing',
        ms: 'Jambatan modal kerja PKS dan pembiayaan semula',
      },
    ],
    areasServed: [
      { en: 'Bukit Bintang & KLCC', ms: 'Bukit Bintang & KLCC' },
      { en: 'Petaling Jaya & Damansara', ms: 'Petaling Jaya & Damansara' },
      { en: 'Cheras & Ampang', ms: 'Cheras & Ampang' },
      { en: 'Shah Alam & Subang', ms: 'Shah Alam & Subang' },
    ],
    ratingSummary: { score: 4.9, count: 220 },
    faqs: [
      {
        question: {
          en: 'Do I need an appointment to visit the Kuala Lumpur HQ?',
          ms: 'Perlukah saya membuat janji temu sebelum ke HQ Kuala Lumpur?',
        },
        answer: {
          en: 'Walk-ins are welcomed during business hours, but we recommend booking a slot via WhatsApp so a lending specialist can prepare your documents in advance.',
          ms: 'Walk-in dialu-alukan pada waktu pejabat, namun kami syorkan tempah slot melalui WhatsApp supaya pegawai pinjaman kami boleh menyediakan dokumen lebih awal.',
        },
      },
      {
        question: {
          en: 'Can foreign workers or expatriates apply at this branch?',
          ms: 'Bolehkah pekerja asing atau ekspatriat memohon di cawangan ini?',
        },
        answer: {
          en: 'Yes, the HQ regularly handles expatriate cases. Bring your passport, employment contract, and local guarantor details for faster review.',
          ms: 'Ya, HQ kerap mengurus permohonan ekspatriat. Bawa pasport, kontrak pekerjaan dan maklumat penjamin tempatan untuk semakan lebih pantas.',
        },
      },
    ],
  },
  {
    slug: 'penang',
    name: {
      en: 'Penang Service Hub',
      ms: 'Hab Perkhidmatan Pulau Pinang',
    },
    address: {
      en: '7th Floor, Bayfront Tower, Lebuh Pantai, 10300 George Town, Penang',
      ms: 'Tingkat 7, Bayfront Tower, Lebuh Pantai, 10300 George Town, Pulau Pinang',
    },
    phone: '+60 4-220 6688',
    whatsapp: '+60 12-556 6688',
    hours: {
      en: 'Monday-Friday: 9:30 AM – 5:30 PM',
      ms: 'Isnin-Jumaat: 9:30 AM – 5:30 PM',
    },
    summary: {
      en: 'Northern region branch serving Penang and Kedah customers with bilingual consultants.',
      ms: 'Cawangan wilayah utara untuk pelanggan Pulau Pinang dan Kedah dengan perunding dwibahasa.',
    },
    mapEmbedUrl:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3971.9923581960545!2d100.3327569750035!3d5.416384735439908!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x304ac394a9a77593%3A0xa8b5ef17ada1104c!2sGeorge%20Town%2C%20Penang!5e0!3m2!1sen!2smy!4v1710000000001!5m2!1sen!2smy',
    geo: { lat: 5.41638, lng: 100.3328 },
    services: [
      {
        en: 'Bilingual consultations (English / Bahasa / Mandarin)',
        ms: 'Konsultasi dwibahasa (Inggeris / Bahasa / Mandarin)',
      },
      {
        en: 'SME export financing & invoice factoring guidance',
        ms: 'Panduan pembiayaan eksport PKS & faktoring invois',
      },
      {
        en: 'Personal loan restructuring for mainland homeowners',
        ms: 'Penyusunan semula pinjaman peribadi untuk pemilik rumah tanah besar',
      },
    ],
    areasServed: [
      { en: 'George Town & Tanjung Tokong', ms: 'George Town & Tanjung Tokong' },
      { en: 'Bayan Lepas & Batu Maung', ms: 'Bayan Lepas & Batu Maung' },
      { en: 'Butterworth & Bukit Mertajam', ms: 'Butterworth & Bukit Mertajam' },
      { en: 'Kulim & Sungai Petani', ms: 'Kulim & Sungai Petani' },
    ],
    ratingSummary: { score: 4.8, count: 140 },
    faqs: [
      {
        question: {
          en: 'Can Kedah applicants use the Penang service hub?',
          ms: 'Adakah pemohon dari Kedah boleh menggunakan hab Pulau Pinang?',
        },
        answer: {
          en: 'Yes. We frequently host hybrid video calls for Kedah customers and arrange document drop-offs at partner co-working spaces.',
          ms: 'Boleh. Kami sering mengadakan panggilan video hibrid untuk pelanggan Kedah dan mengatur penyerahan dokumen di ruang kerja rakan kongsi.',
        },
      },
      {
        question: {
          en: 'Do you offer Islamic financing alternatives here?',
          ms: 'Adakah pembiayaan patuh Syariah ditawarkan di sini?',
        },
        answer: {
          en: 'We provide Shariah-compliant referral partners in Penang. Inform our consultant during your visit so we can match you to the correct panel.',
          ms: 'Kami menyediakan rakan rujukan patuh Syariah di Pulau Pinang. Maklumkan kepada perunding ketika lawatan agar kami boleh padankan anda dengan panel yang sesuai.',
        },
      },
    ],
  },
  {
    slug: 'johor-bahru',
    name: {
      en: 'Johor Bahru Service Centre',
      ms: 'Pusat Perkhidmatan Johor Bahru',
    },
    address: {
      en: 'Suite 18-05, Zenith Mall, Jalan Trus, 80000 Johor Bahru, Johor',
      ms: 'Suite 18-05, Zenith Mall, Jalan Trus, 80000 Johor Bahru, Johor',
    },
    phone: '+60 7-222 3388',
    whatsapp: '+60 17-722 3388',
    hours: {
      en: 'Monday-Friday: 9:00 AM – 6:00 PM',
      ms: 'Isnin-Jumaat: 9:00 AM – 6:00 PM',
    },
    summary: {
      en: 'Southern hub that supports Johor SMEs, cross-border earners, and Singapore commuters.',
      ms: 'Hab selatan yang menyokong PKS Johor, pendapatan rentas sempadan, dan komuter Singapura.',
    },
    mapEmbedUrl:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.409730774232!2d103.75752347599661!3d1.4581647989514713!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31da12f30902d9a9%3A0x321683a81c146c7f!2sJohor%20Bahru!5e0!3m2!1sen!2smy!4v1710000000002!5m2!1sen!2smy',
    geo: { lat: 1.45816, lng: 103.7632 },
    services: [
      {
        en: 'Cross-border income assessment (SGD & MYR payslips)',
        ms: 'Penilaian pendapatan rentas sempadan (slip gaji SGD & MYR)',
      },
      {
        en: 'SME equipment financing for Iskandar & Pasir Gudang',
        ms: 'Pembiayaan peralatan PKS untuk Iskandar & Pasir Gudang',
      },
      {
        en: 'Weekend WhatsApp concierge for commuters',
        ms: 'Konsierge WhatsApp hujung minggu untuk komuter',
      },
    ],
    areasServed: [
      { en: 'Johor Bahru City & Stulang', ms: 'Bandaraya Johor Bahru & Stulang' },
      { en: 'Skudai & Bukit Indah', ms: 'Skudai & Bukit Indah' },
      { en: 'Iskandar Puteri & Gelang Patah', ms: 'Iskandar Puteri & Gelang Patah' },
      { en: 'Pasir Gudang & Masai', ms: 'Pasir Gudang & Masai' },
    ],
    ratingSummary: { score: 4.85, count: 160 },
    faqs: [
      {
        question: {
          en: 'Can I apply using Singapore payslips at the Johor Bahru branch?',
          ms: 'Bolehkah saya memohon menggunakan slip gaji Singapura di cawangan Johor Bahru?',
        },
        answer: {
          en: 'Yes. Bring six months of SGD payslips and bank statements; our consultants will convert them to MYR for affordability calculations.',
          ms: 'Boleh. Bawa slip gaji dan penyata bank SGD enam bulan; perunding kami akan menukarnya ke MYR untuk pengiraan kemampuan.',
        },
      },
      {
        question: {
          en: 'Is Saturday consultation available in Johor Bahru?',
          ms: 'Adakah konsultasi hari Sabtu tersedia di Johor Bahru?',
        },
        answer: {
          en: 'We open selected Saturdays by appointment. Message our WhatsApp concierge to secure your slot two days in advance.',
          ms: 'Kami dibuka pada Sabtu terpilih melalui janji temu. Hubungi konsierge WhatsApp kami untuk menempah slot sekurang-kurangnya dua hari lebih awal.',
        },
      },
    ],
  },
  {
    slug: 'kota-kinabalu',
    name: {
      en: 'Kota Kinabalu Advisory Suite',
      ms: 'Suite Perunding Kota Kinabalu',
    },
    address: {
      en: 'Unit 12-01, Bayview Tower, Jalan Gaya, 88000 Kota Kinabalu, Sabah',
      ms: 'Unit 12-01, Bayview Tower, Jalan Gaya, 88000 Kota Kinabalu, Sabah',
    },
    phone: '+60 88-488 660',
    whatsapp: '+60 13-880 6600',
    hours: {
      en: 'Monday-Friday: 9:30 AM – 5:30 PM',
      ms: 'Isnin-Jumaat: 9:30 AM – 5:30 PM',
    },
    summary: {
      en: 'East Malaysia specialists handling Sabah/Sarawak applicants with hybrid video appointments.',
      ms: 'Pakar Malaysia Timur yang mengurus pemohon Sabah/Sarawak dengan temu janji video hibrid.',
    },
    mapEmbedUrl:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d996.4375420818984!2d116.07345687517761!3d5.982600792056922!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x323b69c2b1c67b4b%3A0xe4df1fb1df2b15f8!2sKota%20Kinabalu!5e0!3m2!1sen!2smy!4v1710000000003!5m2!1sen!2smy',
    geo: { lat: 5.983, lng: 116.0735 },
    services: [
      {
        en: 'Hybrid video consultations for Sabah & Sarawak clients',
        ms: 'Konsultasi video hibrid untuk pelanggan Sabah & Sarawak',
      },
      {
        en: 'Business financing for tourism and logistics operators',
        ms: 'Pembiayaan perniagaan untuk pengendali pelancongan dan logistik',
      },
      {
        en: 'Document courier coordination to West Malaysia partners',
        ms: 'Penyelarasan kurier dokumen ke rakan kongsi Semenanjung',
      },
    ],
    areasServed: [
      { en: 'Kota Kinabalu & Penampang', ms: 'Kota Kinabalu & Penampang' },
      { en: 'Tuaran & Kota Belud', ms: 'Tuaran & Kota Belud' },
      { en: 'Sandakan (remote via video)', ms: 'Sandakan (jauh melalui video)' },
      { en: 'Kuching / Miri applicants', ms: 'Pemohon Kuching / Miri' },
    ],
    ratingSummary: { score: 4.72, count: 110 },
    faqs: [
      {
        question: {
          en: 'How do remote applicants sign loan documents?',
          ms: 'Bagaimana pemohon jarak jauh menandatangani dokumen pinjaman?',
        },
        answer: {
          en: 'We arrange e-signature with courier verification. Physical originals can be shipped via trusted partners within 48 hours.',
          ms: 'Kami mengatur tandatangan elektronik dengan pengesahan kurier. Salinan asal fizikal boleh dihantar melalui rakan kurier dipercayai dalam 48 jam.',
        },
      },
      {
        question: {
          en: 'Can Sabah borrowers get disbursement in West Malaysia bank accounts?',
          ms: 'Bolehkah peminjam Sabah menerima pelepasan ke akaun bank Semenanjung?',
        },
        answer: {
          en: 'Yes, as long as you maintain a Malaysian bank account. Provide the account confirmation letter during verification.',
          ms: 'Boleh, asalkan anda mempunyai akaun bank Malaysia. Sertakan surat pengesahan akaun ketika proses verifikasi.',
        },
      },
    ],
  },
  {
    slug: 'ipoh',
    name: {
      en: 'Ipoh Satellite Office',
      ms: 'Pejabat Satelit Ipoh',
    },
    address: {
      en: 'Level 9, Greentown Business Park, Jalan Dato Seri Ahmad Said, 30450 Ipoh, Perak',
      ms: 'Tingkat 9, Greentown Business Park, Jalan Dato Seri Ahmad Said, 30450 Ipoh, Perak',
    },
    phone: '+60 5-255 7700',
    whatsapp: '+60 18-255 7700',
    hours: {
      en: 'Monday-Friday: 9:00 AM – 5:30 PM',
      ms: 'Isnin-Jumaat: 9:00 AM – 5:30 PM',
    },
    summary: {
      en: 'Central Perak support centre assisting agriculture and manufacturing borrowers.',
      ms: 'Pusat sokongan Perak tengah yang membantu peminjam sektor pertanian dan pembuatan.',
    },
    mapEmbedUrl:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.36763745802!2d101.09134977500679!3d4.597479642537666!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31caec57a93d8fab%3A0xf0f3f271e96a1d69!2sIpoh%2C%20Perak!5e0!3m2!1sen!2smy!4v1710000000004!5m2!1sen!2smy',
    geo: { lat: 4.59748, lng: 101.0909 },
    services: [
      {
        en: 'Agriculture equipment financing advisory',
        ms: 'Nasihat pembiayaan peralatan pertanian',
      },
      {
        en: 'Personal consolidation plans for educators & civil servants',
        ms: 'Pelan penyatuan peribadi untuk pendidik & penjawat awam',
      },
      {
        en: 'Manufacturing working capital facilities',
        ms: 'Kemudahan modal kerja perkilangan',
      },
    ],
    areasServed: [
      { en: 'Ipoh & Greentown', ms: 'Ipoh & Greentown' },
      { en: 'Chemor & Tanjong Rambutan', ms: 'Chemor & Tanjong Rambutan' },
      { en: 'Gopeng & Kampar', ms: 'Gopeng & Kampar' },
      { en: 'Tapah & Slim River', ms: 'Tapah & Slim River' },
    ],
    ratingSummary: { score: 4.75, count: 95 },
    faqs: [
      {
        question: {
          en: 'Do you accept agricultural land grants as supporting documents?',
          ms: 'Adakah geran tanah pertanian boleh digunakan sebagai dokumen sokongan?',
        },
        answer: {
          en: 'Yes, land grants help us verify ownership when structuring larger-ticket financing for farmers.',
          ms: 'Ya, geran tanah membantu kami mengesahkan pemilikan apabila menstruktur pembiayaan nilai tinggi untuk petani.',
        },
      },
      {
        question: {
          en: 'Can I switch disbursement to an Ipoh co-operative bank?',
          ms: 'Bolehkah saya menukar pelepasan ke bank koperasi di Ipoh?',
        },
        answer: {
          en: 'We can disburse to most Malaysian banks. Provide the branch SWIFT/BIC details during the agreement signing.',
          ms: 'Kami boleh melepaskan dana ke kebanyakan bank Malaysia. Berikan butiran SWIFT/BIC cawangan semasa menandatangani perjanjian.',
        },
      },
    ],
  },
];
