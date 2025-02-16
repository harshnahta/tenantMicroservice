import '../app/styles/bootstrap.min.css';
import '../app/styles/fontawesome.min.css';
import '../app/styles/animate.min.css';
import '../app/styles/flaticon.css';
import 'swiper/css';
import 'swiper/css/bundle';
// Global Style
import '../app/styles/style.css';
import '../app/styles/responsive.css';
import '../app/styles/custom.scss';

import 'react-toastify/dist/ReactToastify.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import type { Metadata } from 'next';
import { IBM_Plex_Sans } from 'next/font/google';
import { ToastContainer } from 'react-toastify';
import { ToastProvider } from '@/providers/ToastProvider';

const ibm_plex_sans = IBM_Plex_Sans({
  weight: ['100', '200', '300', '400', '500', '600', '700'],
  subsets: ['latin'],
});

const title = 'Product Manager';
const description = 'Product';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: process.env.HOST_URL },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="robots" content="Index, Follow" />
      </head>
      <body id="mainBody" className={ibm_plex_sans.className}>
        <ToastProvider>
          {children}

          <ToastContainer
            position="top-right"
            autoClose={4000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </ToastProvider>
      </body>
    </html>
  );
}
