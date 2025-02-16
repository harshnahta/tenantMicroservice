import moment from 'moment';
import React from 'react';

const ProductList = (props: any) => {
  const { data } = props;
  console.log({ data });
  return (
    <div>
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">Product List</h2>
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="border px-4 py-2 text-left">Title</th>
              <th className="border px-4 py-2 text-left">Description</th>
              <th className="border px-4 py-2 text-right">Price</th>
              <th className="border px-4 py-2 text-left">Created At</th>
            </tr>
          </thead>
          <tbody>
            {data.map((product: any) => (
              <tr className="border" key={product.id}>
                <td className="border px-4 py-2">{product.title}</td>
                <td className="border px-4 py-2">{product.description}</td>
                <td className="border px-4 py-2 text-right">
                  ${product.price}
                </td>
                <td className="border px-4 py-2">
                  {moment(product.createdAt).format('DD-MMM-YYYY')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductList;
