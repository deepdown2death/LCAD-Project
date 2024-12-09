import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
  TriangleAlert,
} from "lucide-react";
import { Bold, Italic, Underline } from "lucide-react";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAllOrders, getUserOrders, validateOrder } from "@/requests/order";
import { Dropdown, Modal } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { Label } from "./ui/label";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { selectRole } from "@/features/auth/authSlice";

export default function DashTable() {
  const role = useSelector(selectRole);

  const [sorting, setSorting] = React.useState();
  const [columnFilters, setColumnFilters] = React.useState();
  const [columnVisibility, setColumnVisibility] = React.useState();
  const [rowSelection, setRowSelection] = React.useState({});
  const [orders, setOrders] = React.useState([]);
  const columns = [
    {
      accessorKey: "preview", // maps to preview in OrderDTO
      header: () => <div className="text-center w-fit">Preview</div>,
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <img
            src={`data:image/jpeg;base64,${row.getValue("preview")}`}
            alt="Order Preview"
            className="w-36"
          />
        </div>
      ),
    },
    {
      accessorKey: "orderNo", // maps to orderNo in OrderDTO
      header: "Order No",
      cell: ({ row }) => <div>{row.getValue("orderNo")}</div>,
    },
    {
      accessorKey: "price", // maps to price in OrderDTO
      header: "Price",
      cell: ({ row }) => (
        <div>
          {row.getValue("quantity") !== null
            ? row.getValue("price") * row.getValue("quantity")
            : row.getValue("price")}{" "}
          Dh
        </div>
      ),
    },
    {
      accessorKey: "quantity", // maps to quantity in OrderDTO
      header: () => <div className="capitalize text-center">quantity</div>,

      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          {row.getValue("quantity") === null ? (
            <TriangleAlert color="red" />
          ) : (
            row.getValue("quantity")
          )}
        </div>
      ),
    },
    {
      accessorKey: "size", // maps to size in OrderDTO
      header: "Size",
      cell: ({ row }) => (
        <div>
          {row.getValue("size") === null ? (
            <TriangleAlert color="red" />
          ) : (
            row.getValue("size")
          )}
        </div>
      ),
    },
    {
      id: "action",
      header: () => <div className="text-center">Actions</div>,
      cell: ({ row }) => {
        const [isModalOpen, setIsModalOpen] = React.useState(false);
        const [quantity, setQuantity] = React.useState();
        const role = useSelector(selectRole);
        const orderValidation = async (data) => {
          const res = await validateOrder(data);
          if (res.success) {
            await getOrders();
            toast.success(res.message);
            setIsModalOpen(false);
          } else {
            toast.warn(res.message);
          }
        };

        const showModal = () => {
          setIsModalOpen(true);
        };
        const handleOk = () => {
          if (!quantity || !selectedSizes) {
            toast.error("Please provide both quantity and size.");
            return;
          }
          const data = {
            orderNo: row.original.orderNo,
            quantity: quantity,
            size: selectedSizes,
          };
          orderValidation(data);
        };
        const handleCancel = () => {
          setIsModalOpen(false);
        };
        const menuItems = [
          {
            label: (
              <>
                {role === "CUSTOMER" && (
                  <p
                    className="w-full capitalize"
                    onClick={() => {
                      showModal();
                    }}
                  >
                    Validate
                  </p>
                )}
              </>
            ),
            key: "0",
          },
          {
            type: "divider",
          },
          {
            label: (
              <p
                className="w-full first-letter:capitalize"
                onClick={() =>
                  navigator.clipboard.writeText(row.original.orderNo)
                }
              >
                Copy the ID
              </p>
            ),
            key: "1",
          },
        ];
        const [selectedSizes, setSelectedSizes] = React.useState();
        const sizeOptions = ["S", "M", "L", "XL", "XXL"];
        const handleSizeChange = (value) => {
          setSelectedSizes(value);
        };
        return (
          <div className="flex items-center justify-center">
            <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
              <MenuOutlined />
            </Dropdown>
            <Modal
              title="Validate the order"
              open={isModalOpen}
              onOk={handleOk}
              onCancel={handleCancel}
            >
              <div className="flex gap-2">
                <div className="col-span-6">
                  <Label className="block text-sm font-medium text-gray-700 capitalize">
                    Sizes
                  </Label>
                  <ToggleGroup
                    type="single"
                    value={selectedSizes}
                    onValueChange={handleSizeChange}
                  >
                    {sizeOptions.map((size, i) => (
                      <ToggleGroupItem
                        key={i}
                        value={size}
                        className="uppercase"
                      >
                        {size}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </div>
                <div className="w-full">
                  <Label className="block text-sm font-medium text-gray-700 capitalize">
                    QTY
                  </Label>
                  <Input
                    placeholder="Enter QTY"
                    type="number"
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>
              </div>
            </Modal>
          </div>
        );
      },
    },
  ];
  const getOrders = async () => {
    try {
      let response;
      if (role === "ADMIN") {
        response = await getAllOrders();
      } else {
        response = await getUserOrders();
      }

      if (response && response.content) {
        setOrders(response.content);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    }
  };

  React.useEffect(() => {
    getOrders();
  }, []);

  const table = useReactTable({
    data: orders || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter by order number..."
          value={table.getColumn("orderNo")?.getFilterValue() ?? ""}
          onChange={(event) =>
            table.getColumn("orderNo")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
