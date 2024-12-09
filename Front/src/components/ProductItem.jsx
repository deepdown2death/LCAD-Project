import { selectRole } from "@/features/auth/authSlice";
import { addOrder } from "@/requests/order";
import { MenuOutlined } from "@ant-design/icons";
import { Button, Card, Dropdown, Space } from "antd";
import Meta from "antd/es/card/Meta";
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ProductItem = ({ product, deleteProduct }) => {
  const navigate = useNavigate();
  const role = useSelector(selectRole);
  const items = [
    {
      label: (
        <p
          className="w-full capitalize "
          href="https://www.antgroup.com"
          onClick={() => {
            navigate(`/product/update/${product.id}`);
          }}
        >
          Update
        </p>
      ),
      key: "0",
    },
    {
      label: (
        <p
          className="w-full capitalize text-red-500"
          href="https://www.antgroup.com"
          onClick={() => {
            deleteProduct(product.id);
          }}
        >
          delete
        </p>
      ),
      key: "1",
    },
  ];

  const handleAddOrder = async () => {
    const data = {
      productId: product.id,
      price: product.price,
      preview: product.image,
    };

    const res = await addOrder(data);
    if (res.success) {
      toast.success(res.message);
      navigate("/");
    }
  };
  return (
    <Card className="col-span-12 lg:col-span-6 xl:col-span-3 min-w-full min-h-full">
      <div className="flex items-center justify-center">
        <img
          src={`data:image/jpeg;base64,${product.image}`}
          alt={product.name}
          className="size-52 object-cover object-center"
        />
      </div>
      <Meta title={product.name} />
      <div className="my-5 flex items-center gap-2">
        {product.sizes.map((size, index) => (
          <p key={index} className="bg-blue-500 rounded-full text-white px-3">
            {size}
          </p>
        ))}
      </div>
      <div className="w-full flex gap-5 mt-3">
        {role === "ADMIN" ? (
          <>
            <Button
              type="primary"
              className="w-full capitalize"
              onClick={() => navigate(`/product/${product.id}`)}
            >
              preview
            </Button>
            <Dropdown
              menu={{
                items,
              }}
              trigger={["click"]}
            >
              <MenuOutlined />
            </Dropdown>
          </>
        ) : (
          <>
            <Button
              type="primary"
              className="w-full capitalize"
              onClick={() => navigate(`/product/${product.id}`)}
            >
              details
            </Button>
            <Button
              className="w-full capitalize "
              onClick={() => {
                handleAddOrder();
              }}
            >
              Add Order
            </Button>
          </>
        )}
      </div>
    </Card>
  );
};

export default ProductItem;
