import React, { useState } from "react";
import { Input } from "./ui/input";
import { Rate, Slider } from "antd";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { Button } from "./ui/button";
import { useSelector } from "react-redux";
import { selectRole } from "@/features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { exportProducts, importProducts } from "@/requests/product";
import { toast } from "react-toastify";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const Filter = ({ filterProducts, fetchProducts }) => {
  const navigate = useNavigate();
  const marks = {
    0: "0Dh",
    1000: "1000Dh",
  };
  const size = ["S", "M", "L", "XL", "XXL"];
  const role = useSelector(selectRole);
  const [name, setName] = useState("");
  const [sliderValue, setSliderValue] = useState([0, 500]);
  const [rating, setRating] = useState(0);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [file, setFile] = useState(null);
  const [sortDir, setSortDir] = useState("asc");

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleSliderChange = (value) => {
    setSliderValue(value);
  };

  const handleRatingChange = (value) => {
    setRating(value);
  };

  const handleSizeChange = (value) => {
    setSelectedSizes(value);
  };

  const handleSubmit = () => {
    const filters = {
      name: name || undefined,
      minPrice: sliderValue[0],
      maxPrice: sliderValue[1],
      minAverageRating: rating === 0 ? null : rating,
      sizes: selectedSizes.join(",") || undefined,
      sortDir,
    };

    filterProducts(1, filters);
  };

  const handleReset = () => {
    setName("");
    setSliderValue([0, 500]);
    setRating(0);
    setSelectedSizes([]);
    setFile(null);

    fetchProducts(1);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file && file.type === "text/csv") {
      setFile(file);

      if (!file) {
        alert("Please select a file to import.");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await importProducts(formData);
        if (res.success) {
          toast.success(res.message);
          fetchProducts(1);
        } else {
          toast.error(res.message);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("Please select a valid CSV file.");
    }
  };

  return (
    <div className="grid grid-cols-3 md:grid-cols-12 gap-7 mb-4 items-center">
      <Input
        type="text"
        placeholder="name"
        className="col-span-3"
        value={name}
        onChange={handleNameChange}
      />
      <div className="col-span-3 flex items-center">
        <Slider
          range
          min={0}
          max={1000}
          className="w-full"
          marks={marks}
          value={sliderValue}
          onChange={handleSliderChange}
        />
      </div>
      <div className="col-span-3 flex items-center justify-center gap-3">
        <p className="capitalize">min rating</p>
        <Rate value={rating} onChange={handleRatingChange} />
      </div>
      <div className="col-span-3 flex justify-center items-center">
        <ToggleGroup
          type="multiple"
          value={selectedSizes}
          onValueChange={handleSizeChange}
        >
          {size.map((size, i) => (
            <ToggleGroupItem key={i} value={size} className="uppercase">
              {size}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
      <Button className="col-span-2" onClick={handleSubmit}>
        Apply Filters
      </Button>
      <Button
        variant="destructive"
        className="col-span-2"
        onClick={handleReset}
      >
        Reset Filters
      </Button>
      {role === "CUSTOMER" && (
        <Select onValueChange={(data) => setSortDir(data)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort By Price (asc)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc" className="capitalize">
              asc
            </SelectItem>
            <SelectItem value="desc" className="capitalize">
              desc
            </SelectItem>
          </SelectContent>
        </Select>
      )}
      {role === "ADMIN" && (
        <>
          <Button
            className="col-span-2 bg-blue-500 hover:bg-blue-700 capitalize"
            onClick={() => navigate("/product/add")}
          >
            add product
          </Button>
          <Button
            className="col-span-2 bg-green-500 hover:bg-green-700 capitalize"
            onClick={async () => await exportProducts()}
          >
            Export products
          </Button>

          {/* Import Product Button */}
          <Button
            className="col-span-2 bg-yellow-500 hover:bg-yellow-700 capitalize"
            onClick={() => document.getElementById("file-input").click()} // Trigger file input
          >
            Import product
          </Button>

          {/* Hidden file input for CSV */}
          <input
            id="file-input"
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleFileChange}
          />
      
        </>
      )}
    </div>
  );
};
export default Filter;
