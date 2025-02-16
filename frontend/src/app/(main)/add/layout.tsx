import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Product - Add Task',
  description: 'Product',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
