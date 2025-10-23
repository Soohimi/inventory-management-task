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
  Typography,
  TablePagination,
} from "@mui/material";
import Highlighter from "react-highlight-words";

export default function DashboardTable({ products, stock }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const stockSummary = products.map((product) => {
    const totalQty = stock
      .filter((s) => s.productId === product.id)
      .reduce((sum, s) => sum + s.quantity, 0);
    return { ...product, totalQty };
  });

  const filtered = stockSummary.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayedRows = filtered.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
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
                    autoEscape={true}
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
                    autoEscape={true}
                    textToHighlight={p.sku}
                    highlightStyle={{
                      backgroundColor: "#4a90e2",
                      color: "#fff",
                    }}
                  />
                </TableCell>
                <TableCell sx={{ color: "#bbb" }}>
                  <Highlighter
                    searchWords={[searchTerm]}
                    autoEscape={true}
                    textToHighlight={p.category}
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
