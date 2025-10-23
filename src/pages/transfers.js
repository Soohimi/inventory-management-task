"use client";

import { useState, useEffect, useRef } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";

export default function TransfersPage() {
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    productId: "",
    fromWarehouseId: "",
    toWarehouseId: "",
    quantity: "",
  });
  const [message, setMessage] = useState({
    open: false,
    text: "",
    severity: "success",
  });

  const bcRef = useRef(null);
  useEffect(() => {
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      bcRef.current = new BroadcastChannel("inventory_channel");
    }
    return () => {
      if (bcRef.current) bcRef.current.close();
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, wareRes, transRes] = await Promise.all([
          fetch("/api/products").then((r) => r.json()),
          fetch("/api/warehouses").then((r) => r.json()),
          fetch("/api/transfers").then((r) => r.json()),
        ]);
        setProducts(prodRes);
        setWarehouses(wareRes);
        setTransfers(transRes);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.productId ||
      !form.fromWarehouseId ||
      !form.toWarehouseId ||
      !form.quantity
    ) {
      setMessage({
        open: true,
        text: "Please fill all fields",
        severity: "error",
      });
      return;
    }
    if (Number(form.fromWarehouseId) === Number(form.toWarehouseId)) {
      setMessage({
        open: true,
        text: "Source and destination cannot be the same",
        severity: "error",
      });
      return;
    }

    try {
      const res = await fetch("/api/transfers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, quantity: Number(form.quantity) }),
      });

      const payload = await res.json();
      if (!res.ok) throw new Error(payload?.message || "Transfer failed");

      setTransfers((prev) => [...prev, payload]);

      try {
        await fetch("/api/stock").then((r) => r.json());
      } catch (err) {
        console.warn("Failed to refresh stock after transfer", err);
      }

      if (bcRef.current) {
        bcRef.current.postMessage({ type: "stock-updated", transfer: payload });
      }

      setMessage({
        open: true,
        text: "Transfer created successfully",
        severity: "success",
      });

      setForm({
        productId: "",
        fromWarehouseId: "",
        toWarehouseId: "",
        quantity: "",
      });
    } catch (err) {
      console.error(err);
      setMessage({
        open: true,
        text: err.message || "Error occurred",
        severity: "error",
      });
    }
  };

  if (loading) {
    return (
      <Container sx={{ textAlign: "center", mt: 5 }}>
        <CircularProgress color="inherit" />
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4, mb: 8 }}>
      <Typography variant="h4" gutterBottom sx={{ color: "#fff" }}>
        Stock Transfers
      </Typography>

      <Card sx={{ mb: 4, p: 2, backgroundColor: "#1e1e1e", color: "#fff" }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ color: "#fff" }}>
            Initiate New Transfer
          </Typography>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <TextField
                  select
                  label="Product"
                  name="productId"
                  value={form.productId}
                  onChange={handleChange}
                  fullWidth
                  InputLabelProps={{ style: { color: "#ccc" } }}
                  InputProps={{
                    style: {
                      color: "#fff",
                      backgroundColor: "#2a2a2a",
                      borderRadius: 4,
                    },
                  }}
                >
                  {products.map((p) => (
                    <MenuItem key={p.id} value={p.id}>
                      {p.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  select
                  label="From Warehouse"
                  name="fromWarehouseId"
                  value={form.fromWarehouseId}
                  onChange={handleChange}
                  fullWidth
                  InputLabelProps={{ style: { color: "#ccc" } }}
                  InputProps={{
                    style: {
                      color: "#fff",
                      backgroundColor: "#2a2a2a",
                      borderRadius: 4,
                    },
                  }}
                >
                  {warehouses.map((w) => (
                    <MenuItem key={w.id} value={w.id}>
                      {w.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  select
                  label="To Warehouse"
                  name="toWarehouseId"
                  value={form.toWarehouseId}
                  onChange={handleChange}
                  fullWidth
                  InputLabelProps={{ style: { color: "#ccc" } }}
                  InputProps={{
                    style: {
                      color: "#fff",
                      backgroundColor: "#2a2a2a",
                      borderRadius: 4,
                    },
                  }}
                >
                  {warehouses.map((w) => (
                    <MenuItem key={w.id} value={w.id}>
                      {w.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} md={2}>
                <TextField
                  label="Quantity"
                  name="quantity"
                  type="number"
                  value={form.quantity}
                  onChange={handleChange}
                  fullWidth
                  InputLabelProps={{ style: { color: "#ccc" } }}
                  InputProps={{
                    style: {
                      color: "#fff",
                      backgroundColor: "#2a2a2a",
                      borderRadius: 4,
                    },
                  }}
                />
              </Grid>

              <Grid
                item
                xs={12}
                md={1}
                sx={{ display: "flex", alignItems: "center" }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    p: 1.8,
                    fontSize: "0.8rem",
                    backgroundColor: "#4a90e2",
                    color: "#fff",
                    "&:hover": { backgroundColor: "#357ABD" },
                  }}
                  fullWidth
                >
                  Transfer
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>

      <Card sx={{ backgroundColor: "#1e1e1e", color: "#fff" }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ color: "#fff" }}>
            Transfer History
          </Typography>

          <TableContainer
            component={Paper}
            sx={{ backgroundColor: "#2a2a2a", borderRadius: 2 }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#3a3a3a" }}>
                  <TableCell sx={{ color: "#ccc" }}>Product</TableCell>
                  <TableCell sx={{ color: "#ccc" }}>From</TableCell>
                  <TableCell sx={{ color: "#ccc" }}>To</TableCell>
                  <TableCell sx={{ color: "#ccc" }} align="right">
                    Quantity
                  </TableCell>
                  <TableCell sx={{ color: "#ccc" }} align="right">
                    Date
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transfers.map((t) => (
                  <TableRow
                    key={t.id}
                    sx={{
                      "&:hover": { backgroundColor: "#333" },
                      transition: "0.3s ease",
                    }}
                  >
                    <TableCell sx={{ color: "#fff" }}>
                      {products.find((p) => p.id === t.productId)?.name ||
                        t.productId}
                    </TableCell>
                    <TableCell sx={{ color: "#fff" }}>
                      {warehouses.find((w) => w.id === t.fromWarehouseId)
                        ?.name || t.fromWarehouseId}
                    </TableCell>
                    <TableCell sx={{ color: "#fff" }}>
                      {warehouses.find((w) => w.id === t.toWarehouseId)?.name ||
                        t.toWarehouseId}
                    </TableCell>
                    <TableCell sx={{ color: "#fff" }} align="right">
                      {t.quantity}
                    </TableCell>
                    <TableCell sx={{ color: "#fff" }} align="right">
                      {t.date ? new Date(t.date).toLocaleString() : "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Snackbar
        open={message.open}
        autoHideDuration={3000}
        onClose={() => setMessage({ ...message, open: false })}
      >
        <Alert
          severity={message.severity}
          sx={{ width: "100%", backgroundColor: "#2a2a2a", color: "#fff" }}
        >
          {message.text}
        </Alert>
      </Snackbar>
    </Container>
  );
}
