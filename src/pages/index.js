import { useEffect, useState } from "react";
import { Container, Typography, CircularProgress } from "@mui/material";
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import DashboardTable from "@/components/dashboard/DashboardTable";
import LowStockList from "@/components/dashboard/LowStockList";
import WarehouseBarChart from "@/components/dashboard/WarehouseBarChart";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [pRes, wRes, sRes] = await Promise.all([
          fetch("/api/products").then((r) => r.json()),
          fetch("/api/warehouses").then((r) => r.json()),
          fetch("/api/stock").then((r) => r.json()),
        ]);
        setProducts(pRes);
        setWarehouses(wRes);
        setStock(sRes);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading)
    return (
      <Container sx={{ textAlign: "center", mt: 10 }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading dashboard...
        </Typography>
      </Container>
    );

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        📊 Inventory Dashboard
      </Typography>

      <DashboardOverview
        products={products}
        warehouses={warehouses}
        stock={stock}
      />

      <WarehouseBarChart warehouses={warehouses} stock={stock} />

      <LowStockList products={products} stock={stock} />

      <DashboardTable products={products} stock={stock} />
    </Container>
  );
}
