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

  if (loading)
    return (
      <Container sx={{ textAlign: "center", mt: 5 }}>
        <CircularProgress />
      </Container>
    );

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        GreenSupply Dashboard
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
