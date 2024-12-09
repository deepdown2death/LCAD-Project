import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { updateProduct, getOneProduct } from "@/requests/product";
import AddImage from "@/components/AddImage";

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentProduct, setCurrentProduct] = useState(null);
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

    const productData = {
      image,
      name: productName,
      price: parseFloat(productPrice),
      sizes: selectedSizes,
      description: productDescription,
    };

    try {
      const res = await updateProduct(id, productData);

      if (res.success) {
        navigate("/products");
      } else {
        alert(`Error: ${res.message || "Failed to update product"}`);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const getAProduct = async (id) => {
    try {
      const res = await getOneProduct(id);
      if (res.success) {
        const product = res.content;
        setCurrentProduct(product);
        setProductName(product.name);
        setProductPrice(product.price.toString());
        setProductDescription(product.description);
        setSelectedSizes(product.sizes || []);
        setImage(product.image || null);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getAProduct(id);
  }, [id]);

  return (
    <div>
      <div className="flex justify-end mb-5">
        <Button className="capitalize" onClick={handleSubmit}>
          Update Product
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
                placeholder="Type product description here."
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

export default UpdateProduct;
