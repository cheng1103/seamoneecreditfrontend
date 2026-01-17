import { Metadata } from 'next';
import DisclaimerClient from './DisclaimerClient';

export const metadata: Metadata = {
  title: 'Developer Disclaimer | SeaMoneeCredit',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function DisclaimerPage() {
  return <DisclaimerClient />;
}
