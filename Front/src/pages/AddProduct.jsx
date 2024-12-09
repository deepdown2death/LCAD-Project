import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { addProduct } from "@/requests/product";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");

  const sizeOptions = ["S", "M", "L", "XL", "XXL"];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileType = file.type;
      const fileSize = file.size / 1024 / 1024; // Convert size to MB

      if (fileSize > 5) {
        alert("File size should be less than 5 MB");
        return;
      }

      if (!["image/jpeg", "image/png", "image/webp"].includes(fileType)) {
        alert("Only JPEG, PNG, and WebP files are allowed");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result.split(",")[1]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSizeChange = (value) => {
    setSelectedSizes(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // if (!productName || !productPrice || !selectedSizes.length || !image) {
    //   alert("All fields are required!");
    //   return;
    // }

    const productData = {
      image,
      name: productName,
      price: parseFloat(productPrice),
      sizes: selectedSizes,
      description: productDescription,
    };

    try {
      const res = await addProduct(productData);

      if (res.success) {
        navigate("/products");
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || "Failed to add product"}`);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-5">
        <Button className="capitalize" onClick={handleSubmit}>
          Add Product
        </Button>
      </div>
      <div className="flex gap-4">
        <Card className="w-3/4 h-fit">
          <CardContent>
            <form className="mt-2 grid-cols-12 grid items-center gap-2">
              <div className="col-span-6">
                <Label className="block text-sm font-medium text-gray-700">
                  Product Name
                </Label>
                <Input
                  type="text"
                  id="name"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
              </div>
              <div className="col-span-6">
                <Label className="block text-sm font-medium text-gray-700">
                  Product Price
                </Label>
                <Input
                  type="number"
                  id="price"
                  value={productPrice}
                  onChange={(e) => setProductPrice(e.target.value)}
                />
              </div>
              <div className="col-span-6">
                <Label className="block text-sm font-medium text-gray-700 capitalize">
                  Sizes
                </Label>
                <ToggleGroup
                  type="multiple"
                  value={selectedSizes}
                  onValueChange={handleSizeChange}
                >
                  {sizeOptions.map((size, i) => (
                    <ToggleGroupItem key={i} value={size} className="uppercase">
                      {size}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>
              <Textarea
                className="col-span-6"
                placeholder="Type your message here."
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
              />
            </form>
          </CardContent>
        </Card>
        <AddImage handleImageChange={handleImageChange} image={image} />
      </div>
    </div>
  );
};

export default AddProduct;

const AddImage = ({ handleImageChange, image }) => {
  return (
    <Card className="w-1/4 h-56">
      <CardContent className="h-full pt-6">
        <input
          type="file"
          id="productImage"
          className="hidden"
          accept="image/*"
          onChange={handleImageChange}
        />
        <label htmlFor="productImage" className="cursor-pointer">
          {image ? (
            <div className="flex items-center justify-center h-full">
              <img
                src={`data:image/jpeg;base64,${image}`}
                alt="Selected"
                className="max-w-full min-h-40 max-h-[185px]"
              />
            </div>
          ) : (
            <div className="text-center h-full flex flex-col justify-around">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-12 h-12 text-gray-700 mx-auto mb-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                />
              </svg>
              <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-700">
                Upload Image
              </h5>
              <p className="text-sm text-gray-500">
                Choose a photo less than <b>5 MB</b> in <b>JPG, PNG, or WebP</b>{" "}
                format.
              </p>
            </div>
          )}
        </label>
      </CardContent>
    </Card>
  );
};
