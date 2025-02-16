import type { Metadata } from 'next';
import { useMemo } from 'react';
import LeftSection from './LeftSection';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Product - Login',
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

  const leftMenu = useMemo(() => <LeftSection />, []);

  if (isAuth) {
    redirect(`/`);
  }

  return (
    <div className="container" style={{ height: '100vh' }}>
      <div className="login_wrap">
        <div className="login-bg">
          <div className="login-logo">{leftMenu}</div>
          <div className="login-form">{children}</div>
        </div>
      </div>
    </div>
  );
}
