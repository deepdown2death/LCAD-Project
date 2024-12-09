import Filter from "@/components/Filter";
import Loading from "@/components/Loading";
import PaginationInput from "@/components/Pagination";
import ProductItem from "@/components/ProductItem";
import {
  deleteProducts,
  getFiltredProducts,
  getProducts,
} from "@/requests/product";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Products = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 10;

  const filterProducts = async (page = 1, filters) => {
    setLoading(true);
    try {
      const response = await getFiltredProducts(page - 1, filters);
      setProducts(response.content);
      setTotalItems(response.totalElements);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async (page = 1) => {
    setLoading(true);
    try {
      const response = await getProducts(page - 1);
      setProducts(response.content);
      setTotalItems(response.totalElements);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    const res = await deleteProducts(id);
    if (res.success) {
      fetchProducts(currentPage);
      toast.success(res.message);
    } else {
      toast.error(res.error);
    }
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchProducts(page);
  };

  // Fetch initial products
  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  return (
    <div className="container mx-auto">
      <Filter fetchProducts={fetchProducts} filterProducts={filterProducts} />
      {loading ? (
        <Loading />
      ) : (
        <>
          {products.length > 0 ? (
            <>
              <div className="grid grid-cols-12 place-items-center gap-4">
                {products.map((product) => (
                  <ProductItem
                    key={product.id}
                    product={product}
                    deleteProduct={deleteProduct}
                  />
                ))}
              </div>
              <PaginationInput
                currentPage={currentPage}
                handlePageChange={handlePageChange}
                pageSize={pageSize}
                totalItems={totalItems}
              />
            </>
          ) : (
            <p className="flex items-center justify-center">
              No products found
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default Products;
