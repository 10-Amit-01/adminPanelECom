"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { CirclePlus, Plus, Upload } from "lucide-react";
import { DialogDescription } from "@radix-ui/react-dialog";

export default function AddProductModal() {
  const [open, setOpen] = useState(false);
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setProduct({ ...product, image: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleAddProduct = async () => {
    console.log("Product added:", product);
    setOpen(false); // close modal
    setProduct({
      name: "",
      description: "",
      price: "",
      category: "",
      image: "",
    }); // reset
    const response = await fetch("API", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ product: product }),
    });
    console.log(response);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700">
          <Plus /> Add Product
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new product
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
          {/* Image Upload */}
          <div className="lg:col-span-1">
            <div className="bg-gray-100 rounded-lg aspect-square flex items-center justify-center mb-4">
              <div
                className="w-full h-full bg-center bg-no-repeat bg-cover rounded-lg"
                style={{
                  backgroundImage: `url(${
                    product.image || "https://via.placeholder.com/150"
                  })`,
                }}
              ></div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2"
            >
              <Upload /> Upload Image
            </Button>
          </div>

          {/* Product Details */}
          <div className="lg:col-span-2 space-y-4">
            <Input
              placeholder="Product Name"
              value={product.name}
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
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
                value={product.category}
                onValueChange={(value) =>
                  setProduct({ ...product, category: value })
                }
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
            className="bg-blue-600 text-white hover:bg-blue-700 flex justify-center items-center gap-2"
            onClick={handleAddProduct}
          >
            <CirclePlus /> Add Product
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
