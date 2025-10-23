"use client";

import { useEffect, useState } from "react";
import { Box, Typography, CircularProgress, Paper } from "@mui/material";
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import WarehouseBarChart from "@/components/dashboard/WarehouseBarChart";
import DashboardTable from "@/components/dashboard/DashboardTable";
import LowStockAlerts from "@/components/dashboard/LowStockAlerts";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [stock, setStock] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, wareRes, stockRes] = await Promise.all([
          fetch("/api/products").then((r) => r.json()),
          fetch("/api/warehouses").then((r) => r.json()),
          fetch("/api/stock").then((r) => r.json()),
        ]);
        setProducts(prodRes);
        setWarehouses(wareRes);
        setStock(stockRes);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const fetchAlerts = async () => {
    try {
      const res = await fetch("/api/checkLowStock", { method: "POST" });
      const data = await res.json();
      setAlerts(data.newAlerts || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, [stock]);

  if (loading)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#0f0f0f",
        }}
      >
        <CircularProgress sx={{ color: "primary.main" }} />
      </Box>
    );

  return (
    <Box sx={{ p: 2, backgroundColor: "#0f0f0f", minHeight: "100vh" }}>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: "#fff" }}>
        GreenSupply Dashboard
      </Typography>

      <Paper
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 2,
          backgroundColor: "#1a1a1a",
          border: "1px solid #2a2a2a",
        }}
        elevation={0}
      >
        <DashboardOverview
          products={products}
          warehouses={warehouses}
          stock={stock}
        />
      </Paper>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 3,
        }}
      >
        <Paper
          sx={{
            flex: 2,
            p: 2,
            borderRadius: 2,
            backgroundColor: "#1a1a1a",
            border: "1px solid #2a2a2a",
            display: "flex",
            flexDirection: "column",
            height: "460px",
          }}
          elevation={0}
        >
          <WarehouseBarChart warehouses={warehouses} stock={stock} />
        </Paper>

        <Paper
          sx={{
            flex: 1,
            p: 2,
            borderRadius: 2,
            backgroundColor: "#1a1a1a",
            border: "1px solid #2a2a2a",
            display: "flex",
            flexDirection: "column",
            height: "460px",
          }}
          elevation={0}
        >
          <Box sx={{ flex: 1, overflowY: "auto" }}>
            <LowStockAlerts alerts={alerts} onRefresh={fetchAlerts} />
          </Box>
        </Paper>
      </Box>

      <Paper
        sx={{
          p: 2,
          borderRadius: 2,
          backgroundColor: "#1a1a1a",
          border: "1px solid #2a2a2a",
          display: "flex",
          flexDirection: "column",
        }}
        elevation={0}
      >
        <Typography
          variant="subtitle1"
          sx={{ color: "#fff", fontWeight: 600, mb: 1 }}
        >
          Stock Overview
        </Typography>
        <Box sx={{ flex: 1, overflowY: "auto" }}>
          <DashboardTable products={products} stock={stock} />
        </Box>
      </Paper>
    </Box>
  );
}
