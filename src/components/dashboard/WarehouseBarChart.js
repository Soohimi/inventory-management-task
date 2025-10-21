import { Card, CardContent, Typography } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function WarehouseBarChart({ warehouses, stock }) {
  const data = warehouses.map((w) => {
    const totalQty = stock
      .filter((s) => s.warehouseId === w.id)
      .reduce((sum, s) => sum + s.quantity, 0);
    return { name: w.name, totalQty };
  });

  return (
    <Card sx={{ mt: 4 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          🏭 Inventory per Warehouse
        </Typography>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: "10px",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                }}
                labelStyle={{ fontWeight: "bold", color: "#333" }}
                formatter={(value, name, props) => {
                  const { payload } = props;
                  return [`${value} items`, `Warehouse: ${payload.name}`];
                }}
              />
              <Bar dataKey="totalQty" fill="#4CAF50" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
