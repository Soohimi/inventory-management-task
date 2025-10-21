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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <TextField
        label="Search Products..."
        variant="outlined"
        fullWidth
        sx={{ mt: 2 }}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <TableContainer component={Paper} sx={{ mt: 2, overflowX: "auto", p: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product Name</TableCell>
              <TableCell>SKU</TableCell>
              <TableCell>Category</TableCell>
              <TableCell align="right">Total Quantity</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedRows.map((p) => (
              <TableRow key={p.id} hover>
                <TableCell>
                  <Highlighter
                    searchWords={[searchTerm]}
                    autoEscape={true}
                    textToHighlight={p.name}
                  />
                </TableCell>
                <TableCell>
                  <Highlighter
                    searchWords={[searchTerm]}
                    autoEscape={true}
                    textToHighlight={p.sku}
                  />
                </TableCell>
                <TableCell>
                  <Highlighter
                    searchWords={[searchTerm]}
                    autoEscape={true}
                    textToHighlight={p.category}
                  />
                </TableCell>
                <TableCell align="right">{p.totalQty}</TableCell>
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
      />
    </>
  );
}
