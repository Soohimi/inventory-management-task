import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Box,
  TextField,
  MenuItem,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  };

  const handleClickOpen = (id) => {
    setSelectedProductId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProductId(null);
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/products/${selectedProductId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setProducts(
          products.filter((product) => product.id !== selectedProductId)
        );
        handleClose();
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <Container sx={{ mt: 4, mb: 8 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5" sx={{ color: "#fff", fontWeight: 500 }}>
          Products
        </Typography>
        <Button
          variant="contained"
          component={Link}
          href="/products/add"
          sx={{
            backgroundColor: "#4a90e2",
            color: "#fff",
            ":hover": { backgroundColor: "#357ABD" },
          }}
        >
          Add Product
        </Button>
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 2,
          backgroundColor: "#1e1e1e",
          border: "1px solid #2a2a2a",
        }}
      >
        <Table>
          <TableHead sx={{ backgroundColor: "#2a2a2a" }}>
            <TableRow>
              <TableCell sx={{ color: "#fff", fontWeight: 600 }}>SKU</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 600 }}>
                Name
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 600 }}>
                Category
              </TableCell>
              <TableCell align="right" sx={{ color: "#fff", fontWeight: 600 }}>
                Unit Cost
              </TableCell>
              <TableCell align="right" sx={{ color: "#fff", fontWeight: 600 }}>
                Reorder Point
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 600 }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow
                key={product.id}
                hover
                sx={{
                  "&:hover": { backgroundColor: "#333" },
                  backgroundColor: "#1e1e1e",
                }}
              >
                <TableCell sx={{ color: "#ccc" }}>{product.sku}</TableCell>
                <TableCell sx={{ color: "#ccc" }}>{product.name}</TableCell>
                <TableCell sx={{ color: "#ccc" }}>{product.category}</TableCell>
                <TableCell align="right" sx={{ color: "#ccc" }}>
                  ${product.unitCost.toFixed(2)}
                </TableCell>
                <TableCell align="right" sx={{ color: "#ccc" }}>
                  {product.reorderPoint}
                </TableCell>
                <TableCell>
                  <IconButton
                    component={Link}
                    href={`/products/edit/${product.id}`}
                    size="small"
                    sx={{ color: "#4fc3f7" }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleClickOpen(product.id)}
                    size="small"
                    sx={{ color: "#f44336" }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {products.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  align="center"
                  sx={{ py: 3, color: "#ccc" }}
                >
                  No products available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            backgroundColor: "#1e1e1e",
            border: "1px solid #2a2a2a",
            color: "#fff",
          },
        }}
      >
        <DialogTitle sx={{ color: "#fff" }}>Delete Product</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "#ccc" }}>
            Are you sure you want to delete this product? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} sx={{ color: "#ccc" }}>
            Cancel
          </Button>
          <Button onClick={handleDelete} sx={{ color: "#f44336" }} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
