import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  Chip,
} from "@mui/material";

export default function LowStockList({ products, stock }) {
  const lowStockItems = products
    .map((p) => {
      const totalQty = stock
        .filter((s) => s.productId === p.id)
        .reduce((sum, s) => sum + s.quantity, 0);
      return {
        ...p,
        totalQty,
        status:
          totalQty < p.reorderPoint
            ? totalQty < p.reorderPoint / 2
              ? "critical"
              : "low"
            : "ok",
      };
    })
    .filter((i) => i.status !== "ok");

  if (!lowStockItems.length) return null;

  return (
    <Card
      sx={{ mt: 4, backgroundColor: "#1e1e1e", color: "#fff", borderRadius: 2 }}
    >
      <CardContent>
        <Typography variant="h6" gutterBottom>
          ⚠️ Low Stock Items
        </Typography>
        <List>
          {lowStockItems.map((item) => (
            <ListItem
              key={item.id}
              divider
              sx={{ "&:hover": { backgroundColor: "#333" } }}
            >
              <Typography sx={{ flexGrow: 1 }}>{item.name}</Typography>
              <Chip
                label={item.status}
                color={item.status === "critical" ? "error" : "warning"}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
