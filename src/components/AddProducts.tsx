"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
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
import { Plus, Trash } from "lucide-react";
import { useAddProductMutation } from "@/services/productApi";

interface Product {
  _id?: string | number;
  title: string;
  description: string;
  category: string;
  price: string | number;
  images: (string | File)[];
}

export default function AddProductModal() {
  const [open, setOpen] = useState(false);
  const [product, setProduct] = useState<Product>({
    _id: Math.random(),
    title: "",
    category: "",
    description: "",
    price: "",
    images: [],
  });

  const [addProduct, { isLoading }] = useAddProductMutation();

  // Handle multiple file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setProduct({
        ...product,
        images: [...product.images, ...Array.from(files)],
      });
    }
  };

  // Remove image from preview
  const removeImage = (index: number) => {
    const updatedImages = product.images.filter((_, i) => i !== index);
    setProduct({ ...product, images: updatedImages });
  };

  const handleAddProduct = async () => {
    const formData = new FormData();
    formData.append("title", product.title);
    formData.append("category", product.category);
    formData.append("description", product.description);
    formData.append("price", product.price.toString());

    product.images.forEach((img) => formData.append("images", img));

    await addProduct(formData).unwrap();
    setOpen(false);
    setProduct({
      _id: Math.random(),
      title: "",
      category: "",
      description: "",
      price: "",
      images: [],
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2">
          <Plus /> Add Product
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>
            Fill in details to add a new product.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
          {/* Image Upload */}
          <div className="lg:col-span-1">
            <div className="bg-gray-100 rounded-lg aspect-square flex flex-wrap gap-2 p-2 mb-4">
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
                      className="absolute top-0 right-0 bg-white rounded-full p-1 text-red-500 shadow"
                    >
                      <Trash size={14} />
                    </button>
                  </div>
                ))
              ) : (
                <span className="text-gray-400">No Image</span>
              )}
            </div>
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
            />
          </div>

          {/* Product Details */}
          <div className="lg:col-span-2 space-y-4">
            <Input
              placeholder="Product Name"
              value={product.title}
              onChange={(e) =>
                setProduct({ ...product, title: e.target.value })
              }
            />
            <Textarea
              placeholder="Description"
              value={product.description}
              onChange={(e) =>
                setProduct({ ...product, description: e.target.value })
              }
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Price"
                value={product.price}
                onChange={(e) =>
                  setProduct({ ...product, price: e.target.value })
                }
              />
              <Select
                onValueChange={(value) =>
                  setProduct({ ...product, category: value })
                }
                value={product.category}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Electronics">Electronics</SelectItem>
                  <SelectItem value="Apparel">Apparel</SelectItem>
                  <SelectItem value="Home Goods">Home Goods</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6 flex justify-end gap-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            className="bg-blue-600 text-white hover:bg-blue-700"
            onClick={handleAddProduct}
            disabled={isLoading}
          >
            {isLoading ? "Adding..." : "Add Product"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
