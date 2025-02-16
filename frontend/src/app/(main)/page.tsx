import React from 'react';
import { api } from '@/utils/api';
import { cookies } from 'next/headers';

import { Button } from 'react-bootstrap';
import Link from 'next/link';
import ProductList from '@/components/Admin/Components/ProductsLists';

export default async function Page({
  searchParams,
}: Readonly<{
  searchParams: any;
}>) {
  const userCookies = cookies();
  const token: any = userCookies.get('jwt');

  const page = Number(searchParams?.page || 1);
  const response: any = await api(
    {
      url: '/product/list',
      method: 'GET',
    },
    false,
    token?.value,
    'product'
  );
  console.log({ response });
  return (
    <>
      <h1 style={{ position: 'relative' }}>
        <Link href="add" style={{ position: 'absolute', right: 0 }}>
          <Button>Add Product</Button>
        </Link>
      </h1>
      <ProductList data={response.result || []} />
    </>
  );
}
