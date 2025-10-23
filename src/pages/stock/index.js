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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

export default function Stock() {
  const [stock, setStock] = useState([]);
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedStockId, setSelectedStockId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    Promise.all([
      fetch("/api/stock").then((res) => res.json()),
      fetch("/api/products").then((res) => res.json()),
      fetch("/api/warehouses").then((res) => res.json()),
    ]).then(([stockData, productsData, warehousesData]) => {
      setStock(stockData);
      setProducts(productsData);
      setWarehouses(warehousesData);
    });
  };

  const getProductName = (productId) => {
    const product = products.find((p) => p.id === productId);
    return product ? `${product.name} (${product.sku})` : "Unknown";
  };

  const getWarehouseName = (warehouseId) => {
    const warehouse = warehouses.find((w) => w.id === warehouseId);
    return warehouse ? `${warehouse.name} (${warehouse.code})` : "Unknown";
  };

  const handleClickOpen = (id) => {
    setSelectedStockId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedStockId(null);
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/stock/${selectedStockId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setStock(stock.filter((item) => item.id !== selectedStockId));
        handleClose();
      }
    } catch (error) {
      console.error("Error deleting stock:", error);
    }
  };

  return (
    <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 500, color: "#fff" }}>
            Stock Levels
          </Typography>
          <Button
            variant="contained"
            component={Link}
            href="/stock/add"
            sx={{
              backgroundColor: "#2a2a2a",
              color: "#fff",
              ":hover": { backgroundColor: "#3a3a3a" },
            }}
          >
            Add Stock Record
          </Button>
        </Box>

        <TableContainer 
          component={Paper}
          sx={{
            borderRadius: 2,
            backgroundColor: "#1a1a1a",
            border: "1px solid #2a2a2a",
          }}
        >
          <Table>
            <TableHead sx={{ backgroundColor: "#2a2a2a" }}>
              <TableRow>
                <TableCell sx={{ color: "#fff", fontWeight: 600 }}>
                  Product
                </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: 600 }}>
                  Warehouse
                </TableCell>
                <TableCell align="right" sx={{ color: "#fff", fontWeight: 600 }}>
                  Quantity
                </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: 600 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stock.map((item) => (
                <TableRow 
                  key={item.id}
                  hover
                  sx={{
                    "&:hover": {
                      backgroundColor: "#2a2a2a",
                    },
                    backgroundColor: "#1a1a1a",
                  }}
                >
                  <TableCell sx={{ color: "#ccc" }}>{getProductName(item.productId)}</TableCell>
                  <TableCell sx={{ color: "#ccc" }}>{getWarehouseName(item.warehouseId)}</TableCell>
                  <TableCell align="right" sx={{ color: "#ccc" }}>{item.quantity}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      component={Link}
                      href={`/stock/edit/${item.id}`}
                      size="small"
                      sx={{ color: "#4fc3f7" }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleClickOpen(item.id)}
                      size="small"
                      sx={{ color: "#f44336" }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {stock.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 3, color: "#ccc" }}>
                    No stock records available.
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
              backgroundColor: "#1a1a1a",
              border: "1px solid #2a2a2a",
            }
          }}
        >
          <DialogTitle sx={{ color: "#fff" }}>Delete Stock Record</DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ color: "#ccc" }}>
              Are you sure you want to delete this stock record? This action
              cannot be undone.
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
    </Box>
  );
}
