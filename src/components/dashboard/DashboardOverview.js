import { Grid, Card, CardContent, Typography } from "@mui/material";
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
      icon: <InventoryIcon fontSize="large" color="primary" />,
    },
    {
      title: "Warehouses",
      value: warehouses.length,
      icon: <WarehouseIcon fontSize="large" color="info" />,
    },
    {
      title: "Total Stock",
      value: totalStock,
      icon: <AssessmentIcon fontSize="large" color={stockColor} />,
    },
  ];

  return (
    <Grid container spacing={3}>
      {cards.map((card, index) => (
        <Grid item xs={12} md={4} key={index}>
          <Card sx={{ p: 2, textAlign: "center" }}>
            {card.icon}
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
