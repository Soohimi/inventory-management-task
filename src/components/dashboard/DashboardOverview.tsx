import { Grid, Card, CardContent, Typography, Box } from "@mui/material";
import InventoryIcon from "@mui/icons-material/Inventory";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import AssessmentIcon from "@mui/icons-material/Assessment";
import { Product, Warehouse, StockItem } from "@/types";
import { ReactElement } from "react";

interface DashboardOverviewProps {
  products: Product[];
  warehouses: Warehouse[];
  stock: StockItem[];
}

interface OverviewCard {
  title: string;
  value: number;
  icon: ReactElement;
}

export default function DashboardOverview({
  products,
  warehouses,
  stock,
}: DashboardOverviewProps) {
  // total stock quantity
  const totalStock = stock.reduce((sum, s) => sum + (s.quantity ?? 0), 0);

  // determine stock color based on reorder points
  let stockColor: "success" | "warning" | "error" = "success";
  const reorderHalf = products.reduce(
    (sum, p) => sum + (p.reorderPoint ?? 0) / 2,
    0
  );
  const reorderTotal = products.reduce(
    (sum, p) => sum + (p.reorderPoint ?? 0),
    0
  );

  if (totalStock < reorderHalf) {
    stockColor = "error";
  } else if (totalStock < reorderTotal) {
    stockColor = "warning";
  }

  const cards: OverviewCard[] = [
    {
      title: "Products",
      value: products.length,
      icon: <InventoryIcon sx={{ fontSize: 40, color: "#fff" }} />,
    },
    {
      title: "Warehouses",
      value: warehouses.length,
      icon: <WarehouseIcon sx={{ fontSize: 40, color: "#fff" }} />,
    },
    {
      title: "Total Stock",
      value: totalStock,
      icon: <AssessmentIcon sx={{ fontSize: 40, color: "#fff" }} />,
    },
  ];

  return (
    <Grid container spacing={3}>
      {cards.map((card) => (
        <Grid item xs={12} md={4} key={card.title}>
          <Card
            sx={{
              p: 2,
              textAlign: "center",
              backgroundColor: "#1e1e1e",
              color: "#fff",
              borderRadius: 2,
              "&:hover": { boxShadow: 6 },
            }}
          >
            <Box mb={1}>{card.icon}</Box>
            <CardContent>
              <Typography variant="h6">{card.title}</Typography>
              <Typography
                variant="h4"
                color={
                  card.title === "Total Stock"
                    ? stockColor === "success"
                      ? "success.main"
                      : stockColor === "warning"
                      ? "warning.main"
                      : "error.main"
                    : "inherit"
                }
              >
                {card.value}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
