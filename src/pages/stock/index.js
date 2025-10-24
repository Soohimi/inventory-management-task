import { useState, useEffect } from "react";
import Link from "next/link";
import {
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import GetAppIcon from "@mui/icons-material/GetApp";

export default function Stock() {
  const [stock, setStock] = useState([]);
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedStockId, setSelectedStockId] = useState(null);

  const [filterProduct, setFilterProduct] = useState("");
  const [filterWarehouse, setFilterWarehouse] = useState("");

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

  const handleExportCsv = () => {
    const stockDataForExport = filteredStock.map((item) => ({
      "Product Name": getProductName(item.productId),
      "Warehouse Name": getWarehouseName(item.warehouseId),
      Quantity: item.quantity,
    }));

    if (stockDataForExport.length === 0) {
      alert("No data to export.");
      return;
    }

    const headers = Object.keys(stockDataForExport[0]);
    const csvContent = [
      headers.join(","),
      ...stockDataForExport.map((row) =>
        headers
          .map((header) => {
            let value = row[header];
            if (typeof value === "string" && value.includes(",")) {
              return `"${value}"`;
            }
            return value;
          })
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "stock_levels.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredStock = stock.filter((item) => {
    const productMatch =
      filterProduct === "" || item.productId === filterProduct;
    const warehouseMatch =
      filterWarehouse === "" || item.warehouseId === filterWarehouse;
    return productMatch && warehouseMatch;
  });

  const formControlStyle = {
    minWidth: 200,
    mr: 2,
    ".MuiInputBase-root": {
      color: "#fff",
      "& fieldset": { borderColor: "#444" },
    },
    ".MuiInputLabel-root": { color: "#ccc" },
    ".MuiSelect-icon": { color: "#ccc" },
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

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<GetAppIcon />}
            onClick={handleExportCsv}
            sx={{
              color: "#4fc3f7",
              borderColor: "#4fc3f7",
              ":hover": {
                borderColor: "#4fc3f7",
                backgroundColor: "rgba(79, 195, 247, 0.08)",
              },
            }}
          >
            Export CSV
          </Button>
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
      </Box>

      {/* 💡 NEW: Filtering Controls */}
      <Box sx={{ display: "flex", mb: 3 }}>
        {/* Product Filter */}
        <FormControl variant="outlined" sx={formControlStyle}>
          <InputLabel id="product-filter-label">Filter by Product</InputLabel>
          <Select
            labelId="product-filter-label"
            id="product-filter"
            value={filterProduct}
            onChange={(e) => setFilterProduct(e.target.value)}
            label="Filter by Product"
          >
            <MenuItem value="">
              <em>All Products</em>
            </MenuItem>
            {products.map((p) => (
              <MenuItem key={p.id} value={p.id}>
                {p.name} ({p.sku})
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Warehouse Filter */}
        <FormControl variant="outlined" sx={formControlStyle}>
          <InputLabel id="warehouse-filter-label">
            Filter by Warehouse
          </InputLabel>
          <Select
            labelId="warehouse-filter-label"
            id="warehouse-filter"
            value={filterWarehouse}
            onChange={(e) => setFilterWarehouse(e.target.value)}
            label="Filter by Warehouse"
          >
            <MenuItem value="">
              <em>All Warehouses</em>
            </MenuItem>
            {warehouses.map((w) => (
              <MenuItem key={w.id} value={w.id}>
                {w.name} ({w.code})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      {/* 💡 END: Filtering Controls */}

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
            {/* 💡 Use filteredStock here */}
            {filteredStock.map((item) => (
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
                <TableCell sx={{ color: "#ccc" }}>
                  {getProductName(item.productId)}
                </TableCell>
                <TableCell sx={{ color: "#ccc" }}>
                  {getWarehouseName(item.warehouseId)}
                </TableCell>
                <TableCell align="right" sx={{ color: "#ccc" }}>
                  {item.quantity}
                </TableCell>
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
            {/* 💡 Check filteredStock length */}
            {filteredStock.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  align="center"
                  sx={{ py: 3, color: "#ccc" }}
                >
                  No stock records available based on current filters.
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
          },
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
