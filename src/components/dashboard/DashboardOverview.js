import { Grid, Card, CardContent, Typography, Box } from "@mui/material";
import InventoryIcon from "@mui/icons-material/Inventory";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import AssessmentIcon from "@mui/icons-material/Assessment";

export default function DashboardOverview({ products, warehouses, stock }) {
  const totalStock = stock.reduce((sum, s) => sum + s.quantity, 0);

  let stockColor = "success";
  if (totalStock < products.reduce((sum, p) => sum + p.reorderPoint / 2, 0)) {
    stockColor = "error";
  } else if (
    totalStock < products.reduce((sum, p) => sum + p.reorderPoint, 0)
  ) {
    stockColor = "warning";
  }

  const cards = [
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
      {cards.map((card, idx) => (
        <Grid item xs={12} md={4} key={idx}>
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
              <Typography variant="h4">{card.value}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
