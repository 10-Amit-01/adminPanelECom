"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Upload, X } from "lucide-react";
import {
  useAddProductMutation,
  useEditProductMutation,
} from "@/services/productApi";

interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: string | number;
  images: (string | File)[];
}

interface AddProductModalProps {
  mode: "add" | "edit";
  open: boolean;
  setOpen: (open: boolean) => void;
  initialData?: Product;
  reload: () => void;
}

export default function AddProductModal({
  mode,
  open,
  setOpen,
  initialData,
  reload
}: AddProductModalProps) {
  const [product, setProduct] = useState<Product>({
    id: Math.random(),
    title: "",
    category: "",
    description: "",
    price: "",
    images: [],
  });

  const [addProduct, { isLoading: addLoading }] = useAddProductMutation();
  const [editProduct, { isLoading: editLoading }] = useEditProductMutation();

  // Prefill form when editing
  useEffect(() => {
    if (mode === "edit" && initialData) {
      setProduct(initialData);
    } else {
      setProduct({
        id: Math.random(),
        title: "",
        category: "",
        description: "",
        price: "",
        images: [],
      });
    }
  }, [mode, initialData, open]);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setProduct({
        ...product,
        images: [...product.images, ...Array.from(files)],
      });
    }
  };

  // Remove an image
  const removeImage = (index: number) => {
    const updatedImages = product.images.filter((_, i) => i !== index);
    setProduct({ ...product, images: updatedImages });
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("title", product.title);
    formData.append("category", product.category);
    formData.append("description", product.description);
    formData.append("price", product.price.toString());

    // ✅ Handle images (URLs + new files)
    product.images.forEach((img) => {
      if (typeof img === "string") {
        // existing image URL
        formData.append("images", img);
      } else if (img instanceof File) {
        // new uploaded file
        formData.append("images", img);
      }
    });

    try {
      if (mode === "add") {
        await addProduct(formData).unwrap();
        reload();
        setProduct({
          id: Math.random(),
          title: "",
          category: "",
          description: "",
          price: "",
          images: [],
        });
      } else if (mode === "edit" && product.id) {
        await editProduct({
          id: product.id,
          data: formData,
        }).unwrap();
        reload();
      }

      setOpen(false);
    } catch (error) {
      console.error("❌ Failed to submit product:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {mode === "add" ? "Add New Product" : "Edit Product"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Fill in details to add a new product."
              : "Update product details below."}
          </DialogDescription>
        </DialogHeader>

        {/* Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
          {/* Image Upload */}
          <div className="lg:col-span-1">
            <h3 className="font-medium mb-2">Product Images</h3>
            <div className="bg-gray-100 rounded-lg aspect-square flex flex-wrap gap-2 p-2 mb-4 overflow-y-auto">
              {product.images.length > 0 ? (
                product.images.map((img, idx) => (
                  <div key={idx} className="relative w-20 h-20">
                    <img
                      src={
                        typeof img === "string" ? img : URL.createObjectURL(img)
                      }
                      alt={`Preview ${idx}`}
                      className="w-full h-full object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center w-full h-full text-gray-400">
                  <Upload size={32} className="mb-2" />
                  <span>No images uploaded</span>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="flex items-center justify-center px-4 py-2 border border-dashed border-gray-300 rounded-md hover:bg-gray-50">
                  <Upload size={16} className="mr-2" />
                  <span>Upload Images</span>
                </div>
              </label>
              <Input
                id="file-upload"
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
              <p className="text-xs text-gray-500">JPEG, PNG, GIF up to 5MB</p>
            </div>
          </div>

          {/* Product Details */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-medium">Product Information</h3>

            <div>
              <label className="text-sm font-medium mb-1 block">
                Product Name
              </label>
              <Input
                placeholder="Enter product name"
                value={product.title}
                onChange={(e) =>
                  setProduct({ ...product, title: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">
                Description
              </label>
              <Textarea
                placeholder="Enter product description"
                value={product.description}
                onChange={(e) =>
                  setProduct({ ...product, description: e.target.value })
                }
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Price ($)
                </label>
                <Input
                  placeholder="0.00"
                  type="number"
                  value={product.price}
                  onChange={(e) =>
                    setProduct({ ...product, price: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">
                  Category
                </label>
                <Select
                  onValueChange={(value) => {
                    setProduct({ ...product, category: value });
                  }}
                  value={product.category}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        mode === "edit" && product.category
                          ? product.category
                          : "Select Category"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Apparel">Apparel</SelectItem>
                    <SelectItem value="Home Goods">Home Goods</SelectItem>
                    <SelectItem value="Beauty">Beauty</SelectItem>
                    <SelectItem value="Fragrances">Fragrances</SelectItem>
                    <SelectItem value="Furniture">Furniture</SelectItem>
                    <SelectItem value="Groceries">Groceries</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with loading states */}
        <DialogFooter className="mt-6 flex justify-end gap-4">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={addLoading || editLoading}
          >
            Cancel
          </Button>
          <Button
            className="bg-blue-600 text-white hover:bg-blue-700"
            onClick={handleSubmit}
            disabled={addLoading || editLoading}
          >
            {addLoading || editLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {mode === "add" ? "Adding..." : "Updating..."}
              </div>
            ) : mode === "add" ? (
              <>
                <Plus size={18} className="mr-1" />
                Add Product
              </>
            ) : (
              "Update Product"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
