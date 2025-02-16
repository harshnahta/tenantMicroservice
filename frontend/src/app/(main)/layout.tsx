import type { Metadata } from 'next';
import Header from '@/components/Admin/Components/Header';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Product - task List',
  description: 'Product',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userCookies = cookies();
  const token: any = userCookies.get('jwt');
  let user: any = userCookies.get('user')?.value || null;
  if (user) {
    user = JSON.parse(user);
  }

  let isAuth = token && token.value ? true : false;

  if (!isAuth) {
    redirect(`/login`);
  }
  return (
    <>
      <Header />
      {children}
    </>
  );
}
