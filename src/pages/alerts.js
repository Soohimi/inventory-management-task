"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Chip,
} from "@mui/material";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = async () => {
    const res = await fetch("/api/alerts");
    const data = await res.json();
    setAlerts(data);
    setLoading(false);
  };

  const handleResolve = async (id) => {
    await fetch("/api/alerts", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, resolved: true }),
    });
    fetchAlerts();
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  if (loading)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress sx={{ color: "primary.main" }} />
      </Box>
    );

  return (
    <Box sx={{ maxWidth: "100%", color: "#fff", p: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
        Low Stock Alerts
      </Typography>

      <Paper
        sx={{
          backgroundColor: "#1a1a1a",
          border: "1px solid #2a2a2a",
          borderRadius: 2,
          overflowX: "auto",
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "#ccc" }}>Product ID</TableCell>
              <TableCell sx={{ color: "#ccc" }}>Status</TableCell>
              <TableCell sx={{ color: "#ccc" }}>Message</TableCell>
              <TableCell sx={{ color: "#ccc" }}>Date</TableCell>
              <TableCell sx={{ color: "#ccc" }}>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {alerts.map((alert) => (
              <TableRow key={alert.id}>
                <TableCell sx={{ color: "#fff" }}>{alert.productId}</TableCell>
                <TableCell>
                  <Chip
                    label={alert.status}
                    color={
                      alert.status === "critical"
                        ? "error"
                        : alert.status === "low"
                        ? "warning"
                        : "success"
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell sx={{ color: "#fff" }}>{alert.message}</TableCell>
                <TableCell sx={{ color: "#fff" }}>
                  {new Date(alert.date).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {alert.resolved ? (
                    <Chip label="Resolved" color="success" size="small" />
                  ) : (
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleResolve(alert.id)}
                    >
                      Mark Resolved
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Box sx={{ p: 2 }}>
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={async () => {
              const res = await fetch("/api/checkLowStock", { method: "POST" });
              const data = await res.json();
              alert(data.message);
              fetchAlerts();
            }}
          >
            Check Low Stock
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
