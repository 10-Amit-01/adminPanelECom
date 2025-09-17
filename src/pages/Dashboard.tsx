import AddProductModal from "@/components/AddProducts";
import { Input } from "@/components/ui/input";
import { useGetProductsQuery } from "../services/productApi";
import { useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../services/authApi";
import { useState } from "react";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
interface Product {
  _id?: string | number;
  title: string;
  description: string;
  category: string;
  price: string | number;
  images: (string | File)[];
}

export default function Dashboard() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { data, isLoading, error } = useGetProductsQuery({ page: currentPage });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutAdmin, { isLoading: logoutLoading }] = useLogoutMutation();

  function handleProductEdit(id: Product["_id"]) {
    console.log(id);
    console.log(isLoading);
  }

  function handleProductDelete(id: Product["_id"]) {
    console.log(id);
  }

  async function handleLogout() {
    const response = await logoutAdmin().unwrap();
    if (response.message === "Logged out") {
      dispatch(logout());
      navigate("/login");
    }
  }

  async function prevPage() {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }

  function nextPage() {
    console.log("as", currentPage);
    if (data && currentPage < data.totalPages) {
      setCurrentPage(currentPage + 1);
    }
  }

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
            Store Admin Panel
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div
            className="h-10 w-10 rounded-full bg-cover bg-center"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDjSoi9h0TYWkO_iYAXN_xeaU9-3A1rOmoD0DfutXMSLSNJ_wA1u7JILdIU-1Vz8DpdH3yXJ36_7gSgVS8IAFFxAmk31kyMDlRg09YYQcQjkaet8_8UyCRjGRoR6nDFU_ATb3y9xzJExqH-EfLIGcmDOntN1KSuwVfAFa-JWuZEuWsTUdkfYZm_JQIwupexQp60LgYFKXyupHWQd2tt43qJsd8dfXGN_u7QPvpuEaO8AMs6tJQQmW0LaOjGV8eO1zzjqLb8cT04ikg")',
            }}
          />
          <button
            onClick={handleLogout}
            className="bg-blue-500 p-2 rounded text-white hover:scale-105 hover:shadow-lg duration-150"
            disabled={logoutLoading}
          >
            Logout
          </button>
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
          {error && <p>Something went wrong...</p>}
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
                {data?.products.map((product: Product) => (
                  <tr key={product._id}>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div
                        className="h-12 w-12 flex-shrink-0 rounded-md bg-cover bg-center"
                        style={{ backgroundImage: `url(${product.images[0]})` }}
                      />
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {product.title}
                    </td>
                    <td className="max-w-xs truncate px-6 py-4 text-sm text-gray-500">
                      {product.description}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      ${product.price}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-4">
                        <button
                          className="text-gray-500 hover:text-[var(--primary-color)]"
                          onClick={() => handleProductEdit(product._id)}
                        >
                          <span className="material-symbols-outlined">
                            edit
                          </span>
                        </button>
                        <button
                          className="text-gray-500 hover:text-red-600"
                          onClick={() => handleProductDelete(product._id)}
                        >
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
          <div className="flex items-center justify-center gap-4 mt-4">
            <button
              onClick={prevPage}
              className="flex items-center gap-2 hover:cursor-pointer"
            >
              <ChevronsLeft />
              <span className="text-lg">Prev</span>
            </button>
            <button
              onClick={nextPage}
              className="flex items-center gap-2 hover:cursor-pointer"
            >
              <span className="text-lg">Next</span>
              <ChevronsRight />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
