import AddProductModal from "@/components/AddProducts";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

const products = [
  {
    id: 1,
    name: "Summer Dress",
    description: "Lightweight cotton dress with floral pattern",
    price: "$49.99",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBv8RDCpOHYcAHA33p5TlaUiHnBfVn27inKt7Zf4PAYnNlHeJTyxar1gD8tPYMgzn71XPZF_YGrOn-rxi5SKu64bSpeAN1BY61dqXwUdFPKSHWzdymhgCE5WTga99qEFQEsHhUlgNnAv6eLaVDj04aQVFCREfb6CP7dmST3XPy8J24EzI2fvFHEByAgjcVK0ihNdHHC3sjEzi2zt65WA0w_x4qV8MSUdTX79xcaBnDv1fIleOIUNV3rtFAJMszg9RdIQ3eeEuejPhw",
  },
  {
    id: 2,
    name: "Casual Shirt",
    description: "Comfortable linen shirt for everyday wear",
    price: "$39.99",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB7YVJYKJSgGxel7SyCRBR9NypsIkuG9ZkiS0Qwla765HdQvqjN2oseZydmuto3Tb0pL8CG2vFQyyQsQzxwrEuD51kccohv0dA4km2LVKy8n-HHNF1qLe9sU1r-jcRF6YUlfasgS_pPveabdsCidznLIZgVzXv7C71nIgfAWXATiJNP9RB3CveRx1eb2kKd46CMHfVpUoMl_UPxd5iNXwhuqSF31hnW0Bh5Xwb7e9KGpVkyhoFclWS9Uum5U5X38068pvkQEBWwzRI",
  },
];

export default function Dashboard() {
  const [product , setProduct] = useState(products);

  useEffect(() => {
    async function fetchProducts(){
      const response = await fetch("api");
      const data = await response.json();
      if(response.ok){
        setProduct(data);
      }else{
        console.log('failed to fetch data');
      }
    }
    fetchProducts();
  },[]);

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
        <div className="flex items-center gap-4">
          <div className="text-[var(--primary-color)]">
            <svg
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                clipRule="evenodd"
                d="M24 4H42V17.3333V30.6667H24V44H6V30.6667V17.3333H24V4Z"
                fill="currentColor"
                fillRule="evenodd"
              />
            </svg>
          </div>
          <h1 className="text-xl font-bold tracking-tight">
            Fashion Store Admin
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-64">
            <Input
              placeholder="Search"
              className="w-full py-2 pl-10 pr-4 text-sm focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]"
            />
          </div>
          <div
            className="h-10 w-10 rounded-full bg-cover bg-center"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDjSoi9h0TYWkO_iYAXN_xeaU9-3A1rOmoD0DfutXMSLSNJ_wA1u7JILdIU-1Vz8DpdH3yXJ36_7gSgVS8IAFFxAmk31kyMDlRg09YYQcQjkaet8_8UyCRjGRoR6nDFU_ATb3y9xzJExqH-EfLIGcmDOntN1KSuwVfAFa-JWuZEuWsTUdkfYZm_JQIwupexQp60LgYFKXyupHWQd2tt43qJsd8dfXGN_u7QPvpuEaO8AMs6tJQQmW0LaOjGV8eO1zzjqLb8cT04ikg")',
            }}
          />
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 p-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-3xl font-bold">Products</h2>
            <AddProductModal />
          </div>

          {/* Search */}
          <div className="mb-4 relative">
            <Input
              placeholder="Search products..."
              className="w-full py-2.5 pl-10 pr-4 focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]"
            />
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Price
                  </th>
                  <th className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div
                        className="h-12 w-12 flex-shrink-0 rounded-md bg-cover bg-center"
                        style={{ backgroundImage: `url(${product.image})` }}
                      />
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {product.name}
                    </td>
                    <td className="max-w-xs truncate px-6 py-4 text-sm text-gray-500">
                      {product.description}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {product.price}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-4">
                        <button className="text-gray-500 hover:text-[var(--primary-color)]">
                          <span className="material-symbols-outlined">
                            edit
                          </span>
                        </button>
                        <button className="text-gray-500 hover:text-red-600">
                          <span className="material-symbols-outlined">
                            delete
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
