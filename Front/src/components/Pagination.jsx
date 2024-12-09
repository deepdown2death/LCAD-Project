import { Pagination } from "antd";
import React from "react";

const PaginationInput = ({
  currentPage,
  totalItems,
  pageSize,
  handlePageChange,
}) => {
  return (
    <div className="mt-4 flex justify-center">
      <Pagination
        current={currentPage}
        total={totalItems}
        pageSize={pageSize}
        onChange={handlePageChange}
      />
    </div>
  );
};

export default PaginationInput;
