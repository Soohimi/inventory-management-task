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
} from "@mui/material";

export default function DashboardTable({ products, stock }) {
  const [searchTerm, setSearchTerm] = useState("");

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

  return (
    <TableContainer component={Paper} sx={{ mt: 4, overflowX: "auto", p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Product Stock Summary
      </Typography>

      <TextField
        label="Search Products..."
        variant="outlined"
        fullWidth
        sx={{ mb: 2 }}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

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
          {filtered.map((p) => (
            <TableRow key={p.id} hover>
              <TableCell>{p.name}</TableCell>
              <TableCell>{p.sku}</TableCell>
              <TableCell>{p.category}</TableCell>
              <TableCell align="right">{p.totalQty}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
