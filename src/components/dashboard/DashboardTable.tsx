"use client";

import { useState } from "react";
import {
  TextField,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  TablePagination,
} from "@mui/material";
import Highlighter from "react-highlight-words";
import { Product, StockItem } from "@/types";

interface DashboardTableProps {
  products: Product[];
  stock: StockItem[];
}

interface ProductWithTotalQty extends Product {
  sku?: string;
  category?: string;
  totalQty: number;
}

export default function DashboardTable({
  products,
  stock,
}: DashboardTableProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);

  // Combine stock and product info
  const stockSummary: ProductWithTotalQty[] = products.map((product) => {
    const totalQty = stock
      .filter((s) => s.productId === product.id)
      .reduce((sum, s) => sum + s.quantity, 0);

    return {
      ...product,
      sku: (product as any).sku || "-",
      category: (product as any).category || "-",
      totalQty,
    };
  });

  // Filter based on search
  const filtered = stockSummary.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (p.category?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
  );

  const displayedRows = filtered.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (_event: unknown, newPage: number) =>
    setPage(newPage);

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div className="mt-8">
      <TextField
        label="Search Products..."
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputLabelProps={{ style: { color: "#ccc" } }}
        InputProps={{
          style: {
            color: "white",
            borderColor: "#555",
            background: "#1e1e1e",
          },
        }}
      />

      <TableContainer
        component={Paper}
        sx={{
          mt: 3,
          background: "#1e1e1e",
          color: "white",
          borderRadius: "12px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ background: "#2a2a2a" }}>
              <TableCell sx={{ color: "#ddd" }}>Product Name</TableCell>
              <TableCell sx={{ color: "#ddd" }}>SKU</TableCell>
              <TableCell sx={{ color: "#ddd" }}>Category</TableCell>
              <TableCell sx={{ color: "#ddd" }} align="right">
                Total Quantity
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedRows.map((p) => (
              <TableRow
                key={p.id}
                hover
                sx={{
                  "&:hover": { backgroundColor: "#333" },
                  transition: "0.3s ease",
                }}
              >
                <TableCell sx={{ color: "#fff" }}>
                  <Highlighter
                    searchWords={[searchTerm]}
                    autoEscape
                    textToHighlight={p.name}
                    highlightStyle={{
                      backgroundColor: "#4a90e2",
                      color: "#fff",
                    }}
                  />
                </TableCell>
                <TableCell sx={{ color: "#bbb" }}>
                  <Highlighter
                    searchWords={[searchTerm]}
                    autoEscape
                    textToHighlight={p.sku || "-"}
                    highlightStyle={{
                      backgroundColor: "#4a90e2",
                      color: "#fff",
                    }}
                  />
                </TableCell>
                <TableCell sx={{ color: "#bbb" }}>
                  <Highlighter
                    searchWords={[searchTerm]}
                    autoEscape
                    textToHighlight={p.category || "-"}
                    highlightStyle={{
                      backgroundColor: "#4a90e2",
                      color: "#fff",
                    }}
                  />
                </TableCell>
                <TableCell sx={{ color: "#fff" }} align="right">
                  {p.totalQty}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filtered.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        sx={{
          color: "white",
          ".MuiTablePagination-actions button": { color: "white" },
          ".MuiTablePagination-select": { color: "white" },
        }}
      />
    </div>
  );
}
