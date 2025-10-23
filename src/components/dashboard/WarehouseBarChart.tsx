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
import { Warehouse, StockItem } from "@/types";

interface WarehouseBarChartProps {
  warehouses: Warehouse[];
  stock: StockItem[];
}

interface ChartData {
  name: string;
  totalQty: number;
}

export default function WarehouseBarChart({ warehouses, stock }: WarehouseBarChartProps) {
  const data: ChartData[] = warehouses.map((w) => {
    const totalQty = stock
      .filter((s) => s.warehouseId === w.id)
      .reduce((sum, s) => sum + s.quantity, 0);
    return { name: w.name, totalQty };
  });

  return (
    <Card
      sx={{ mt: 4, backgroundColor: "#1e1e1e", color: "#fff", borderRadius: 2 }}
    >
      <CardContent>
        <Typography variant="h6" gutterBottom>
          🏭 Inventory per Warehouse
        </Typography>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="name" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e1e1e",
                  border: "1px solid #444",
                  borderRadius: "8px",
                  padding: "10px",
                  color: "#fff",
                }}
                labelStyle={{ fontWeight: "bold", color: "#fff" }}
                formatter={(value: number, name: string, props: any) => {
                  const { payload } = props;
                  return [`${value} items`, `Warehouse: ${payload.name}`];
                }}
              />
              <Bar dataKey="totalQty" fill="#444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
